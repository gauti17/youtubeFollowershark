// Utility functions for consistent formatting across server and client

export const formatNumber = (num: number): string => {
  // Use a consistent format that works the same on server and client
  return new Intl.NumberFormat('en-US').format(num)
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

export const formatQuantity = (quantity: number): string => {
  // Use simple comma formatting to avoid locale issues
  return quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}