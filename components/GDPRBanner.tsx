import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const BannerContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$show'].includes(prop)
})<{ $show: boolean }>`
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    width: 100%;
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
  
  @media (max-width: 768px) {
    width: 100%;
  }
`

const RejectButton = styled.button`
  background: transparent;
  color: #9ca3af;
  border: 1px solid #374151;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: #374151;
    color: white;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
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

  const handleReject = () => {
    localStorage.setItem('gdpr-consent', 'rejected')
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
      <ButtonGroup>
        <RejectButton onClick={handleReject}>
          Ablehnen
        </RejectButton>
        <AcceptButton onClick={handleAccept}>
          Akzeptieren
        </AcceptButton>
      </ButtonGroup>
    </BannerContainer>
  )
}

export default GDPRBanner