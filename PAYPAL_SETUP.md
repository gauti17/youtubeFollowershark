# PayPal Payment Integration Setup Guide

This guide explains how to set up and configure the PayPal payment integration for the YouTube Shark e-commerce platform.

## Overview

The PayPal integration provides a complete payment solution with:
- Secure payment processing through PayPal SDK
- Real-time webhook notifications
- Order creation and capture workflow
- Integration with WooCommerce backend
- Comprehensive error handling and logging

## Architecture

### Components

1. **Frontend Components**
   - `PayPalButton.tsx` - React component for PayPal payment buttons
   - Checkout flow integration in `pages/checkout.tsx`
   - Success page for completed payments

2. **Backend API Endpoints**
   - `/api/payments/paypal/create-order` - Creates PayPal orders
   - `/api/payments/paypal/capture-order` - Captures payments and creates WooCommerce orders
   - `/api/payments/paypal/webhook` - Handles PayPal webhook notifications

3. **Services**
   - `lib/paypalService.ts` - PayPal SDK integration and API calls

### Payment Flow

1. **Order Creation**
   - User completes checkout form
   - Frontend validates form data
   - PayPal button creates order via `/api/payments/paypal/create-order`
   - PayPal SDK displays payment options

2. **Payment Processing**
   - User approves payment in PayPal interface
   - Frontend captures payment via `/api/payments/paypal/capture-order`
   - System creates WooCommerce order
   - User redirected to success page

3. **Webhook Notifications**
   - PayPal sends webhook notifications for payment events
   - System verifies webhook signature
   - Updates order status as needed

## Setup Instructions

### 1. PayPal Developer Account Setup

1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Log in or create a developer account
3. Create a new application:
   - Navigate to "My Apps & Credentials"
   - Click "Create App"
   - Choose app type: "Default Application"
   - Select sandbox/live account
   - Note down Client ID and Client Secret

### 2. Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox  # or 'live' for production
PAYPAL_WEBHOOK_ID=your_paypal_webhook_id
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id

# Other required variables
NEXT_PUBLIC_SITE_URL=http://localhost:3000
WOOCOMMERCE_CONSUMER_KEY=your_woocommerce_key
WOOCOMMERCE_CONSUMER_SECRET=your_woocommerce_secret
NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-wordpress-site.com
```

### 3. Webhook Configuration

1. In PayPal Developer Dashboard:
   - Go to your application
   - Navigate to "Webhooks" section
   - Click "Add Webhook"
   - Set Webhook URL: `https://your-domain.com/api/payments/paypal/webhook`
   - Select events to subscribe to:
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.DENIED`
     - `PAYMENT.CAPTURE.REFUNDED`
     - `CHECKOUT.ORDER.APPROVED`
     - `CHECKOUT.ORDER.COMPLETED`

2. Copy the Webhook ID and add it to your environment variables as `PAYPAL_WEBHOOK_ID`

### 4. Dependencies Installation

The following packages are required and should be installed:

```bash
npm install @paypal/paypal-server-sdk @paypal/paypal-js crypto-js
```

### 5. Testing

1. **Sandbox Testing**
   - Use PayPal sandbox accounts for testing
   - Test various payment scenarios:
     - Successful payments
     - Declined payments
     - Webhooks delivery

2. **Frontend Testing**
   - Navigate to checkout page
   - Select PayPal as payment method
   - Complete form and test payment flow
   - Verify success page display

## API Endpoints Documentation

### POST /api/payments/paypal/create-order

Creates a new PayPal order for payment processing.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "selectedOptions": {
        "speed": "string",
        "target": "string",
        "url": "string",
        "selectedQuantity": "number"
      }
    }
  ],
  "customerInfo": {
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  },
  "totalAmount": "string"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "string",
  "orderNumber": "string", 
  "amount": "string",
  "currency": "EUR"
}
```

### POST /api/payments/paypal/capture-order

Captures a PayPal payment and creates corresponding WooCommerce order.

