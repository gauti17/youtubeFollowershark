import { wooCommerceAPI, WooCommerceOrder, BillingAddress, OrderLineItem } from './woocommerce'
import { CartItem } from './CartContext'
import { products } from '../data/products'
import { customerService } from './customerService'
import { productService } from './productService'

export interface CheckoutFormData {
  firstName: string
  lastName: string
  email: string
  country: string
  city: string
  postalCode: string
  address1?: string
  address2?: string
  phone?: string
}

export interface OrderServiceOptions {
  paymentMethod?: string
  paymentMethodTitle?: string
  customerNote?: string
  discountCode?: string
  discountAmount?: number
}

export class OrderService {
  
  /**
   * Convert cart items to WooCommerce line items
   */
  private async cartItemsToLineItems(cartItems: CartItem[]): Promise<OrderLineItem[]> {
    const lineItems: OrderLineItem[] = []
    
    for (const item of cartItems) {
      const product = products.find(p => p.id === item.productId)
      if (!product) {
        throw new Error(`Produkt nicht gefunden: ${item.productId}`)
      }

      // Ensure virtual product exists in WooCommerce
      let wooCommerceProductId: number
      try {
        wooCommerceProductId = await productService.ensureVirtualProduct(product.slug)
      } catch (error) {
        console.error(`Failed to create WooCommerce product for ${product.slug}, using fallback`, error)
        // Fallback: create a simple line item without product_id but with SKU
        wooCommerceProductId = 0
      }

      // item.price contains the price per service unit
      // item.quantity is the order multiplier (1, 2, 3, etc.)
      // item.selectedOptions.selectedQuantity contains the total service quantity
      
      const actualQuantity = item.selectedOptions.selectedQuantity || item.quantity
      const totalPrice = item.price * item.quantity // Calculate total price
      const unitPrice = item.price / (item.selectedOptions.selectedQuantity || 1) // Calculate unit price

      const lineItem: OrderLineItem = {
        name: `${product.name} - ${actualQuantity.toLocaleString('de-DE')} Stück`,
        quantity: item.quantity, // Use the actual order quantity
        price: item.price.toFixed(2), // Price per unit
        total: totalPrice.toFixed(2), // Total price (price × quantity)
        meta_data: [
          { key: '_service_type', value: product.category },
          { key: '_youtube_url', value: item.selectedOptions.url || '' },
          { key: '_speed_option', value: item.selectedOptions.speed || '' },
          { key: '_target_option', value: item.selectedOptions.target || '' },
          { key: '_selected_quantity', value: actualQuantity },
          { key: '_unit_price', value: unitPrice.toFixed(4) },
          { key: '_product_slug', value: product.slug },
          { key: '_order_timestamp', value: item.timestamp },
          { key: '_virtual_service', value: 'yes' }
        ]
      }

      // Add product_id if we have it, otherwise add SKU
      if (wooCommerceProductId > 0) {
        lineItem.product_id = wooCommerceProductId
      } else {
        // Fallback: use SKU instead of product_id
        lineItem.sku = `youshark_${product.slug}`
      }

      lineItems.push(lineItem)
    }

    return lineItems
  }

  /**
   * Convert form data to WooCommerce billing address
   */
  private formDataToBillingAddress(formData: CheckoutFormData): BillingAddress {
    return {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      country: formData.country,
      city: formData.city,
      postcode: formData.postalCode,
      address_1: formData.address1 || '',
      address_2: formData.address2 || '',
      phone: formData.phone || ''
    }
  }

  /**
   * Calculate processing fee
   */
  private calculateProcessingFee(subtotal: number): number {
    return subtotal * 0.029 // 2.9% processing fee
  }

  /**
   * Apply discount if valid
   */
  private calculateDiscount(subtotal: number, discountCode?: string): number {
    if (discountCode === 'SHARK20') {
      return subtotal * 0.2 // 20% discount
    }
    return 0
  }

