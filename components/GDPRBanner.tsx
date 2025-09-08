import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const BannerContainer = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  color: white;
  padding: 12px 20px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 1000;
  transform: translateY(${props => props.$show ? '0' : '100%'});
  transition: transform 0.3s ease;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 16px 20px;
    text-align: center;
  }
`

const BannerText = styled.div`
  color: #e5e7eb;
  line-height: 1.4;
  
  a {
    color: #FF6B35;
    text-decoration: underline;
    
    &:hover {
      color: #F7931E;
    }
  }
`

const AcceptButton = styled.button`
  background: #FF6B35;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: #F7931E;
    transform: translateY(-1px);
  }
`

const GDPRBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    
    const consent = localStorage.getItem('gdpr-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [isMounted])

  const handleAccept = () => {
    localStorage.setItem('gdpr-consent', 'accepted')
    setShowBanner(false)
  }

  if (!isMounted) return null

  return (
    <BannerContainer $show={showBanner}>
      <BannerText>
        Wir verwenden Cookies für die beste Nutzererfahrung. Mit der Nutzung stimmen Sie unserer{' '}
        <a href="/privacy" target="_blank" rel="noopener noreferrer">
          Datenschutzerklärung
        </a>{' '}
        zu.
      </BannerText>
      <AcceptButton onClick={handleAccept}>
        Akzeptieren
      </AcceptButton>
    </BannerContainer>
  )
}

export default GDPRBanner