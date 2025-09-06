import React, { useState, useContext, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { CartContext } from '../lib/CartContext'

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.03);
`

const Nav = styled.nav`
  padding: 15px 0;
`

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`

const Logo = styled.div`
  h1 {
    font-size: 28px;
    font-weight: 750;
    color: #333;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    letter-spacing: -0.5px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    
    .highlight {
      color: #FF6B35;
    }
  }
  
  a {
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s ease;
    display: inline-block;
    
    &:hover {
      transform: scale(1.02);
    }
  }
`

const NavMenu = styled.ul`
  display: flex;
  list-style: none;
  gap: 30px;
  align-items: center;
  margin: 0;
  padding: 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const MobileNavMenu = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: block;
  }
`

const MobileNavContent = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 280px;
  background: white;
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`

const MobileNavHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MobileNavBody = styled.div`
  padding: 20px;
`

const MobileNavItem = styled.div`
  padding: 15px 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
  
  a {
    color: #333;
    text-decoration: none;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    
    &:hover {
      color: #FF6B35;
    }
  }
`

const MobileAuthSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
`

const MobileAuthButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.login {
    background: transparent;
    color: #333;
    border: 2px solid #e2e8f0;
    
    &:hover {
      border-color: #FF6B35;
      color: #FF6B35;
    }
  }
  
  &.register {
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }
  }
  
  &.logout {
    background: #fef2f2;
    color: #ef4444;
    border: 1px solid #fecaca;
    
    &:hover {
      background: #fee2e2;
    }
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 5px;
  border-radius: 4px;
  
  &:hover {
    background: #f1f5f9;
  }
`

const MobileUserInfo = styled.div`
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  
  .name {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
  }
  
  .email {
    font-size: 14px;
    color: #666;
  }
`

const NavItem = styled.li`
  a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: color 0.2s ease;
    
    &:hover {
      color: #FF6B35;
    }
  }
`

const CartLink = styled.a`
  background: #f8f9fa;
  padding: 10px 15px;
  border-radius: 25px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #e9ecef;
  }
`

const CartCount = styled.span<{ $count: number }>`
  background: #FF6B35;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  min-width: 18px;
  text-align: center;
  margin-left: 8px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: ${props => props.$count > 0 ? 'cartPulse 0.6s ease-out' : 'none'};
  transform-origin: center center;
  
  @keyframes cartPulse {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.3);
      background: #FF8B35;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.3);
    }
    50% {
      transform: scale(1.1);
      background: #FF6B35;
    }
    75% {
      transform: scale(1.15);
      box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
    }
    100% {
      transform: scale(1);
      background: #FF6B35;
      box-shadow: none;
    }
  }
  
  @keyframes cartBounce {
    0%, 20%, 53%, 80%, 100% {
      transform: scale(1);
    }
    40%, 43% {
      transform: scale(1.2);
    }
  }
  
  /* Add a subtle bounce when count increases */
  &.count-increased {
    animation: cartBounce 0.8s ease-in-out;
  }
  
  /* Add a glow effect for emphasis */
  &.just-added {
    box-shadow: 0 0 8px rgba(255, 107, 53, 0.6);
    animation: cartPulse 0.6s ease-out;
  }
`

const AuthLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 20px;
  
  @media (max-width: 768px) {
    margin-left: 10px;
    gap: 10px;
  }
`

const LoginLink = styled.a`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #FF6B35;
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const RegisterButton = styled.a`
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 14px;
  }
`

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 20px;
`

const UserName = styled.span`
  color: #333;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    color: #FF6B35;
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`

const LogoutLink = styled.a`
  color: #ef4444;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
    color: #FF6B35;
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`

const MobileCartAndMenu = styled.div`
  display: none;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 768px) {
    display: flex;
  }
`

const MobileCartLink = styled.div`
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background: #e9ecef;
  }
  
  .cart-icon {
    font-size: 18px;
  }
`

interface Customer {
  id: number
  email: string
  firstName: string
  lastName: string
}

