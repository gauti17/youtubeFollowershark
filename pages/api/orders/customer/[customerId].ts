import type { NextApiRequest, NextApiResponse } from 'next'
import { wooCommerceAPI } from '../../../../lib/woocommerce'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' })
  }

  try {
    const { customerId } = req.query

    if (!customerId) {
      return res.status(400).json({ error: 'Kunden-ID ist erforderlich' })
    }

    // Verify JWT token (basic implementation)
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Nicht autorisiert' })
    }

    const token = authHeader.substring(7)
    
    try {
      const jwt = require('jsonwebtoken')
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
      
      // Verify token belongs to the requested customer
      if (decoded.customerId !== parseInt(customerId as string)) {
        return res.status(403).json({ error: 'Zugriff verweigert' })
      }
    } catch (jwtError) {
      return res.status(401).json({ error: 'Ungültiger Token' })
    }

    // Fetch orders for the customer
    console.log('=== ORDERS FETCH DEBUG ===')
    console.log('Fetching orders for customer ID:', customerId)
    
    const ordersResponse = await wooCommerceAPI.get('orders', {
      customer: customerId,
      per_page: 50,
      orderby: 'date',
      order: 'desc'
    })

    console.log('Orders response type:', typeof ordersResponse)
    console.log('Orders response keys:', Object.keys(ordersResponse || {}))
    console.log('Orders response data available:', !!ordersResponse?.data)
    console.log('Orders response direct array check:', Array.isArray(ordersResponse))
    
    // Handle both direct array response and response.data format
    const orders = Array.isArray(ordersResponse) ? ordersResponse : (ordersResponse?.data || [])
    
    console.log('Final orders count:', orders.length)
    
    // If no orders found by customer ID, try searching by email as fallback
    if (orders.length === 0) {
      console.log('No orders found by customer ID, trying email fallback...')
      
      // Get customer details to find email
      try {
        const customerResponse = await wooCommerceAPI.get(`customers/${customerId}`)
        const customerData = customerResponse?.email ? customerResponse : (customerResponse?.data || {})
        
        if (customerData.email) {
          console.log('Searching for orders with email:', customerData.email)
          
          // Search orders by billing email
          const ordersByEmailResponse = await wooCommerceAPI.get('orders', {
            search: customerData.email,
            per_page: 50,
            orderby: 'date',
            order: 'desc'
          })
          
          const ordersByEmail = Array.isArray(ordersByEmailResponse) ? ordersByEmailResponse : (ordersByEmailResponse?.data || [])
          console.log('Orders found by email search:', ordersByEmail.length)
          
          if (ordersByEmail.length > 0) {
            orders.push(...ordersByEmail)
          }
        }
      } catch (emailSearchError) {
        console.log('Email fallback search failed:', emailSearchError.message)
      }
    }
    
    console.log('=== END ORDERS DEBUG ===')

    // Format orders for frontend
    const formattedOrders = orders.map((order: any) => ({
      id: order.id,
      number: order.number,
      status: order.status,
      date_created: order.date_created,
      date_modified: order.date_modified,
      total: order.total,
      currency: order.currency,
      payment_method: order.payment_method,
      payment_method_title: order.payment_method_title,
      line_items: order.line_items.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        total: item.total,
        meta_data: item.meta_data
      })),
      billing: order.billing,
      meta_data: order.meta_data
    }))

    return res.status(200).json({
      success: true,
      orders: formattedOrders,
      total_count: orders.length
    })

  } catch (error: any) {
    console.error('Error fetching customer orders:', error)
    
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'API-Authentifizierung fehlgeschlagen' })
    }
    
    return res.status(500).json({ error: 'Fehler beim Laden der Bestellungen' })
  }
}