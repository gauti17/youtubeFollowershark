import type { NextApiRequest, NextApiResponse } from 'next'
import { customerService } from '../../../lib/customerService'
// Uses Node.js runtime for WooCommerce API compatibility
import { CheckoutFormData } from '../../../lib/orderService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow GET for testing purposes
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Customer Creation API Endpoint',
      usage: 'Send POST request with JSON body containing: firstName, lastName, email, country, city, postalCode',
      example: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'max.test@example.com',
          country: 'Deutschland', 
          city: 'Berlin',
          postalCode: '10115'
        }
      }
    })
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' })
  }

  try {
    console.log('Received request body:', req.body)
    console.log('Request headers:', req.headers)
    
    const formData: CheckoutFormData = req.body

    // Debug the received data
    console.log('Parsed form data:', {
      firstName: formData?.firstName,
      lastName: formData?.lastName, 
      email: formData?.email,
      hasFirstName: !!formData?.firstName,
      hasLastName: !!formData?.lastName,
      hasEmail: !!formData?.email
    })

    // Validate required fields
    if (!formData?.firstName || !formData?.lastName || !formData?.email) {
      return res.status(400).json({ 
        error: 'Vor- und Nachname sowie E-Mail sind erforderlich',
        received: {
          firstName: formData?.firstName || 'missing',
          lastName: formData?.lastName || 'missing',
          email: formData?.email || 'missing'
        }
      })
    }

    // Create customer
    const result = await customerService.createCustomer(formData)

    return res.status(200).json(result)

  } catch (error) {
    console.error('API Error creating customer:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Interner Serverfehler'
    })
  }
}