const Header: React.FC = () => {
  const router = useRouter()
  const cartContext = useContext(CartContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [prevCartCount, setPrevCartCount] = useState(0)
  const [animationClass, setAnimationClass] = useState('')
  
  const cartItemCount = cartContext?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  useEffect(() => {
    setIsClient(true)
    
    // Check for authentication on component mount and when localStorage changes
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken')
        const storedCustomer = localStorage.getItem('customer')
        
        if (token && storedCustomer) {
          try {
            const customerData = JSON.parse(storedCustomer)
            setCustomer(customerData)
          } catch (error) {
            console.error('Error parsing customer data:', error)
            localStorage.removeItem('authToken')
            localStorage.removeItem('customer')
          }
        } else {
          setCustomer(null)
        }
      }
    }

    checkAuth()

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  // Handle cart count changes and trigger animations
  useEffect(() => {
    if (cartItemCount > prevCartCount && prevCartCount > 0) {
      // Cart count increased - trigger animation
      setAnimationClass('just-added')
      
      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        setAnimationClass('')
      }, 600)
      
      return () => clearTimeout(timer)
    }
    
    setPrevCartCount(cartItemCount)
  }, [cartItemCount, prevCartCount])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('customer')
    setCustomer(null)
    router.push('/')
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <>
      <HeaderContainer>
        <Nav>
          <NavContainer>
            <Logo>
              <Link href="/">
                <h1>
                  <span style={{color: '#1a1a1a', fontWeight: '750'}}>you</span>
                  <span style={{color: '#FF6B35', fontWeight: '750'}}>shark</span>
                  <span style={{
                    color: '#FF6B35', 
                    fontSize: '32px',
                    fontWeight: '750',
                    textShadow: '3px 3px 6px rgba(255, 107, 53, 0.3)'
                  }}>.</span>
                </h1>
              </Link>
            </Logo>
            
            {/* Desktop Navigation */}
            <NavMenu>
              <NavItem>
                <Link href="/">
                  Home
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/shop">
                  Shop
                </Link>
              </NavItem>
              <NavItem>
                <CartLink onClick={() => router.push('/cart')}>
                  🛒 Warenkorb 
                  <CartCount $count={cartItemCount} className={animationClass}>{cartItemCount}</CartCount>
                </CartLink>
              </NavItem>
              
              {/* Authentication Links - Only show on client side to prevent hydration mismatch */}
              {isClient && (
                <>
                  {customer ? (
                    <UserMenu>
                      <UserName onClick={() => router.push('/dashboard')}>
                        {customer.firstName}
                      </UserName>
                      <LogoutLink onClick={handleLogout}>
                        Abmelden
                      </LogoutLink>
                    </UserMenu>
                  ) : (
                    <AuthLinks>
                      <LoginLink onClick={() => router.push('/auth')}>
                        Anmelden
                      </LoginLink>
                      <RegisterButton onClick={() => router.push('/auth')}>
                        Registrieren
                      </RegisterButton>
                    </AuthLinks>
                  )}
                </>
              )}
            </NavMenu>

            {/* Mobile Cart & Menu Button */}
            <MobileCartAndMenu>
              <MobileCartLink onClick={() => router.push('/cart')}>
                <span className="cart-icon">🛒</span>
                <CartCount $count={cartItemCount} className={animationClass}>{cartItemCount}</CartCount>
              </MobileCartLink>
              
              <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
                ☰
              </MobileMenuButton>
            </MobileCartAndMenu>
          </NavContainer>
        </Nav>
      </HeaderContainer>

      {/* Mobile Navigation Menu */}
      <MobileNavMenu $isOpen={mobileMenuOpen} onClick={closeMobileMenu}>
        <MobileNavContent $isOpen={mobileMenuOpen} onClick={(e) => e.stopPropagation()}>
          <MobileNavHeader>
            <Logo>
              <h1 style={{ fontSize: '24px' }}>
                <span style={{color: '#1a1a1a', fontWeight: '750'}}>you</span>
                <span style={{color: '#FF6B35', fontWeight: '750'}}>shark</span>
                <span style={{color: '#FF6B35', fontWeight: '750'}}>.</span>
              </h1>
            </Logo>
            <CloseButton onClick={closeMobileMenu}>
              ✕
            </CloseButton>
          </MobileNavHeader>

          <MobileNavBody>
            {/* User Info Section */}
            {isClient && customer && (
              <MobileUserInfo>
                <div className="name">{customer.firstName} {customer.lastName}</div>
                <div className="email">{customer.email}</div>
              </MobileUserInfo>
            )}

            {/* Navigation Links */}
            <MobileNavItem>
              <Link href="/" onClick={closeMobileMenu}>
                🏠 Home
              </Link>
            </MobileNavItem>
            
            <MobileNavItem>
              <Link href="/shop" onClick={closeMobileMenu}>
                🛍️ Shop
              </Link>
            </MobileNavItem>

            {isClient && customer && (
              <MobileNavItem>
                <Link href="/dashboard" onClick={closeMobileMenu}>
                  📊 Dashboard
                </Link>
              </MobileNavItem>
            )}

            {/* Authentication Section */}
            {isClient && (
              <MobileAuthSection>
                {customer ? (
                  <MobileAuthButton 
                    className="logout" 
                    onClick={() => { handleLogout(); closeMobileMenu(); }}
                  >
                    Abmelden
                  </MobileAuthButton>
                ) : (
                  <>
                    <MobileAuthButton 
                      className="login"
                      onClick={() => { router.push('/auth'); closeMobileMenu(); }}
                    >
                      Anmelden
                    </MobileAuthButton>
                    <MobileAuthButton 
                      className="register"
                      onClick={() => { router.push('/auth'); closeMobileMenu(); }}
                    >
                      Registrieren
                    </MobileAuthButton>
                  </>
                )}
              </MobileAuthSection>
            )}
          </MobileNavBody>
        </MobileNavContent>
      </MobileNavMenu>
    </>
  )
}

export default Header