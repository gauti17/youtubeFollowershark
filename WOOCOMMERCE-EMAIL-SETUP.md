# WooCommerce Email Setup for Automatic Account Creation

This guide explains how to configure WooCommerce to send automatic password emails when customer accounts are created during checkout.

## Required WooCommerce Email Configuration

### 1. Enable Customer Email Notifications

In your WooCommerce admin panel:

1. Go to **WooCommerce → Settings → Emails**
2. Find **"Customer new account"** email template
3. **Enable** this email type
4. Configure the email content (see below)

### 2. Email Template Customization

**Subject Line (German):**
```
Willkommen bei YouShark - Ihr Kundenaccount wurde erstellt
```

**Email Content Template:**
```html
<p>Hallo {customer_first_name},</p>

<p>Vielen Dank für Ihre Bestellung bei YouShark! Wir haben automatisch ein Kundenaccount für Sie erstellt.</p>

<h3>Ihre Zugangsdaten:</h3>
<ul>
<li><strong>E-Mail:</strong> {customer_email}</li>
<li><strong>Passwort:</strong> {customer_password}</li>
<li><strong>Login-URL:</strong> <a href="{site_url}/auth">{site_url}/auth</a></li>
</ul>

<p><strong>Dashboard-URL:</strong> <a href="{site_url}/dashboard">{site_url}/dashboard</a></p>

<h3>Was Sie mit Ihrem Account machen können:</h3>
<ul>
<li>Alle Ihre Bestellungen verwalten</li>
<li>Bestellstatus verfolgen</li>
<li>Rechnungen herunterladen</li>
<li>Neue Services bestellen</li>
<li>Support-Tickets erstellen</li>
</ul>

<p><strong>Wichtig:</strong> Bitte ändern Sie Ihr Passwort nach dem ersten Login aus Sicherheitsgründen.</p>

<p>Bei Fragen stehen wir Ihnen gerne zur Verfügung:</p>
<ul>
<li>E-Mail: support@youshark.de</li>
<li>Antwortzeit: Innerhalb von 2 Stunden</li>
</ul>

<p>Viel Erfolg mit Ihren YouTube Growth Services!</p>

<p>Ihr YouShark Team</p>
```

### 3. Additional WooCommerce Settings

**Account & Privacy Settings:**
1. Go to **WooCommerce → Settings → Accounts & Privacy**
2. ✅ Enable **"Allow customers to create an account during checkout"**
3. ✅ Enable **"Allow customers to log into an existing account during checkout"** 
4. ✅ Enable **"When creating an account, automatically generate an account password"**
5. ✅ Enable **"Notify the customer of the account password via email"**

**Email Settings:**
1. Go to **WooCommerce → Settings → Emails**
2. Configure your **"From" name**: `YouShark Support`
3. Configure your **"From" address**: `support@youshark.de`
4. Set up **SMTP** for reliable email delivery (recommended: SendGrid, Mailgun, or SES)

### 4. Testing the Email Flow

To test the automatic account creation and email sending:

1. Create a test order using a new email address
2. Check that:
   - Customer account is created in **WooCommerce → Customers**
   - Welcome email is sent with login credentials
   - Customer can login using the provided credentials
   - Order is linked to the customer account

### 5. Email Delivery Setup (Production)

For production, configure SMTP to ensure emails are delivered:

**Recommended SMTP Plugins:**
- WP Mail SMTP by WPForms
- Easy WP SMTP
- Post SMTP Mailer/Email Log

**SMTP Providers:**
- **SendGrid** (recommended for high volume)
- **Amazon SES** (cost-effective)
- **Mailgun** (developer-friendly)
- **Gmail SMTP** (for small volumes)

### 6. Email Customization Options

You can further customize emails by:

1. **Using a plugin** like "WooCommerce Email Customizer"
2. **Custom templates** in your theme: `woocommerce/emails/`
3. **Hooks and filters** in `functions.php`
4. **Third-party services** like Klaviyo or Mailchimp

## Code Implementation Details

The automatic account creation is handled in:
- `lib/customerService.ts` - Customer creation logic
- `lib/orderService.ts` - Order creation with customer linking
- `pages/api/orders/create.ts` - API endpoint
- `pages/checkout.tsx` - Frontend handling
- `pages/success.tsx` - Success page with account info

## Security Notes

1. **Auto-generated passwords** are cryptographically secure
2. **Email delivery** should use encrypted SMTP
3. **Account verification** can be added if needed
4. **Password reset** functionality should be available
5. **Rate limiting** on account creation prevents abuse

## Troubleshooting

**Emails not sending:**
- Check SMTP configuration
- Verify WooCommerce email settings
- Test with WordPress mail function
- Check spam folders

**Accounts not created:**
- Verify WooCommerce account settings
- Check for plugin conflicts
- Review error logs
- Test API endpoints manually

**Customer can't login:**
- Verify email was delivered
- Check password reset functionality
- Ensure login page works correctly
- Verify user capabilities are set

---

With this setup, customers will automatically receive account credentials via email when they place their first order, creating a seamless experience from purchase to account access.