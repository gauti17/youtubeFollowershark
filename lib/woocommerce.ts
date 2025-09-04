// WooCommerce API Integration
export interface WooCommerceConfig {
  baseUrl: string
  consumerKey: string
  consumerSecret: string
}

export interface BillingAddress {
  first_name: string
  last_name: string
  email: string
  country: string
  city: string
  postcode: string
  address_1?: string
  address_2?: string
  state?: string
  phone?: string
}

export interface OrderLineItem {
  name: string
  product_id?: number
  sku?: string
  quantity: number
  price: string
  total: string
  meta_data?: Array<{
    key: string
    value: string | number
  }>
}

export interface OrderMetaData {
  key: string
  value: string | number
}

export interface WooCommerceOrder {
  customer_id?: number
  status: 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed'
  billing: BillingAddress
  shipping?: BillingAddress
  line_items: OrderLineItem[]
  shipping_lines?: Array<{
    method_id: string
    method_title: string
    total: string
  }>
  fee_lines?: Array<{
    name: string
    total: string
  }>
  coupon_lines?: Array<{
    code: string
    discount: string
  }>
  meta_data?: OrderMetaData[]
  customer_note?: string
  payment_method?: string
  payment_method_title?: string
  set_paid?: boolean
}

export interface WooCommerceOrderResponse {
  id: number
  number: string
  status: string
  currency: string
  total: string
  billing: BillingAddress
  line_items: OrderLineItem[]
  meta_data: OrderMetaData[]
  date_created: string
  date_modified: string
  order_key: string
}

class WooCommerceAPI {
  private config: WooCommerceConfig

  constructor(config: WooCommerceConfig) {
    this.config = config
  }

  private getAuthHeader(): string {
    const credentials = `${this.config.consumerKey}:${this.config.consumerSecret}`
    // Use btoa for browser compatibility instead of Buffer
    if (typeof window !== 'undefined') {
      return `Basic ${btoa(credentials)}`
    } else {
      return `Basic ${Buffer.from(credentials).toString('base64')}`
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<T> {
    // Use parameter format since pretty permalinks are not working
    // Handle query parameters properly with &
    const baseRestRoute = `${this.config.baseUrl}/?rest_route=/wc/v3`
    const [path, queryString] = endpoint.split('?')
    const url = queryString 
      ? `${baseRestRoute}${path}&${queryString}`
      : `${baseRestRoute}${endpoint}`
    
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`WooCommerce API Error ${response.status}: ${errorData}`)
      }

      return await response.json()
    } catch (error) {
      console.error('WooCommerce API Request Failed:', error)
      throw error
    }
  }

  async createOrder(orderData: WooCommerceOrder): Promise<WooCommerceOrderResponse> {
    return this.makeRequest<WooCommerceOrderResponse>('/orders', 'POST', orderData)
  }

  async getOrder(orderId: number): Promise<WooCommerceOrderResponse> {
    return this.makeRequest<WooCommerceOrderResponse>(`/orders/${orderId}`)
  }

  async updateOrderStatus(orderId: number, status: string): Promise<WooCommerceOrderResponse> {
    return this.makeRequest<WooCommerceOrderResponse>(`/orders/${orderId}`, 'PUT', { status })
  }

  async getOrders(params?: {
    status?: string
    customer?: number
    page?: number
    per_page?: number
    after?: string
    before?: string
  }): Promise<WooCommerceOrderResponse[]> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.makeRequest<WooCommerceOrderResponse[]>(endpoint)
  }

  // Generic methods that match WooCommerce REST API library pattern
  async get(endpoint: string, params?: any): Promise<any> {
    let fullEndpoint = `/${endpoint}`
    
    if (params) {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
      fullEndpoint += `?${queryParams.toString()}`
    }
    
    return this.makeRequest(fullEndpoint, 'GET')
  }

  async post(endpoint: string, data: any): Promise<any> {
    return this.makeRequest(`/${endpoint}`, 'POST', data)
  }

  async put(endpoint: string, data: any): Promise<any> {
    return this.makeRequest(`/${endpoint}`, 'PUT', data)
  }

  async delete(endpoint: string): Promise<any> {
    return this.makeRequest(`/${endpoint}`, 'DELETE')
  }
}

// Export singleton instance
const config = {
  baseUrl: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'https://your-woocommerce-site.com',
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || ''
}

// Debug logging for configuration
console.log('WooCommerce API Configuration:', {
  baseUrl: config.baseUrl,
  hasConsumerKey: !!config.consumerKey,
  hasConsumerSecret: !!config.consumerSecret,
  consumerKeyPrefix: config.consumerKey.substring(0, 5) + '...',
  consumerSecretPrefix: config.consumerSecret.substring(0, 5) + '...'
})

export const wooCommerceAPI = new WooCommerceAPI(config)

export default WooCommerceAPI