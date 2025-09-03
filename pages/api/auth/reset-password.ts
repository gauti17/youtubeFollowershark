import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || '',
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
  version: 'wc/v3'
})

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
    const customersResponse = await api.get('customers', {
      email: email,
      per_page: 1
    })

    const customers = customersResponse.data || []
    
    if (customers.length === 0) {
      return res.status(400).json({ error: 'Ungültiger Reset-Link' })
    }

    const customer = customers[0]

    // Get customer's meta data to check reset token
    const customerDetails = await api.get(`customers/${customer.id}`)
    const customerData = customerDetails.data

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

    // Update customer password
    await api.put(`customers/${customer.id}`, {
      password: password,
      meta_data: [
        // Clear reset token and expiry
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