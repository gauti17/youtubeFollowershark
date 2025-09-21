import React from 'react'
import styled, { keyframes } from 'styled-components'

const scroll = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`

const TopBarContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 0;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  z-index: 1000;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 0;
  }
`

const TopBarText = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    padding: 0;
    animation: ${scroll} 15s linear infinite;
    white-space: nowrap;
    justify-content: flex-start;
  }
`

const BrandHighlight = styled.span`
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`

const TopBar: React.FC = () => {
  return (
    <TopBarContainer>
      <TopBarText>
        🎉 Followergram ist jetzt <BrandHighlight>YouShark</BrandHighlight> - Dein neuer Partner für Social Media Erfolg!
      </TopBarText>
    </TopBarContainer>
  )
}

export default TopBar