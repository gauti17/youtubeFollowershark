import { wooCommerceAPI, BillingAddress } from './woocommerce'
import { CheckoutFormData } from './orderService'

export interface CustomerCreateResult {
  success: boolean
  customerId?: number
  customerExists?: boolean
  error?: string
}

export class CustomerService {
  
  /**
   * Check if customer already exists by email
   */
  async customerExists(email: string): Promise<{ exists: boolean; customerId?: number }> {
    try {
      const customers = await wooCommerceAPI.get('customers', {
        email: email,
        per_page: 1
      })

      if (customers && customers.length > 0) {
        return {
          exists: true,
          customerId: customers[0].id
        }
      }

      return { exists: false }
    } catch (error) {
      console.error('Error checking customer existence:', error)
      return { exists: false }
    }
  }

  /**
   * Create a new customer account with auto-generated password
   * WooCommerce will send the welcome email with login credentials
   */
  async createCustomer(formData: CheckoutFormData): Promise<CustomerCreateResult> {
    try {
      console.log(`[CustomerService] Starting customer creation process for email: ${formData.email}`)
      
      // First check if customer already exists
      const existingCustomer = await this.customerExists(formData.email)
      console.log(`[CustomerService] Existing customer check result:`, existingCustomer)
      
      if (existingCustomer.exists) {
        console.log(`[CustomerService] Customer already exists with ID: ${existingCustomer.customerId}`)
        return {
          success: true,
          customerId: existingCustomer.customerId,
          customerExists: true
        }
      }

      // Create billing address
      const billingAddress: BillingAddress = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        country: formData.country,
        city: formData.city,
        postcode: formData.postalCode,
        address_1: formData.address1 || '',
        address_2: formData.address2 || '',
        phone: formData.phone || ''
      }

      // Create new customer - WooCommerce will auto-generate password and send email
      const customerData = {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: this.generateUsername(formData.email),
        billing: billingAddress,
        shipping: billingAddress, // Same as billing for digital services
        // Don't set password - let WooCommerce generate it
        // This will trigger the "New Account" email with auto-generated password
        meta_data: [
          { key: '_account_created_via', value: 'youshark_checkout' },
          { key: '_account_created_date', value: new Date().toISOString() },
          { key: '_account_type', value: 'auto_created' }
        ]
      }

      console.log('Creating customer with auto-generated password:', {
        email: customerData.email,
        firstName: customerData.first_name,
        lastName: customerData.last_name,
        username: customerData.username,
        fullName: `${customerData.first_name} ${customerData.last_name}`,
        billingFirstName: customerData.billing.first_name,
        billingLastName: customerData.billing.last_name
      })

      const customer = await wooCommerceAPI.post('customers', customerData)
      
      if (customer && customer.id) {
        console.log('Customer created successfully:', {
          id: customer.id,
          email: customer.email,
          emailSent: 'WooCommerce will send welcome email with password'
        })

        return {
          success: true,
          customerId: customer.id,
          customerExists: false
        }
      } else {
        throw new Error('Kunde konnte nicht erstellt werden')
      }

    } catch (error: any) {
      console.error('Error creating customer:', error)
      
      // Handle specific WooCommerce errors
      const errorMessage = error.message || error.toString()
      
      console.log(`[CustomerService] Customer creation failed with error: ${errorMessage}`)
      
      // Handle duplicate email error (WordPress user exists but not WooCommerce customer)
      if (errorMessage.includes('email') && (errorMessage.includes('exists') || errorMessage.includes('already')) || 
          errorMessage.includes('registration-error-email-exists')) {
        console.log(`[CustomerService] Detected duplicate email error, checking for existing WooCommerce customer`)
        
        // Try to find the existing customer
        const existingCustomer = await this.customerExists(formData.email)
        console.log(`[CustomerService] Double-check existing customer result:`, existingCustomer)
        
        if (existingCustomer.exists) {
          console.log(`[CustomerService] Found existing WooCommerce customer, using ID: ${existingCustomer.customerId}`)
          return {
            success: true,
            customerId: existingCustomer.customerId,
            customerExists: true
          }
        } else {
          // WordPress user exists but no WooCommerce customer profile
          console.log(`[CustomerService] WordPress user exists but no WooCommerce customer profile found`)
          console.log(`[CustomerService] This indicates the email ${formData.email} has a WordPress user but not a WooCommerce customer`)
          
          // Return a more informative error message
          return {
            success: false,
            error: `Ein WordPress-Benutzer mit der E-Mail-Adresse "${formData.email}" existiert bereits, aber kein WooCommerce-Kundenprofil. Bitte verwenden Sie eine andere E-Mail-Adresse oder kontaktieren Sie den Support.`
          }
        }
      }
      
      return {
        success: false,
        error: `Kundenerstellung fehlgeschlagen: ${errorMessage}`
      }
    }
  }

  /**
   * Generate a unique username from email
   * Format: email prefix + random suffix if needed
   */
  private generateUsername(email: string): string {
    const prefix = email.split('@')[0].toLowerCase()
    // Remove any non-alphanumeric characters
    const cleanPrefix = prefix.replace(/[^a-z0-9]/g, '')
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now().toString().slice(-4)
    return `${cleanPrefix}_${timestamp}`
  }

  /**
   * Get customer by ID
   */
  async getCustomer(customerId: number): Promise<any> {
    try {
      const customer = await wooCommerceAPI.get(`customers/${customerId}`)
      return customer
    } catch (error) {
      console.error('Error fetching customer:', error)
      throw error
    }
  }

  /**
   * Update customer billing information
   */
  async updateCustomerBilling(customerId: number, billingData: BillingAddress): Promise<boolean> {
    try {
      await wooCommerceAPI.put(`customers/${customerId}`, {
        billing: billingData,
        shipping: billingData
      })
      return true
    } catch (error) {
      console.error('Error updating customer billing:', error)
      return false
    }
  }
}

// Export singleton instance
export const customerService = new CustomerService()