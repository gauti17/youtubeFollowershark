import React from 'react'
import styled, { keyframes } from 'styled-components'

// Spinning animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

// Pulse animation for skeleton loading
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`

// Shimmer animation for skeleton loading
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

// Basic spinner component
const SpinnerWrapper = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => {
    switch (props.size) {
      case 'small': return '16px'
      case 'large': return '48px'
      default: return '24px'
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '16px'
      case 'large': return '48px'
      default: return '24px'
    }
  }};
`

const SpinnerCircle = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  width: 100%;
  height: 100%;
  border: ${props => props.size === 'small' ? '2px' : '3px'} solid #f3f4f6;
  border-top: ${props => props.size === 'small' ? '2px' : '3px'} solid #FF6B35;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', className }) => (
  <SpinnerWrapper size={size} className={className}>
    <SpinnerCircle size={size} />
  </SpinnerWrapper>
)

// Button loading state
const ButtonSpinnerWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

interface ButtonSpinnerProps {
  children: React.ReactNode
  loading?: boolean
  size?: 'small' | 'medium' | 'large'
}

export const ButtonWithSpinner: React.FC<ButtonSpinnerProps> = ({ 
  children, 
  loading = false, 
  size = 'small' 
}) => (
  <ButtonSpinnerWrapper>
    {loading && <Spinner size={size} />}
    {children}
  </ButtonSpinnerWrapper>
)

// Skeleton loading components
const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`

const SkeletonLine = styled(SkeletonBase)<{ width?: string; height?: string }>`
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  margin-bottom: 8px;
`

const SkeletonCircle = styled(SkeletonBase)<{ size?: string }>`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
`

const SkeletonRect = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '100px'};
`

// Product card skeleton
const ProductSkeletonWrapper = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const ProductSkeletonHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`

const ProductSkeletonFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const ProductCardSkeleton: React.FC = () => (
  <ProductSkeletonWrapper>
    <div>
      <ProductSkeletonHeader>
        <SkeletonRect width="80px" height="80px" />
        <SkeletonLine width="80%" height="20px" />
        <SkeletonLine width="100%" height="14px" />
        <SkeletonLine width="60%" height="14px" />
      </ProductSkeletonHeader>
    </div>
    <ProductSkeletonFooter>
      <SkeletonLine width="40%" height="18px" />
      <SkeletonRect width="100%" height="44px" />
    </ProductSkeletonFooter>
  </ProductSkeletonWrapper>
)

// Page loading overlay
const OverlayWrapper = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.3s ease;
`

const OverlayContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
`

const OverlayText = styled.p`
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  text-align: center;
`

interface LoadingOverlayProps {
  show: boolean
  text?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  show, 
  text = 'Loading...' 
}) => (
  <OverlayWrapper $show={show}>
    <OverlayContent>
      <Spinner size="large" />
      <OverlayText>{text}</OverlayText>
    </OverlayContent>
  </OverlayWrapper>
)

// Inline loading component
const InlineLoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 12px;
`

const InlineLoadingText = styled.span`
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
`

interface InlineLoadingProps {
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({ 
  text = 'Loading...', 
  size = 'medium' 
}) => (
  <InlineLoadingWrapper>
    <Spinner size={size} />
    <InlineLoadingText>{text}</InlineLoadingText>
  </InlineLoadingWrapper>
)

// Form field skeleton
const FormSkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`

const FormFieldSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => (
  <FormSkeletonWrapper>
    {Array.from({ length: fields }).map((_, index) => (
      <FormFieldSkeleton key={index}>
        <SkeletonLine width="25%" height="14px" />
        <SkeletonRect height="48px" />
      </FormFieldSkeleton>
    ))}
  </FormSkeletonWrapper>
)

// Cart item skeleton
const CartItemSkeletonWrapper = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
`

const CartItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const CartItemActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
`

export const CartItemSkeleton: React.FC = () => (
  <CartItemSkeletonWrapper>
    <SkeletonCircle size="60px" />
    <CartItemContent>
      <SkeletonLine width="70%" height="18px" />
      <SkeletonLine width="50%" height="14px" />
      <SkeletonLine width="30%" height="14px" />
    </CartItemContent>
    <CartItemActions>
      <SkeletonLine width="60px" height="20px" />
      <SkeletonRect width="80px" height="36px" />
    </CartItemActions>
  </CartItemSkeletonWrapper>
)

// Text skeletons for different content types
export const TextSkeleton = {
  Line: SkeletonLine,
  Circle: SkeletonCircle,
  Rect: SkeletonRect,
}

// Loading states for different contexts
export const LoadingStates = {
  Spinner,
  ButtonWithSpinner,
  ProductCardSkeleton,
  LoadingOverlay,
  InlineLoading,
  FormSkeleton,
  CartItemSkeleton,
  TextSkeleton,
}

export default LoadingStates