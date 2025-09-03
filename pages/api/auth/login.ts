import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
export const runtime = 'nodejs'

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || '',
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
  version: 'wc/v3'
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email und Passwort sind erforderlich' })
    }

    // Search for customer by email
    const customerResponse = await api.get('customers', {
      email: email,
      per_page: 1
    })

    if (!customerResponse.data || customerResponse.data.length === 0) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' })
    }

    const customer = customerResponse.data[0]

    // Note: WooCommerce REST API doesn't support password verification directly
    // In a real implementation, you would need to use WordPress authentication
    // For now, we'll implement a basic check against a stored hash in meta_data
    
    // Check if customer has a password hash in meta_data
    const passwordMeta = customer.meta_data?.find((meta: any) => meta.key === '_password_hash')
    
    if (!passwordMeta) {
      // Customer exists but no password set - redirect to password setup
      return res.status(402).json({ 
        error: 'Bitte setzen Sie Ihr Passwort zurück',
        requirePasswordReset: true,
        customerId: customer.id
      })
    }

    // Basic password validation (in production, use proper hashing)
    const bcrypt = require('bcryptjs')
    const isValidPassword = await bcrypt.compare(password, passwordMeta.value)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' })
    }

    // Create a simple JWT or session token (simplified for demo)
    const jwt = require('jsonwebtoken')
    const token = jwt.sign(
      { 
        customerId: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Return success with customer data
    return res.status(200).json({
      success: true,
      token,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        billing: customer.billing,
        dateCreated: customer.date_created
      }
    })

  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'API-Authentifizierung fehlgeschlagen' })
    }
    
    return res.status(500).json({ error: 'Ein Fehler ist aufgetreten' })
  }
}