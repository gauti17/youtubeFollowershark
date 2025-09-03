import type { NextApiRequest, NextApiResponse } from 'next'
export const runtime = 'edge'

// Edge runtime compatible WooCommerce API helper
const apiBase = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL + '/wp-json/wc/v3'
const auth = 'Basic ' + btoa(process.env.WOOCOMMERCE_CONSUMER_KEY + ':' + process.env.WOOCOMMERCE_CONSUMER_SECRET)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { token, email, password } = req.body

    if (!token || !email || !password) {
      return res.status(400).json({ error: 'Token, E-Mail und Passwort sind erforderlich' })
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Passwort muss mindestens 8 Zeichen lang sein' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Ungültige E-Mail-Adresse' })
    }

    // Find customer by email
    const customersResponse = await fetch(`${apiBase}/customers?email=${encodeURIComponent(email)}&per_page=1`, {
      headers: { 'Authorization': auth }
    })
    
    if (!customersResponse.ok) {
      return res.status(400).json({ error: 'Ungültiger Reset-Link' })
    }
    
    const customers = await customersResponse.json() || []
    
    if (customers.length === 0) {
      return res.status(400).json({ error: 'Ungültiger Reset-Link' })
    }

    const customer = customers[0]

    // Get customer's meta data to check reset token
    const customerResponse = await fetch(`${apiBase}/customers/${customer.id}`, {
      headers: { 'Authorization': auth }
    })
    
    if (!customerResponse.ok) {
      return res.status(400).json({ error: 'Ungültiger Reset-Link' })
    }
    
    const customerData = await customerResponse.json()

    // Find reset token and expiry in meta data
    let resetToken = null
    let resetExpiry = null

    if (customerData.meta_data) {
      for (const meta of customerData.meta_data) {
        if (meta.key === 'password_reset_token') {
          resetToken = meta.value
        }
        if (meta.key === 'password_reset_expiry') {
          resetExpiry = parseInt(meta.value)
        }
      }
    }

    // Validate reset token
    if (!resetToken || resetToken !== token) {
      return res.status(400).json({ error: 'Ungültiger oder abgelaufener Reset-Link' })
    }

    // Check if token has expired
    if (!resetExpiry || Date.now() > resetExpiry) {
      return res.status(400).json({ error: 'Reset-Link ist abgelaufen. Bitte fordern Sie einen neuen an.' })
    }

    // Hash the new password using Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedPassword = btoa(String.fromCharCode.apply(null, hashArray))
    
    // Update customer password
    await fetch(`${apiBase}/customers/${customer.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        meta_data: [
          // Update password hash and clear reset token
          {
            key: '_password_hash',
            value: hashedPassword
          },
          {
            key: 'password_reset_token',
            value: ''
          },
          {
            key: 'password_reset_expiry',
            value: ''
          }
        ]
      })
    })

    return res.status(200).json({
      success: true,
      message: 'Passwort wurde erfolgreich aktualisiert. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.'
    })

  } catch (error: any) {
    console.error('Password reset error:', error)
    
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'API-Konfigurationsfehler' })
    }
    
    if (error.response?.status === 400) {
      return res.status(400).json({ error: 'Ungültige Anfrage' })
    }
    
    return res.status(500).json({ error: 'Ein Fehler ist beim Zurücksetzen des Passworts aufgetreten' })
  }
}