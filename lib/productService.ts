import { wooCommerceAPI } from './woocommerce'
import { products } from '../data/products'

export interface WooCommerceProduct {
  id?: number
  name: string
  type: 'simple' | 'variable' | 'grouped' | 'external'
  description: string
  short_description: string
  sku: string
  regular_price: string
  virtual: boolean
  downloadable: boolean
  status: 'draft' | 'publish'
  catalog_visibility: 'visible' | 'catalog' | 'search' | 'hidden'
  tax_status?: 'taxable' | 'shipping' | 'none'
  tax_class?: string
  meta_data?: Array<{
    key: string
    value: string | number
  }>
}

export class ProductService {
  
  /**
   * Create or get virtual product in WooCommerce for our services
   */
  async ensureVirtualProduct(productSlug: string): Promise<number> {
    try {
      console.log(`Checking for existing product with SKU: youshark_${productSlug}`)
      
      // First try to find existing product by SKU
      const existingProducts = await wooCommerceAPI.get('products', {
        sku: `youshark_${productSlug}`,
        per_page: 1
      })

      console.log(`Existing products response:`, existingProducts)

      if (existingProducts && existingProducts.length > 0) {
        console.log(`Found existing WooCommerce product for ${productSlug}:`, existingProducts[0].id)
        return existingProducts[0].id
      }

      // Find our local product data
      console.log(`Looking for local product with slug: ${productSlug}`)
      const localProduct = products.find(p => p.slug === productSlug)
      if (!localProduct) {
        console.error(`Available product slugs:`, products.map(p => p.slug))
        throw new Error(`Local product not found: ${productSlug}`)
      }
      
      console.log(`Found local product:`, { name: localProduct.name, slug: localProduct.slug })

      // Create virtual product in WooCommerce
      const productData: WooCommerceProduct = {
        name: localProduct.name,
        type: 'simple', // Use 'simple' type for virtual products
        description: localProduct.description,
        short_description: localProduct.description,
        sku: `youshark_${productSlug}`,
        regular_price: localProduct.basePrice.toString(),
        virtual: true, // This makes it a virtual product
        downloadable: false,
        status: 'publish',
        catalog_visibility: 'hidden', // Hidden from catalog since we manage products in Next.js
        tax_status: 'none', // No tax for small business
        tax_class: '', // Empty tax class
        meta_data: [
          { key: '_youshark_product_slug', value: productSlug },
          { key: '_youshark_product_category', value: localProduct.category },
          { key: '_youshark_service_type', value: 'youtube_growth' },
          { key: '_virtual_service', value: 'yes' },
          { key: '_tax_status', value: 'none' }
        ]
      }

      console.log('Creating WooCommerce virtual product for:', productSlug)
      const createdProduct = await wooCommerceAPI.post('products', productData)

      if (createdProduct && createdProduct.id) {
        console.log(`Created WooCommerce product for ${productSlug}:`, createdProduct.id)
        return createdProduct.id
      } else {
        throw new Error('Failed to create WooCommerce product')
      }

    } catch (error) {
      console.error(`Error ensuring virtual product for ${productSlug}:`, error)
      throw error
    }
  }

  /**
   * Create all virtual products for our services
   */
  async ensureAllVirtualProducts(): Promise<{ [slug: string]: number }> {
    console.log('Starting virtual products creation...')
    console.log('Available products:', products.map(p => ({ id: p.id, name: p.name, slug: p.slug })))
    
    const productIds: { [slug: string]: number } = {}
    
    for (const product of products) {
      try {
        console.log(`Processing product: ${product.slug}`)
        productIds[product.slug] = await this.ensureVirtualProduct(product.slug)
        console.log(`Successfully processed product ${product.slug}: ID ${productIds[product.slug]}`)
      } catch (error) {
        console.error(`Failed to ensure product ${product.slug}:`, error)
        // Continue with other products
      }
    }

    console.log('Final product IDs:', productIds)
    return productIds
  }

  /**
   * Get WooCommerce product ID by slug
   */
  async getProductIdBySlug(slug: string): Promise<number | null> {
    try {
      const products = await wooCommerceAPI.get('products', {
        sku: `youshark_${slug}`,
        per_page: 1
      })

      if (products && products.length > 0) {
        return products[0].id
      }

      return null
    } catch (error) {
      console.error(`Error getting product ID for ${slug}:`, error)
      return null
    }
  }
}

// Export singleton instance
export const productService = new ProductService()