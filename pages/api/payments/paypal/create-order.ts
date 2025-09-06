import type { NextApiRequest, NextApiResponse } from 'next'
import { paypalService } from '../../../../lib/paypalService'
import { products, calculatePrice } from '../../../../data/products'

interface CreateOrderRequest {
  items: Array<{
    productId: string
    quantity: number
    selectedOptions: {
      speed?: string
      target?: string
      url?: string
      selectedQuantity?: number
    }
  }>
  customerInfo: {
    email: string
    firstName: string
    lastName: string
    country: string
    city: string
    postalCode: string
    phone?: string
  }
  totalAmount: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log(`[PayPal Create Order] Method not allowed: ${req.method}`)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const startTime = Date.now()
  console.log(`[PayPal Create Order] Request received at ${new Date().toISOString()}`)

  try {
    const { items, customerInfo, totalAmount }: CreateOrderRequest = req.body

    if (!items || !customerInfo || !totalAmount) {
      console.error(`[PayPal Create Order] Missing required fields:`, {
        items: !!items,
        customerInfo: !!customerInfo,
        totalAmount: !!totalAmount
      })
      return res.status(400).json({ error: 'Missing required fields' })
    }

    console.log(`[PayPal Create Order] Processing order for ${customerInfo.email} with ${items.length} items, total: ${totalAmount}€`)
    console.log(`[PayPal Create Order] Raw order data:`, JSON.stringify(req.body, null, 2))

    // Generate unique order number
    const orderNumber = `YS${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    console.log(`[PayPal Create Order] Generated order number: ${orderNumber}`)

    // Server-side validation: recalculate total to prevent price manipulation
    // Must match frontend calculation exactly for security
    let calculatedTotal = 0
    let orderDescription = []

    console.log(`[PayPal Create Order] Processing ${items.length} items for server-side validation`)

    for (const item of items) {
      const product = products.find(p => p.id === item.productId)
      if (!product) {
        console.error(`[PayPal Create Order] Product not found: ${item.productId}`)
        return res.status(400).json({ error: `Product not found: ${item.productId}` })
      }

      console.log(`[PayPal Create Order] Processing product: ${product.name}`)

      // Get pricing options - match by name since frontend sends names, not IDs
      let speedPrice = 0
      let targetPrice = 0

      console.log(`[PayPal Create Order] Looking for speed option: "${item.selectedOptions.speed}"`)
      console.log(`[PayPal Create Order] Available speed options:`, product.speedOptions?.map(opt => ({ id: opt.id, name: opt.name, price: opt.price })))

      if (item.selectedOptions.speed && product.speedOptions) {
        const speedOption = product.speedOptions.find(opt => 
          opt.name === item.selectedOptions.speed || opt.id === item.selectedOptions.speed
        )
        if (speedOption) {
          speedPrice = speedOption.price
          console.log(`[PayPal Create Order] Speed option found: ${speedOption.name} (ID: ${speedOption.id}) (+€${speedPrice})`)
        } else {
          console.warn(`[PayPal Create Order] Speed option not found: "${item.selectedOptions.speed}"`)
          console.warn(`[PayPal Create Order] Available options: ${product.speedOptions.map(opt => `"${opt.name}" (${opt.id})`).join(', ')}`)
        }
      }

      console.log(`[PayPal Create Order] Looking for target option: "${item.selectedOptions.target}"`)
      console.log(`[PayPal Create Order] Available target options:`, product.targetOptions?.map(opt => ({ id: opt.id, name: opt.name, price: opt.price })))

      if (item.selectedOptions.target && product.targetOptions) {
        const targetOption = product.targetOptions.find(opt => 
          opt.name === item.selectedOptions.target || opt.id === item.selectedOptions.target
        )
        if (targetOption) {
          targetPrice = targetOption.price
          console.log(`[PayPal Create Order] Target option found: ${targetOption.name} (ID: ${targetOption.id}) (+€${targetPrice})`)
        } else {
          console.warn(`[PayPal Create Order] Target option not found: "${item.selectedOptions.target}"`)
          console.warn(`[PayPal Create Order] Available options: ${product.targetOptions.map(opt => `"${opt.name}" (${opt.id})`).join(', ')}`)
        }
      }

      // Calculate server-side total using EXACT same logic as frontend:
      // Frontend stores unitPrice in cart and multiplies by quantity in CartContext
      // We need to recalculate the unitPrice the same way frontend does
      
      // Use the original base service quantity from frontend instead of reverse-engineering
      const selectedQuantity = item.selectedOptions.selectedQuantity || item.quantity
      const orderQuantity = item.quantity
      
      // Get baseServiceQuantity with better fallback logic for old cart items
      let baseServiceQuantity = item.selectedOptions.baseServiceQuantity
      
      if (!baseServiceQuantity) {
        console.warn(`[PayPal Create Order] Missing baseServiceQuantity for item ${item.productId}, using fallback calculation`)
        
        // For old cart items without baseServiceQuantity, we need to reverse-engineer it
        // This should match how the frontend originally calculated it
        if (selectedQuantity && orderQuantity > 0) {
          baseServiceQuantity = Math.round(selectedQuantity / orderQuantity)
        } else {
          baseServiceQuantity = 1000 // Default fallback - this should match product default
        }
      }
      
      console.log(`[PayPal Create Order] Quantity data for ${item.productId}:`, {
        selectedQuantity,
        orderQuantity,
        baseServiceQuantity: baseServiceQuantity,
        hasBaseServiceQuantityField: !!item.selectedOptions.baseServiceQuantity,
        calculatedFallback: !item.selectedOptions.baseServiceQuantity ? Math.round(selectedQuantity / orderQuantity) : 'not needed'
      })
      
      // Now calculate unitPrice exactly like frontend:
      // calculatePriceWithDiscount(basePrice, baseServiceQuantity, 0, targetPrice).total + (speedPrice * baseServiceQuantity)
      const pricing = calculatePrice(product.basePrice, baseServiceQuantity, 0, targetPrice)
      
      // CRITICAL FIX: Speed price should NOT be multiplied by service quantity
      // Frontend does: calculatePrice(basePrice, serviceQuantity, 0, targetPrice).total + speedPrice
      // speedPrice is per ORDER, not per service unit - no multiplication needed
      const unitPrice = pricing.total + speedPrice
      
      console.log(`[PayPal Create Order] Detailed pricing breakdown for ${product.name}:`, {
        basePrice: product.basePrice,
        baseServiceQuantity,
        targetPrice,
        speedPrice,
        pricing: {
          subtotal: pricing.subtotal,
          discount: pricing.discount,
          discountAmount: pricing.discountAmount,
          total: pricing.total
        },
        unitPrice,
        calculation: `((${product.basePrice} + ${targetPrice}) × ${baseServiceQuantity} × ${(100 - pricing.discount)}%) + ${speedPrice} = ${pricing.total} + ${speedPrice} = ${unitPrice}`
      })
      
      // Cart total calculation: unitPrice * orderQuantity (same as frontend CartContext)
      const itemTotal = unitPrice * orderQuantity

      console.log(`[PayPal Create Order] Pricing calculation:`, {
        basePrice: product.basePrice,
        baseServiceQuantity: baseServiceQuantity,
        orderQuantity: orderQuantity,
        selectedQuantity: selectedQuantity,
        speedPrice,
        targetPrice,
        pricingTotal: pricing.total,
        unitPrice: unitPrice,
        itemTotal: itemTotal
      })

      // Add to order description
      orderDescription.push(`${selectedQuantity}x ${product.name}`)
      calculatedTotal += itemTotal
    }

    // Create a single consolidated item for PayPal to avoid rounding issues
    const processedItems = [{
      name: `youshark Order - ${orderDescription.join(', ')}`,
      quantity: "1",
      unitAmount: calculatedTotal.toFixed(2),
      sku: orderNumber
    }]

    console.log(`[PayPal Create Order] Server calculated total: €${calculatedTotal.toFixed(2)}`)
    console.log(`[PayPal Create Order] Frontend provided total: €${totalAmount}`)

    // Verify total matches (security check)
    const totalDifference = Math.abs(calculatedTotal - parseFloat(totalAmount))
    if (totalDifference > 0.01) {
      console.error(`[PayPal Create Order] Total amount mismatch (security check failed):`, {
        serverCalculated: calculatedTotal.toFixed(2),
        frontendProvided: totalAmount,
        difference: totalDifference.toFixed(4)
      })
      return res.status(400).json({ 
        error: 'Total amount mismatch - security validation failed',
        serverCalculated: calculatedTotal.toFixed(2),
        frontendProvided: totalAmount
      })
    }

    console.log(`[PayPal Create Order] Security validation passed, total: €${calculatedTotal.toFixed(2)}`)

    // Create PayPal order
    console.log(`[PayPal Create Order] Creating PayPal order...`)
    const paypalOrder = await paypalService.createOrder({
      amount: calculatedTotal.toFixed(2),
      currency: 'EUR',
      orderNumber,
      items: processedItems,
      customerInfo
    })

    if (!paypalOrder.success) {
      console.error(`[PayPal Create Order] Failed to create PayPal order:`, paypalOrder.error)
      return res.status(500).json({ 
        error: 'Failed to create PayPal order',
        details: paypalOrder.error
      })
    }

    const processingTime = Date.now() - startTime
    console.log(`[PayPal Create Order] Order created successfully in ${processingTime}ms:`, {
      orderId: paypalOrder.orderId,
      orderNumber,
      amount: calculatedTotal.toFixed(2),
      customerEmail: customerInfo.email
    })

    // Return order details
    res.status(200).json({
      success: true,
      orderId: paypalOrder.orderId,
      orderNumber,
      amount: calculatedTotal.toFixed(2),
      currency: 'EUR'
    })

  } catch (error: any) {
    const processingTime = Date.now() - startTime
    console.error(`[PayPal Create Order] Error after ${processingTime}ms:`, error)
    console.error(`[PayPal Create Order] Stack trace:`, error.stack)
    
    // Ensure we always return JSON, never HTML
    try {
      res.status(500).json({ 
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : 'PayPal order creation failed',
        timestamp: new Date().toISOString()
      })
    } catch (jsonError) {
      // Last resort - send plain text error
      res.status(500).send('PayPal order creation failed')
    }
  }
}