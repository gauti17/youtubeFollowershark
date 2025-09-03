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
    return res.status(405).json({ error: 'Methode nicht erlaubt' })
  }

  try {
    const { email, password, firstName, lastName, country, city, postalCode } = req.body

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Email, Passwort, Vor- und Nachname sind erforderlich' 
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Ungültige E-Mail-Adresse' })
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Passwort muss mindestens 8 Zeichen lang sein' })
    }

    // Check if customer already exists
    const existingCustomerResponse = await api.get('customers', {
      email: email,
      per_page: 1
    })

    if (existingCustomerResponse.data && existingCustomerResponse.data.length > 0) {
      return res.status(409).json({ error: 'Ein Konto mit dieser E-Mail-Adresse existiert bereits' })
    }

    // Hash password
    const bcrypt = require('bcryptjs')
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create customer in WooCommerce
    const customerData = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        country: country || 'DE',
        city: city || '',
        postcode: postalCode || ''
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        country: country || 'DE',
        city: city || '',
        postcode: postalCode || ''
      },
      meta_data: [
        {
          key: '_password_hash',
          value: hashedPassword
        },
        {
          key: '_registration_source',
          value: 'youshark_frontend'
        },
        {
          key: '_registration_date',
          value: new Date().toISOString()
        }
      ]
    }

    const customerResponse = await api.post('customers', customerData)

    if (!customerResponse.data) {
      throw new Error('Customer creation failed')
    }

    const customer = customerResponse.data

    // Create JWT token
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
    return res.status(201).json({
      success: true,
      message: 'Konto erfolgreich erstellt',
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
    console.error('Registration error:', error)
    
    // Handle specific WooCommerce errors
    if (error.response?.data?.message) {
      return res.status(400).json({ error: error.response.data.message })
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'API-Authentifizierung fehlgeschlagen' })
    }
    
    return res.status(500).json({ error: 'Ein Fehler bei der Registrierung ist aufgetreten' })
  }
}