# 🚀 Cloudflare Workers Deployment Guide

## Overview
This project is configured to deploy on Cloudflare Workers using `@cloudflare/next-on-pages`, which allows full Next.js functionality including API routes.

## Features Supported ✅

### Full Next.js Functionality
- ✅ **API Routes**: All `/api/*` endpoints work
- ✅ **Authentication**: Login, registration, password reset
- ✅ **Payment Processing**: PayPal integration
- ✅ **WooCommerce Integration**: Product and order management
- ✅ **Server-Side Rendering**: Dynamic content
- ✅ **Static Generation**: Optimized performance for static pages

### Core Features
- ✅ **SEO Optimization**: Meta tags, structured data, sitemaps
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Performance**: Edge caching, optimized assets
- ✅ **Security**: Headers, CSRF protection, secure cookies

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env.local`:
```bash
# WooCommerce Configuration
WOOCOMMERCE_URL=https://your-woocommerce-site.com
WOOCOMMERCE_KEY=your-consumer-key
WOOCOMMERCE_SECRET=your-consumer-secret

# PayPal Configuration  
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=sandbox  # or 'live' for production

# Authentication
JWT_SECRET=your-secure-jwt-secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://youshark.pages.dev
```

### 3. Build for Cloudflare Workers
```bash
npm run build:cloudflare
```

### 4. Preview Locally
```bash
npm run preview:cloudflare
```

### 5. Deploy to Cloudflare
```bash
npm run deploy:cloudflare
```

## Deployment Commands

```bash
# Development
npm run dev

# Build for Cloudflare Workers
npm run build:cloudflare

# Local preview with Workers runtime
npm run preview:cloudflare

# Deploy to Cloudflare Pages
npm run deploy:cloudflare

# Wrangler CLI commands
npx wrangler pages project create youshark-app
npx wrangler pages deploy .vercel/output/static
```

## Configuration Files

### `wrangler.toml`
Cloudflare Workers configuration:
```toml
name = "youshark-app"
compatibility_date = "2024-01-01"  
pages_build_output_dir = ".vercel/output/static"
```

### Environment Variables in Wrangler
Set production environment variables:
```bash
# Set environment variables
npx wrangler pages secret put WOOCOMMERCE_URL
npx wrangler pages secret put WOOCOMMERCE_KEY
npx wrangler pages secret put PAYPAL_CLIENT_ID
npx wrangler pages secret put JWT_SECRET

# List current secrets
npx wrangler pages secret list
```

## Cloudflare Dashboard Setup

### 1. Create Pages Project
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
2. **Create a project** → **Upload assets** or **Connect to Git**
3. If using Git:
   - Select repository
   - **Build command**: `npm run build:cloudflare`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/` (default)

### 2. Environment Variables
In Pages project settings → Environment variables:
```
WOOCOMMERCE_URL = https://your-woocommerce-site.com
WOOCOMMERCE_KEY = your-consumer-key
WOOCOMMERCE_SECRET = your-consumer-secret  
PAYPAL_CLIENT_ID = your-paypal-client-id
PAYPAL_CLIENT_SECRET = your-paypal-client-secret
JWT_SECRET = your-secure-jwt-secret
NODE_ENV = production
```

### 3. Custom Domain (Optional)
- Go to **Custom domains** tab
- Add your domain (e.g., `youshark.de`)
- DNS records will be automatically configured

## API Route Compatibility

### Working API Routes ✅
- **Authentication**: `/api/auth/*`
- **Payments**: `/api/payments/paypal/*`
- **Orders**: `/api/orders/*`
- **Customers**: `/api/customers/*`
- **Products**: `/api/products/*`
- **Coupons**: `/api/coupons/*`

### Node.js APIs Compatibility
Cloudflare Workers runtime supports:
- ✅ **Fetch API**: Native support
- ✅ **Crypto API**: Web Crypto API
- ✅ **JSON/FormData**: Native support
- ✅ **URL/URLSearchParams**: Native support

### Potential Adaptations Needed
Some Node.js specific APIs may need polyfills:
- **File System**: Use KV storage or R2
- **Buffer**: Use ArrayBuffer/Uint8Array
- **Process**: Use environment variables directly

## Database & Storage

### Option 1: Cloudflare D1 (SQL)
```toml
[[d1_databases]]
binding = "DB"
database_name = "youshark-db" 
database_id = "your-database-id"
```

### Option 2: Cloudflare KV (Key-Value)
```toml
[[kv_namespaces]]
binding = "YOUSHARK_KV"
id = "your-kv-namespace-id"
```

### Option 3: External Database
Keep existing WooCommerce/external database connections.

## Performance Benefits

### Edge Computing
- **Global Distribution**: Deploy to 300+ locations
- **Low Latency**: Sub-50ms response times
- **Auto-scaling**: Handle traffic spikes automatically

### Caching Strategy
- **Static Assets**: Cached at edge
- **API Routes**: Configurable caching
- **Pages**: ISR (Incremental Static Regeneration)

## Security Features

### Built-in Protection
- **DDoS Protection**: Automatic mitigation
- **Bot Management**: Advanced bot detection  
- **SSL/TLS**: Free SSL certificates
- **WAF**: Web Application Firewall

### Headers & Policies
- Security headers automatically applied
- CSP (Content Security Policy) support
- CORS handling for API routes

## Monitoring & Analytics

### Cloudflare Analytics
- Real-time traffic analytics
- Performance metrics
- Security insights
- Error tracking

### Logging & Debugging
```bash
# View logs
npx wrangler pages deployment tail

# Real-time logs during development
npx wrangler pages dev --live-reload
```

## Troubleshooting

### Build Issues
```bash
# Clear cache
rm -rf .next .vercel/output node_modules
npm install

# Rebuild
npm run build:cloudflare
```

### Runtime Errors
- Check Cloudflare Pages Function logs
- Verify environment variables are set
- Test API routes in local preview mode

### Deployment Problems
- Ensure build output directory is `.vercel/output/static`
- Check `wrangler.toml` configuration
- Verify Wrangler CLI is authenticated: `npx wrangler auth login`

## Migration Benefits

### From Static Pages to Workers
- ✅ **Full API Support**: All server-side functionality works
- ✅ **Database Integration**: Direct database connections
- ✅ **Authentication**: Complete user management
- ✅ **Payment Processing**: Secure payment handling
- ✅ **Dynamic Content**: Server-side rendering

### Performance Comparison
- **Static Pages**: Great for simple sites
- **Workers**: Full-stack with edge performance
- **Cost**: Often more economical than traditional hosting

---

**Ready for deployment with full functionality!** 🎉

All features work including authentication, payments, and API routes.