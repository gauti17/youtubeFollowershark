import type { NextApiRequest, NextApiResponse } from 'next'
import { productService } from '../../../lib/productService'
export const runtime = 'nodejs'
import { wooCommerceAPI } from '../../../lib/woocommerce'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Setting up virtual products in WooCommerce...')
    
    // First test the basic WooCommerce connection
    console.log('Testing WooCommerce API connection...')
    try {
      const testProducts = await wooCommerceAPI.get('products', { per_page: 1 })
      console.log('WooCommerce API connection test successful. Sample response:', testProducts ? 'Has data' : 'No data')
    } catch (connError) {
      console.error('WooCommerce API connection failed:', connError)
      throw new Error(`WooCommerce API connection failed: ${connError.message}`)
    }
    
    // Create all virtual products
    const productIds = await productService.ensureAllVirtualProducts()
    
    console.log('Virtual products setup complete:', productIds)
    
    return res.status(200).json({
      success: true,
      message: 'Virtual products created/verified in WooCommerce',
      productIds,
      count: Object.keys(productIds).length
    })

  } catch (error: any) {
    console.error('Error setting up virtual products:', error)
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
      details: error.toString()
    })
  }
}