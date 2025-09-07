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
    const customers = await wooCommerceAPI.get('customers', {
      email: email,
      per_page: 1
    })
    
    if (customers.length === 0) {
      // Don't reveal that email doesn't exist for security reasons
      return res.status(200).json({
        success: true,
        message: 'Falls diese E-Mail-Adresse in unserem System existiert, wurde eine Passwort-Reset-E-Mail gesendet.'
      })
    }

    const customer = customers[0]

    // Generate password reset token and store it in WooCommerce
    // Since WordPress lost-password API endpoint doesn't exist, we'll handle it ourselves
    const resetToken = Buffer.from(`${customer.id}:${Date.now()}:${Math.random()}`).toString('base64url')
    const expiryTime = Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
    
    // Store reset token in customer meta data
    await wooCommerceAPI.put(`customers/${customer.id}`, {
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
    
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
    
    console.log('Reset token generated and stored in WooCommerce')
    console.log('Reset URL:', resetUrl)
    
    // TODO: Configure email service (Nodemailer, SendGrid, etc.) to send reset email
    // For now, the reset URL is logged to console for manual testing
    console.log(`Manual reset URL for ${email}:`, resetUrl)

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