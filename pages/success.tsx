import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Fallback redirect page for old /success route
// This ensures any cached or old references redirect to the correct location
const SuccessRedirect = () => {
  const router = useRouter()

  useEffect(() => {
    // Immediately redirect to the correct success page
    router.replace('/checkout/success')
  }, [router])

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>
      Weiterleitung...
    </div>
  )
}

export default SuccessRedirect