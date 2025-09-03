# Password Reset Functionality

This document explains how the password reset functionality works with WooCommerce integration.

## Overview

The password reset system is designed to work primarily with WooCommerce's built-in email system, ensuring consistency with your WordPress/WooCommerce installation.

## How It Works

### 1. Password Reset Request (`/password-reset`)
- User enters their email address
- System checks if customer exists in WooCommerce
- Triggers WordPress lost password API which sends email via WooCommerce
- Falls back to custom token system if WordPress API fails

### 2. Password Reset Completion (`/reset-password`)
- Handles both WordPress reset keys and custom tokens
- Validates token/key expiration
- Updates customer password in WooCommerce
- Redirects to login page

## API Endpoints

### `/api/auth/forgot-password`
**POST** - Initiates password reset process

**Request:**
```json
{
  "email": "customer@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Falls diese E-Mail-Adresse in unserem System existiert, wurde eine Passwort-Reset-E-Mail von WooCommerce gesendet."
}
```

### `/api/auth/reset-password`
**POST** - Resets password using custom token

**Request:**
```json
{
  "token": "custom_reset_token",
  "email": "customer@example.com",
  "password": "newpassword123"
}
```

### `/api/auth/wp-password-reset`
**POST** - Resets password using WordPress reset key

**Request:**
```json
{
  "key": "wordpress_reset_key",
  "login": "customer@example.com",
  "password": "newpassword123"
}
```

## Environment Variables Required

```env
# WooCommerce Configuration
NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-wordpress-site.com
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Security
JWT_SECRET=your_jwt_secret_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## WooCommerce Email Configuration

### Setting Up Password Reset Emails in WooCommerce

1. **WordPress Admin Dashboard**
   - Go to WooCommerce > Settings > Emails
   - Find "Reset password" email template
   - Customize the email template as needed

2. **Email Settings**
   - Configure SMTP settings in WordPress
   - Test email delivery
   - Ensure emails are not going to spam

### Email Template Customization

The default WordPress/WooCommerce password reset email will contain:
- Reset link with WordPress-generated key
- Customizable subject and content
- Your site branding

## Fallback System

If WordPress API fails, the system falls back to:
1. Custom token generation and storage in WooCommerce customer meta
2. Console logging of reset URLs for manual handling
3. 24-hour token expiration

## Security Features

- **Rate Limiting**: Prevents abuse of password reset requests
- **Token Expiration**: All reset tokens expire after 24 hours
- **Email Verification**: Only registered customer emails can request resets
- **Secure Tokens**: Uses cryptographically secure token generation
- **No Information Disclosure**: Same response whether email exists or not

## Frontend Pages

### `/password-reset`
- Modern, responsive design
- Email validation
- Loading states and error handling
- Success confirmation

### `/reset-password`
- Password strength indicator
- Confirmation field validation
- Token validation
- Success state with auto-redirect

## Integration with Existing Auth Flow

The password reset functionality integrates seamlessly with:
- Login page (`/auth`) - includes "Forgot Password?" link
- Customer dashboard (`/dashboard`) - accessible after reset
- Loading system - uses consistent spinner components

## Testing

### Development Mode
- Reset URLs are logged to console for easy testing
- Detailed error logging for debugging
- Both WordPress and custom token systems can be tested

### Production Checklist
- [ ] WooCommerce emails configured and tested
- [ ] SMTP settings working properly
- [ ] Environment variables set correctly
- [ ] Email delivery not blocked by spam filters
- [ ] SSL certificate valid for secure token transmission

## Troubleshooting

### Common Issues

1. **Emails Not Sending**
   - Check WordPress SMTP configuration
   - Verify WooCommerce email settings
   - Check server email logs

2. **Invalid Reset Links**
   - Verify NEXT_PUBLIC_SITE_URL is correct
   - Check token expiration (24 hours)
   - Ensure WordPress site URL matches

3. **API Errors**
   - Verify WooCommerce API credentials
   - Check WordPress REST API is enabled
   - Confirm customer exists in WooCommerce

### Debug Mode

Enable debug logging by checking console output in development mode. The system provides detailed logs for:
- Customer lookup results
- WordPress API responses
- Token generation and storage
- Email sending attempts

## Best Practices

1. **Email Deliverability**
   - Use proper SMTP configuration
   - Set up SPF, DKIM records
   - Monitor email reputation

2. **Security**
   - Use HTTPS in production
   - Set secure JWT_SECRET
   - Monitor for abuse patterns

3. **User Experience**
   - Clear error messages
   - Loading states for all actions
   - Success confirmations
   - Mobile-responsive design

4. **Monitoring**
   - Log password reset attempts
   - Monitor email delivery rates
   - Track completion rates