import { NextApiRequest, NextApiResponse } from 'next'
import { orderService } from '../../../lib/orderService'
// Uses Node.js runtime for WooCommerce API compatibility
import { CartItem } from '../../../lib/CartContext'

interface CreateOrderRequest {
  cartItems: CartItem[]
  formData: {
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
  options: {
    paymentMethod?: string
    paymentMethodTitle?: string
    discountCode?: string
    discountAmount?: number
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' })
  }

  try {
    const { cartItems, formData, options }: CreateOrderRequest = req.body

    // Log the incoming request data for debugging
    console.log('=== Order Creation API Debug ===')
    console.log('Cart Items:', cartItems?.length || 0)
    console.log('Form Data received:', formData)
    console.log('Form Data validation:', {
      hasFirstName: !!formData?.firstName,
      hasLastName: !!formData?.lastName,
      hasEmail: !!formData?.email,
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      email: formData?.email
    })

    // Validate required fields
    if (!cartItems || cartItems.length === 0) {
      console.log('Validation failed: Empty cart')
      return res.status(400).json({ error: 'Warenkorb ist leer' })
    }

    if (!formData?.firstName?.trim()) {
      console.log('Validation failed: Missing firstName')
      return res.status(400).json({ error: 'Vorname ist erforderlich' })
    }

    if (!formData?.lastName?.trim()) {
      console.log('Validation failed: Missing lastName')
      return res.status(400).json({ error: 'Nachname ist erforderlich' })
    }

    if (!formData?.email?.trim()) {
      console.log('Validation failed: Missing email')
      return res.status(400).json({ error: 'E-Mail-Adresse ist erforderlich' })
    }

    // Create order
    const result = await orderService.createOrder(cartItems, formData, options)

    if (result.success) {
      const message = result.customerCreated 
        ? 'Bestellung erfolgreich erstellt! Ein Kundenaccount wurde für Sie erstellt und die Zugangsdaten wurden per E-Mail gesendet.'
        : 'Bestellung erfolgreich erstellt!'
        
      return res.status(200).json({
        success: true,
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        customerId: result.customerId,
        customerCreated: result.customerCreated,
        message
      })
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Fehler beim Erstellen der Bestellung'
      })
    }

  } catch (error) {
    console.error('API Error creating order:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Interner Serverfehler'
    })
  }
}