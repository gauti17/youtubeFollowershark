# WooCommerce Integration Guide

This integration allows you to post orders directly to WooCommerce without creating products first. Orders appear in your WooCommerce admin with all customer and order details.

## Setup Instructions

### 1. WooCommerce API Setup

1. **Log into your WordPress admin**
2. **Go to WooCommerce > Settings > Advanced > REST API**
3. **Click "Add Key"**
4. **Configure the API key:**
   - Description: `YouShark Frontend`
   - User: Select admin user
   - Permissions: `Read/Write`
5. **Copy the Consumer Key and Consumer Secret**

### 2. Environment Configuration

1. **Copy `.env.local.example` to `.env.local`**
2. **Update the WooCommerce settings:**

```env
# WooCommerce API Configuration
NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-woocommerce-site.com
WOOCOMMERCE_CONSUMER_KEY=ck_your_consumer_key_here
WOOCOMMERCE_CONSUMER_SECRET=cs_your_consumer_secret_here
```

### 3. Test the Integration

1. **Start your development server:** `npm run dev`
2. **Add items to cart and proceed to checkout**
3. **Complete an order**
4. **Check your WooCommerce admin for the new order**

## How It Works

### Order Creation Process

1. **Customer completes checkout form**
2. **Frontend calls `/api/orders/create`**
3. **API creates order in WooCommerce with:**
   - Customer billing information
   - Virtual line items (no products required)
   - Service metadata (YouTube URLs, options, etc.)
   - Processing fees and discounts
   - Order source tracking

### Order Data Structure

Each order includes:

```javascript
{
  status: 'processing',
  billing: { /* customer info */ },
  line_items: [
    {
      name: 'YouTube Views - 1,000 Stück',
      product_id: 0, // Virtual item
      quantity: 1,
      price: '5.99',
      total: '5.99',
      meta_data: [
        { key: '_service_type', value: 'views' },
        { key: '_youtube_url', value: 'https://youtube.com/...' },
        { key: '_speed_option', value: 'standard' },
        { key: '_selected_quantity', value: 1000 }
      ]
    }
  ],
  meta_data: [
    { key: '_order_source', value: 'youshark_frontend' },
    { key: '_processing_fee', value: '0.17' },
    { key: '_discount_applied', value: '1.20' }
  ]
}
```

## Order Management

### View Orders
- **WooCommerce Admin > Orders**
- All orders appear with customer details
- Service information in order meta data
- YouTube URLs and options visible

### Order Statuses
- **Processing**: Order created, awaiting fulfillment
- **Completed**: Services delivered
- **On-hold**: Payment pending

### Fulfillment Process
1. **View order details in WooCommerce admin**
2. **Extract service requirements:**
   - YouTube URL
   - Service type (views, likes, subscribers)
   - Quantity
   - Speed/target options
3. **Deliver services through your system**
4. **Mark order as "Completed"**

## API Endpoints

### POST `/api/orders/create`
Creates a new order in WooCommerce.

**Request:**
```json
{
  "cartItems": [...],
  "formData": {
    "firstName": "Max",
    "lastName": "Mustermann",
    "email": "max@example.com",
    "country": "Deutschland",
    "city": "Berlin",
    "postalCode": "10115"
  },
  "options": {
    "paymentMethod": "paypal",
    "discountCode": "SHARK20"
  }
}
```

**Response:**
```json
{
  "success": true,
  "orderId": 12345,
  "orderNumber": "12345",
  "message": "Order created successfully"
}
```

## Benefits

✅ **No Product Creation Required**
- Orders work without WooCommerce products
- Dynamic service configurations
- Flexible pricing and options

✅ **Full WooCommerce Integration**
- Orders appear in admin
- Customer management
- Invoicing and receipts
- Payment tracking

✅ **Detailed Service Data**
- YouTube URLs stored
- Service specifications
- Customer selections
- Fulfillment tracking

✅ **Professional Order Management**
- Order status updates
- Customer communication
- Refund processing
- Reporting and analytics

## Troubleshooting

### Common Issues

1. **API Authentication Errors**
   - Check Consumer Key/Secret
   - Verify WooCommerce REST API is enabled
   - Ensure user has proper permissions

2. **Order Creation Fails**
   - Check WooCommerce logs
   - Verify required fields are provided
   - Check API endpoint accessibility

3. **Missing Order Data**
   - Verify meta_data is being sent
   - Check WooCommerce version compatibility
   - Review API response logs

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

Check browser console and server logs for detailed error information.

## Security Notes

- API credentials are server-side only
- Customer data is transmitted securely
- Orders include source tracking for audit trails
- All API calls go through Next.js API routes

## Support

For technical issues:
1. Check WooCommerce system status
2. Review API logs
3. Test API credentials with WooCommerce REST API tester
4. Verify environment variables are loaded correctly