import type { NextApiRequest, NextApiResponse } from 'next'
import { wooCommerceAPI } from '../../../lib/woocommerce'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'E-Mail-Adresse ist erforderlich' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Ungültige E-Mail-Adresse' })
    }

    // First, check if customer exists
    const customersResponse = await api.get('customers', {
      email: email,
      per_page: 1
    })

    const customers = customersResponse.data || []
    
    if (customers.length === 0) {
      // Don't reveal that email doesn't exist for security reasons
      return res.status(200).json({
        success: true,
        message: 'Falls diese E-Mail-Adresse in unserem System existiert, wurde eine Passwort-Reset-E-Mail gesendet.'
      })
    }

    const customer = customers[0]

    // Use WooCommerce's built-in password reset functionality
    // WooCommerce handles password reset tokens and emails automatically
    // We'll trigger the WordPress lost password functionality via REST API
    
    try {
      // Use WordPress REST API to trigger password reset
      // This uses WooCommerce's built-in email system
      const wpResponse = await fetch(`${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wp/v2/users/lost-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_login: email
        })
      })

      if (wpResponse.ok) {
        console.log('WooCommerce password reset email sent via WordPress API')
      } else {
        // If WordPress API fails, fall back to storing our own reset token
        // Generate password reset token
        const resetToken = Buffer.from(`${customer.id}:${Date.now()}:${Math.random()}`).toString('base64url')
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
        
        await api.put(`customers/${customer.id}`, {
          meta_data: [
            {
              key: 'password_reset_token',
              value: resetToken
            },
            {
              key: 'password_reset_expiry',
              value: expiryTime.toString()
            }
          ]
        })
        
        console.log('Fallback: Reset token stored in WooCommerce customer meta')
        console.log('Reset URL for manual sending:', `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`)
      }
    } catch (wpError) {
      console.error('WordPress API error:', wpError)
      
      // Fallback: Store reset token in WooCommerce
      const resetToken = Buffer.from(`${customer.id}:${Date.now()}:${Math.random()}`).toString('base64url')
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
      
      await api.put(`customers/${customer.id}`, {
        meta_data: [
          {
            key: 'password_reset_token',
            value: resetToken
          },
          {
            key: 'password_reset_expiry',
            value: expiryTime.toString()
          }
        ]
      })
      
      console.log('Fallback: Reset token stored after WP API error')
    }

    return res.status(200).json({
      success: true,
      message: 'Falls diese E-Mail-Adresse in unserem System existiert, wurde eine Passwort-Reset-E-Mail von WooCommerce gesendet.'
    })

  } catch (error: any) {
    console.error('Password reset error:', error)
    
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'API-Konfigurationsfehler' })
    }
    
    return res.status(500).json({ error: 'Ein Fehler ist beim Senden der E-Mail aufgetreten' })
  }
}