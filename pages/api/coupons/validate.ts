import type { NextApiRequest, NextApiResponse } from 'next'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
export const runtime = 'nodejs'

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
    const { code, cartTotal } = req.body

    if (!code) {
      return res.status(400).json({ error: 'Coupon-Code ist erforderlich' })
    }

    // Get coupon from WooCommerce
    const couponResponse = await api.get(`coupons`, {
      code: code.toUpperCase(),
      per_page: 1
    })

    if (!couponResponse.data || couponResponse.data.length === 0) {
      return res.status(404).json({ error: 'Coupon-Code nicht gefunden' })
    }

    const coupon = couponResponse.data[0]

    // Check if coupon is active
    if (coupon.status !== 'publish') {
      return res.status(400).json({ error: 'Dieser Coupon ist nicht aktiv' })
    }

    // Check expiry date
    if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) {
      return res.status(400).json({ error: 'Dieser Coupon ist abgelaufen' })
    }

    // Check usage limits
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return res.status(400).json({ error: 'Dieser Coupon wurde bereits maximal genutzt' })
    }

    // Check minimum amount
    if (coupon.minimum_amount && parseFloat(coupon.minimum_amount) > cartTotal) {
      return res.status(400).json({ 
        error: `Mindestbestellwert von ${coupon.minimum_amount}€ nicht erreicht` 
      })
    }

    // Check maximum amount
    if (coupon.maximum_amount && parseFloat(coupon.maximum_amount) < cartTotal) {
      return res.status(400).json({ 
        error: `Maximaler Bestellwert von ${coupon.maximum_amount}€ überschritten` 
      })
    }

    // Calculate discount amount
    let discountAmount = 0
    
    if (coupon.discount_type === 'percent') {
      discountAmount = (cartTotal * parseFloat(coupon.amount)) / 100
      
      // Apply maximum discount limit if set
      if (coupon.maximum_amount) {
        discountAmount = Math.min(discountAmount, parseFloat(coupon.maximum_amount))
      }
    } else if (coupon.discount_type === 'fixed_cart') {
      discountAmount = parseFloat(coupon.amount)
      
      // Discount cannot exceed cart total
      discountAmount = Math.min(discountAmount, cartTotal)
    }

    // Return valid coupon data
    return res.status(200).json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        amount: coupon.amount,
        discount_type: coupon.discount_type,
        description: coupon.description,
        discount_amount: discountAmount,
        minimum_amount: coupon.minimum_amount,
        maximum_amount: coupon.maximum_amount,
        usage_count: coupon.usage_count,
        usage_limit: coupon.usage_limit,
        date_expires: coupon.date_expires
      }
    })

  } catch (error: any) {
    console.error('Coupon validation error:', error)
    
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Coupon-Code nicht gefunden' })
    }
    
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'API-Authentifizierung fehlgeschlagen' })
    }
    
    return res.status(500).json({ error: 'Fehler bei der Coupon-Validierung' })
  }
}