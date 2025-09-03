import type { NextApiRequest, NextApiResponse } from 'next'

export const runtime = 'edge'
// Alternative password reset endpoint that works directly with WordPress
// This endpoint handles the password reset token sent by WordPress/WooCommerce
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { key, login, password } = req.body

    if (!key || !login || !password) {
      return res.status(400).json({ error: 'Reset key, login, and password are required' })
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Passwort muss mindestens 8 Zeichen lang sein' })
    }

    // Use WordPress REST API to reset password with the key from email
    const wpResponse = await fetch(`${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wp/v2/users/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: key,
        login: login,
        password: password
      })
    })

    if (!wpResponse.ok) {
      const errorData = await wpResponse.json().catch(() => ({}))
      return res.status(400).json({ 
        error: errorData.message || 'Invalid or expired reset key' 
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Passwort wurde erfolgreich zurückgesetzt. Sie können sich jetzt anmelden.'
    })

  } catch (error: any) {
    console.error('WordPress password reset error:', error)
    return res.status(500).json({ 
      error: 'Ein Fehler ist beim Zurücksetzen des Passworts aufgetreten' 
    })
  }
}