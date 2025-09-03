import type { NextApiRequest, NextApiResponse } from 'next'
import { wooCommerceAPI } from '../../../lib/woocommerce'

export const runtime = 'nodejs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Testing WooCommerce API connection...')
    
    // Test basic connection by fetching system status or products
    const result = await wooCommerceAPI.get('system_status')
    
    console.log('WooCommerce API test successful')
    
    return res.status(200).json({
      success: true,
      message: 'WooCommerce API connection successful',
      environment: result.environment || 'Unknown'
    })

  } catch (error: any) {
    console.error('WooCommerce API test failed:', error)
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
      details: error.toString()
    })
  }
}