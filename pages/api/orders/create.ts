import { NextApiRequest, NextApiResponse } from 'next'
import { orderService } from '../../../lib/orderService'
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

    // Validate required fields
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Warenkorb ist leer' })
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      return res.status(400).json({ error: 'Erforderliche Rechnungsinformationen fehlen' })
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