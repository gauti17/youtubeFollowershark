import type { NextApiRequest, NextApiResponse } from 'next'
import { paypalService } from '../../../../lib/paypalService'
export const runtime = 'edge'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log(`[PayPal Webhook] Method not allowed: ${req.method}`)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const startTime = Date.now()
  console.log(`[PayPal Webhook] Received webhook at ${new Date().toISOString()}`)

  try {
    // Get webhook headers
    const authAlgo = req.headers['paypal-auth-algo'] as string
    const transmission_id = req.headers['paypal-transmission-id'] as string  
    const cert_id = req.headers['paypal-cert-id'] as string
    const auth_signature = req.headers['paypal-auth-signature'] as string
    const webhook_id = process.env.PAYPAL_WEBHOOK_ID || ''

    console.log(`[PayPal Webhook] Headers received:`, {
      authAlgo: !!authAlgo,
      transmission_id: !!transmission_id,
      cert_id: !!cert_id,
      auth_signature: !!auth_signature,
      webhook_id: !!webhook_id
    })

    if (!authAlgo || !transmission_id || !cert_id || !auth_signature) {
      console.error(`[PayPal Webhook] Missing required headers`)
      return res.status(400).json({ error: 'Missing webhook headers' })
    }

    if (!webhook_id) {
      console.error(`[PayPal Webhook] PAYPAL_WEBHOOK_ID environment variable not set`)
      return res.status(500).json({ error: 'Webhook configuration error' })
    }

    // Verify webhook signature
    console.log(`[PayPal Webhook] Verifying webhook signature...`)
    const isValid = await paypalService.verifyWebhookSignature(
      authAlgo,
      transmission_id,
      cert_id,
      auth_signature,
      JSON.stringify(req.body),
      webhook_id
    )

    if (!isValid) {
      console.error(`[PayPal Webhook] Signature verification failed`)
      return res.status(401).json({ error: 'Invalid webhook signature' })
    }

    console.log(`[PayPal Webhook] Signature verification successful`)

    // Process webhook event
    const webhookEvent = req.body
    console.log(`[PayPal Webhook] Processing event: ${webhookEvent.event_type} (ID: ${webhookEvent.id})`)

    switch (webhookEvent.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log(`[PayPal Webhook] Payment captured successfully:`, {
          paymentId: webhookEvent.resource.id,
          amount: webhookEvent.resource.amount,
          payerEmail: webhookEvent.resource.payer?.email_address,
          orderId: webhookEvent.resource.supplementary_data?.related_ids?.order_id
        })
        // TODO: Update order status in WooCommerce to 'processing'
        break

      case 'PAYMENT.CAPTURE.DENIED':
        console.log(`[PayPal Webhook] Payment denied:`, {
          paymentId: webhookEvent.resource.id,
          reason: webhookEvent.resource.reason_code,
          orderId: webhookEvent.resource.supplementary_data?.related_ids?.order_id
        })
        // TODO: Update order status in WooCommerce to 'failed'
        break

      case 'PAYMENT.CAPTURE.REFUNDED':
        console.log(`[PayPal Webhook] Payment refunded:`, {
          refundId: webhookEvent.resource.id,
          amount: webhookEvent.resource.amount,
          parentPayment: webhookEvent.resource.parent_payment,
          reason: webhookEvent.resource.reason
        })
        // TODO: Update order status in WooCommerce to 'refunded'
        break

      case 'CHECKOUT.ORDER.APPROVED':
        console.log(`[PayPal Webhook] Order approved:`, {
          orderId: webhookEvent.resource.id,
          status: webhookEvent.resource.status,
          payerEmail: webhookEvent.resource.payer?.email_address
        })
        // This event occurs before capture, no action needed
        break

      case 'CHECKOUT.ORDER.COMPLETED':
        console.log(`[PayPal Webhook] Order completed:`, {
          orderId: webhookEvent.resource.id,
          status: webhookEvent.resource.status
        })
        break

      default:
        console.log(`[PayPal Webhook] Unhandled event type: ${webhookEvent.event_type}`)
        console.log(`[PayPal Webhook] Event data:`, JSON.stringify(webhookEvent, null, 2))
    }

    const processingTime = Date.now() - startTime
    console.log(`[PayPal Webhook] Processing completed in ${processingTime}ms`)

    // Respond to PayPal that webhook was received
    res.status(200).json({ success: true, processed_at: new Date().toISOString() })

  } catch (error: any) {
    const processingTime = Date.now() - startTime
    console.error(`[PayPal Webhook] Error after ${processingTime}ms:`, error)
    console.error(`[PayPal Webhook] Stack trace:`, error.stack)
    
    res.status(500).json({ 
      error: 'Webhook processing failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    })
  }
}