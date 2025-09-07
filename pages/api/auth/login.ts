import type { NextApiRequest, NextApiResponse } from 'next'
import { wooCommerceAPI } from '../../../lib/woocommerce'

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
    const customers = await wooCommerceAPI.get('customers', {
      email: email,
      per_page: 1
    })

    if (!customers || customers.length === 0) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' })
    }

    const customer = customers[0]
    
    // COMPREHENSIVE DEBUGGING - Log entire customer object
    console.log('=== CUSTOMER DEBUG INFO ===')
    console.log('Customer ID:', customer.id)
    console.log('Customer email:', customer.email)
    console.log('Customer meta_data:', JSON.stringify(customer.meta_data, null, 2))
    console.log('Customer full object keys:', Object.keys(customer))
    console.log('=== END CUSTOMER DEBUG ===')

    // Note: WooCommerce REST API doesn't support password verification directly
    // In a real implementation, you would need to use WordPress authentication
    // For now, we'll implement a basic check against a stored hash in meta_data
    
    // Try WordPress native authentication using wp-login.php
    try {
      const wpLoginUrl = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-login.php`
      
      // Create form data for WordPress login
      const formData = new FormData()
      formData.append('log', email)
      formData.append('pwd', password)
      formData.append('wp-submit', 'Log In')
      formData.append('testcookie', '1')
      
      const wpResponse = await fetch(wpLoginUrl, {
        method: 'POST',
        body: formData,
        redirect: 'manual' // Don't follow redirects
      })
      
      console.log('WordPress login response status:', wpResponse.status)
      console.log('WordPress login response headers:', Object.fromEntries(wpResponse.headers.entries()))
      
      // If login successful, WordPress redirects (302) or returns 200
      // If login failed, it returns the login page again
      if (wpResponse.status === 302 || wpResponse.status === 200) {
        const setCookieHeader = wpResponse.headers.get('set-cookie')
        if (setCookieHeader && setCookieHeader.includes('wordpress_logged_in')) {
          console.log('WordPress authentication successful via wp-login.php')
          // Authentication successful, proceed with login
        } else {
          throw new Error('WordPress login failed - no login cookie')
        }
      } else {
        throw new Error(`WordPress login failed - status ${wpResponse.status}`)
      }
      
    } catch (wpError) {
      console.log('WordPress authentication failed:', wpError.message)
      
      // Fallback to our custom password hash stored in meta_data
      const passwordMeta = customer.meta_data?.find((meta: any) => meta.key === '_password_hash')
      
      if (!passwordMeta) {
        console.log('No password hash found for customer:', customer.id, 'Available meta keys:', customer.meta_data?.map((m: any) => m.key))
        
        // Check if this customer was created through order (no password set)
        const registrationSource = customer.meta_data?.find((meta: any) => meta.key === '_registration_source')
        
        if (!registrationSource || registrationSource.value !== 'youshark_frontend') {
          // Customer was created through order, needs password setup
          return res.status(402).json({ 
            error: 'Bitte setzen Sie Ihr Passwort zurück',
            requirePasswordReset: true,
            customerId: customer.id
          })
        } else {
          // Customer was created through frontend but password hash is missing - this is an error
          console.error('Customer created through frontend but password hash missing:', customer.id)
          return res.status(500).json({ error: 'Kontoeinstellungen fehlen. Bitte kontaktieren Sie den Support.' })
        }
      }

      // Validate password using bcrypt
      const bcrypt = require('bcryptjs')
      const isValidPassword = await bcrypt.compare(password, passwordMeta.value)

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Ungültige Anmeldedaten' })
      }
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