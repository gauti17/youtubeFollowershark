import type { NextApiRequest, NextApiResponse } from 'next'
export const runtime = 'edge'

// Edge runtime compatible WooCommerce API helper
const apiBase = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL + '/wp-json/wc/v3'
const auth = 'Basic ' + btoa(process.env.WOOCOMMERCE_CONSUMER_KEY + ':' + process.env.WOOCOMMERCE_CONSUMER_SECRET)

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
      // Simple token validation for edge runtime
      const decoded = JSON.parse(atob(token))
      
      // Check token expiry
      if (decoded.exp && Date.now() / 1000 > decoded.exp) {
        return res.status(401).json({ error: 'Token abgelaufen' })
      }
      
      // Verify token belongs to the requested customer
      if (decoded.customerId !== parseInt(customerId as string)) {
        return res.status(403).json({ error: 'Zugriff verweigert' })
      }
    } catch (tokenError) {
      return res.status(401).json({ error: 'Ungültiger Token' })
    }

    // Fetch orders for the customer
    const ordersResponse = await fetch(`${apiBase}/orders?customer=${customerId}&per_page=50&orderby=date&order=desc`, {
      headers: { 'Authorization': auth }
    })
    
    if (!ordersResponse.ok) {
      return res.status(500).json({ error: 'Fehler beim Abrufen der Bestellungen' })
    }
    
    const orders = await ordersResponse.json() || []

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