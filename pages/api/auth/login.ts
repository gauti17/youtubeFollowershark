import type { NextApiRequest, NextApiResponse } from 'next'
export const runtime = 'edge'

// Edge runtime compatible WooCommerce API helper
const apiBase = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL + '/wp-json/wc/v3'
const auth = 'Basic ' + btoa(process.env.WOOCOMMERCE_CONSUMER_KEY + ':' + process.env.WOOCOMMERCE_CONSUMER_SECRET)

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
    const customerResponse = await fetch(`${apiBase}/customers?email=${encodeURIComponent(email)}&per_page=1`, {
      headers: { 'Authorization': auth }
    })
    
    if (!customerResponse.ok) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' })
    }
    
    const customers = await customerResponse.json()
    if (!customers || customers.length === 0) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' })
    }

    const customer = customers[0]

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

    // Edge runtime compatible password validation using Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hash = btoa(String.fromCharCode.apply(null, hashArray))
    const isValidPassword = hash === passwordMeta.value

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' })
    }

    // Create a simple token using Web Crypto API (simplified for edge runtime)
    const payload = {
      customerId: customer.id,
      email: customer.email,
      firstName: customer.first_name,
      lastName: customer.last_name,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    }
    const token = btoa(JSON.stringify(payload))

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