**Request Body:**
```json
{
  "orderId": "string",
  "orderData": {
    "items": [...],
    "customerInfo": {
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "country": "string",
      "city": "string",
      "postalCode": "string",
      "phone": "string"
    },
    "totalAmount": "string"
  }
}
```

**Response:**
```json
{
  "success": true,
  "paypalOrderId": "string",
  "paypalTransactionId": "string",
  "paypalStatus": "string",
  "wooCommerceOrderId": "number",
  "amount": {
    "currency_code": "string",
    "value": "string"
  },
  "message": "string"
}
```

### POST /api/payments/paypal/webhook

Handles PayPal webhook notifications.

**Headers Required:**
- `paypal-auth-algo`
- `paypal-transmission-id`
- `paypal-cert-id`
- `paypal-auth-signature`

**Event Types Handled:**
- `PAYMENT.CAPTURE.COMPLETED` - Payment successfully captured
- `PAYMENT.CAPTURE.DENIED` - Payment declined
- `PAYMENT.CAPTURE.REFUNDED` - Payment refunded
- `CHECKOUT.ORDER.APPROVED` - Order approved by customer
- `CHECKOUT.ORDER.COMPLETED` - Order processing completed

## Error Handling

### Common Errors

1. **"Missing webhook headers"**
   - Ensure webhook is properly configured in PayPal
   - Check that all required headers are sent

2. **"Invalid webhook signature"**
   - Verify PAYPAL_WEBHOOK_ID is correct
   - Check PayPal webhook configuration

3. **"Payment capture failed"**
   - Customer may have insufficient funds
   - Check PayPal order status
   - Review PayPal logs

4. **"Total amount mismatch"**
   - Frontend and backend price calculations differ
   - Check product pricing configuration

### Logging

All PayPal operations are logged with prefixes:
- `[PayPal Create Order]` - Order creation logs
- `[PayPal Capture Order]` - Payment capture logs  
- `[PayPal Webhook]` - Webhook processing logs

## Security Considerations

1. **Webhook Verification**
   - All webhooks are verified using PayPal's signature verification API
   - Invalid webhooks are rejected with 401 status

2. **Environment Separation**
   - Use sandbox for development/testing
   - Switch to live environment only for production

3. **Sensitive Data**
   - Never expose PayPal Client Secret in frontend
   - Use environment variables for all credentials

## Monitoring and Maintenance

### Monitoring Checklist

1. **Payment Processing**
   - Monitor successful payment rates
   - Track failed payment reasons
   - Review webhook delivery status

2. **Performance**
   - Monitor API response times
   - Check webhook processing times
   - Track database query performance

3. **Error Rates**
   - Monitor 4xx/5xx error rates
   - Track specific error types
   - Set up alerts for critical failures

### Regular Maintenance

1. **Security Updates**
   - Keep PayPal SDK updated
   - Review security advisories
   - Update webhook configurations as needed

2. **Monitoring**
   - Review logs regularly
   - Monitor payment success rates
   - Check for unusual patterns

## Troubleshooting

### Development Issues

1. **PayPal buttons not showing**
   - Check NEXT_PUBLIC_PAYPAL_CLIENT_ID is set
   - Verify PayPal SDK is loading correctly
   - Check browser console for errors

2. **Webhook not receiving events**
   - Verify webhook URL is accessible
   - Check PayPal webhook configuration
   - Test webhook endpoint manually

3. **Payment capture failing**
   - Check PayPal order status
   - Verify customer approval
   - Review capture request data

### Production Issues

1. **High error rates**
   - Review application logs
   - Check PayPal service status
   - Monitor database performance

2. **Webhook delays**
   - PayPal webhooks may have delays
   - Implement retry logic for critical operations
   - Monitor webhook delivery reports

## Support and Resources

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal SDK GitHub Repository](https://github.com/paypal/paypal-server-sdk-node)
- [Webhook Events Reference](https://developer.paypal.com/docs/api-basics/notifications/webhooks/event-names/)

For technical support, contact the development team or create an issue in the project repository.