  /**
   * Create order in WooCommerce
   */
  async createOrder(
    cartItems: CartItem[],
    formData: CheckoutFormData,
    options: OrderServiceOptions = {}
  ): Promise<{ success: boolean; orderId?: number; orderNumber?: string; customerId?: number; customerCreated?: boolean; error?: string }> {
    try {
      if (cartItems.length === 0) {
        throw new Error('Warenkorb ist leer')
      }

      // Step 1: Create or find customer account automatically (server-side)
      console.log('Creating customer account for:', formData.email)
      const customerResult = await customerService.createCustomer(formData)
      
      if (!customerResult.success) {
        throw new Error(`Kundenaccount konnte nicht erstellt werden: ${customerResult.error}`)
      }

      console.log('Customer account ready:', {
        customerId: customerResult.customerId,
        isExisting: customerResult.customerExists,
        email: formData.email
      })

      const lineItems = await this.cartItemsToLineItems(cartItems)
      const billingAddress = this.formDataToBillingAddress(formData)
      
      // Calculate totals
      const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      const processingFee = 0 // No processing fees
      const discount = this.calculateDiscount(subtotal, options.discountCode)
      const finalTotal = subtotal - discount

      // Determine order status based on payment method
      let orderStatus = 'processing' // Default status
      if (options.paymentMethod === 'bacs' || options.paymentMethod === 'bank_transfer' || 
          options.paymentMethodTitle?.toLowerCase().includes('bank')) {
        orderStatus = 'on-hold' // Bank transfer orders should be on hold until payment confirmed
      }

      const orderData: WooCommerceOrder = {
        customer_id: customerResult.customerId, // Link order to customer
        status: orderStatus,
        billing: billingAddress,
        shipping: billingAddress, // Same as billing for digital services
        line_items: lineItems,
        payment_method: options.paymentMethod || 'manual',
        payment_method_title: options.paymentMethodTitle || 'Manual Payment',
        customer_note: options.customerNote || '',
        set_paid: false, // Will be updated after payment confirmation
        meta_data: [
          { key: '_order_source', value: 'youshark_frontend' },
          { key: '_order_type', value: 'youtube_services' },
          { key: '_processing_fee', value: processingFee.toFixed(2) },
          { key: '_subtotal_before_fees', value: subtotal.toFixed(2) },
          { key: '_discount_applied', value: discount.toFixed(2) },
          { key: '_discount_code', value: options.discountCode || '' },
          { key: '_final_total', value: finalTotal.toFixed(2) },
          { key: '_order_date', value: new Date().toISOString() },
          { key: '_requires_fulfillment', value: 'yes' },
          { key: '_customer_id', value: customerResult.customerId?.toString() || '' },
          { key: '_customer_created', value: customerResult.customerExists ? 'existing' : 'new' }
        ]
      }

      // No processing fees

      // Add discount as coupon line
      if (discount > 0 && options.discountCode) {
        orderData.coupon_lines = [
          {
            code: options.discountCode,
            discount: discount.toFixed(2)
          }
        ]
      }

      console.log('Creating WooCommerce order:', orderData)

      const response = await wooCommerceAPI.createOrder(orderData)

      return {
        success: true,
        orderId: response.id,
        orderNumber: response.number,
        customerId: customerResult.customerId,
        customerCreated: !customerResult.customerExists
      }

    } catch (error) {
      console.error('Error creating WooCommerce order:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler aufgetreten'
      }
    }
  }

  /**
   * Update order status after payment
   */
  async updateOrderPaymentStatus(
    orderId: number, 
    paid: boolean = true
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const status = paid ? 'processing' : 'on-hold'
      await wooCommerceAPI.updateOrderStatus(orderId, status)
      
      return { success: true }
    } catch (error) {
      console.error('Error updating order payment status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Fehler beim Aktualisieren des Zahlungsstatus'
      }
    }
  }

  /**
   * Mark order as completed after service delivery
   */
  async completeOrder(orderId: number): Promise<{ success: boolean; error?: string }> {
    try {
      await wooCommerceAPI.updateOrderStatus(orderId, 'completed')
      return { success: true }
    } catch (error) {
      console.error('Error completing order:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Fehler beim Abschließen der Bestellung'
      }
    }
  }

  /**
   * Get order details
   */
  async getOrderDetails(orderId: number) {
    try {
      return await wooCommerceAPI.getOrder(orderId)
    } catch (error) {
      console.error('Error fetching order details:', error)
      throw error
    }
  }
}

// Export singleton instance
export const orderService = new OrderService()
export default OrderService