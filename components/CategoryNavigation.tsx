import React, { useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { products } from '../data/products'
import { formatPrice } from '../lib/formatUtils'

interface Category {
  id: string
  name: string
  icon: string
  color: string
  bgGradient: string
  description: string
}

const categories: Category[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    color: '#FF0000',
    bgGradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
    description: 'Views, Likes & Abonnenten'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#ff0050',
    bgGradient: 'linear-gradient(135deg, #ff0050 0%, #00f2ea 100%)',
    description: 'Views, Likes & Shares'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: '#E4405F',
    bgGradient: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #F77737 100%)',
    description: 'Likes, Views & Kommentare'
  }
]

const CategoryNavigationContainer = styled.div`
  margin: 60px 0;
  position: relative;
  z-index: 1;
`

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 30px;
  }
`

const CategoryTab = styled.button<{ $isActive: boolean; $color: string }>`
  background: ${props => props.$isActive ? props.$color : 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.$isActive ? 'white' : '#4a5568'};
  border: 2px solid ${props => props.$isActive ? props.$color : 'rgba(0, 0, 0, 0.1)'};
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 10px;
  backdrop-filter: blur(10px);
  box-shadow: ${props => props.$isActive 
    ? `0 8px 25px ${props.$color}40` 
    : '0 4px 15px rgba(0, 0, 0, 0.1)'};
  position: relative;
  overflow: hidden;
  min-width: 160px;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 14px;
    min-width: 140px;
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 13px;
    min-width: 120px;
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.$color};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 12px 35px ${props => props.$color}50;
    border-color: ${props => props.$color};
    
    &::before {
      opacity: ${props => props.$isActive ? 0 : 0.1};
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(0.98);
  }
  
  span {
    position: relative;
    z-index: 1;
  }
  
  .icon {
    font-size: 20px;
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
      font-size: 18px;
    }
  }
  
  .text {
    position: relative;
    z-index: 1;
  }
`

const CategoryDescription = styled.div<{ $color: string }>`
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
  color: #6b7280;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, ${props => props.$color}30 50%, transparent 100%);
    z-index: -1;
  }
  
  span {
    background: rgba(255, 255, 255, 0.95);
    padding: 0 20px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }
`

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  justify-items: center;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 600px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    max-width: 400px;
  }
`

const ProductCard = styled.div<{ $bgGradient: string }>`
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 320px;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.$bgGradient};
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: inherit;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.$bgGradient.split(' ')[1] || '#FF6B35'};
    
    &::before {
      opacity: 0.05;
    }
    
    .product-icon {
      transform: scale(1.1) rotate(5deg);
    }
    
    .view-button {
      background: ${props => props.$bgGradient};
      color: white;
      transform: translateY(-2px);
    }
  }
`

const ProductIcon = styled.div<{ $bgGradient: string }>`
  font-size: 48px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  background: ${props => props.$bgGradient}15;
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
  border: 1px solid ${props => props.$bgGradient}30;
`

const ProductTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  color: #1a1a1a;
  position: relative;
  z-index: 1;
  margin-bottom: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.01em;
`

const ProductDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  font-family: 'Inter', sans-serif;
  min-height: 42px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const ProductFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
`

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  
  .from {
    font-size: 12px;
    color: #9ca3af;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
  }
  
  .price {
    font-size: 18px;
    font-weight: 700;
    color: #FF6B35;
    font-family: 'Inter', sans-serif;
  }
  
  .original {
    font-size: 14px;
    color: #9ca3af;
    text-decoration: line-through;
    font-family: 'Inter', sans-serif;
  }
`

const ViewButton = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  color: #4a5568;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  position: relative;
  z-index: 1;
`

const ProductDiscount = styled.div<{ $color: string }>`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${props => props.$color};
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 20px ${props => props.$color}40;
  z-index: 3;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.02em;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: pulse 3s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 4px 20px ${props => props.$color}40;
    }
    50% { 
      transform: scale(1.05);
      box-shadow: 0 6px 25px ${props => props.$color}50;
    }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  font-family: 'Inter', sans-serif;
  
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  .title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #374151;
  }
  
  .description {
    font-size: 16px;
    line-height: 1.6;
  }
`

const CategoryNavigation: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('youtube')

  const getFilteredProducts = (categoryId: string) => {
    switch (categoryId) {
      case 'youtube':
        return products.filter(p => ['views', 'likes', 'subscribers'].includes(p.category))
      case 'tiktok':
        return products.filter(p => p.category.startsWith('tiktok-'))
      case 'instagram':
        return products.filter(p => p.category.startsWith('instagram-'))
      default:
        return []
    }
  }

  const formatProductPrice = (product: any) => {
    const minQuantity = product.quantityOptions[0] || 1000
    let price = product.basePrice * minQuantity
    if (product.discount) {
      price = price * (1 - product.discount / 100)
    }
    return formatPrice(price)
  }
  
  const formatOriginalPrice = (product: any) => {
    const minQuantity = product.quantityOptions[0] || 1000
    return formatPrice(product.basePrice * minQuantity)
  }

  const filteredProducts = getFilteredProducts(activeCategory)
  const activeTab = categories.find(cat => cat.id === activeCategory)

  return (
    <CategoryNavigationContainer>
      <CategoryTabs>
        {categories.map((category) => (
          <CategoryTab
            key={category.id}
            $isActive={activeCategory === category.id}
            $color={category.color}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="icon">{category.icon}</span>
            <span className="text">{category.name}</span>
          </CategoryTab>
        ))}
      </CategoryTabs>

      {activeTab && (
        <CategoryDescription $color={activeTab.color}>
          <span>{activeTab.description}</span>
        </CategoryDescription>
      )}

      {filteredProducts.length > 0 ? (
        <ProductGrid>
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} passHref>
              <ProductCard $bgGradient={activeTab?.bgGradient || '#FF6B35'}>
                <div>
                  <ProductIcon 
                    className="product-icon"
                    $bgGradient={activeTab?.bgGradient || '#FF6B35'}
                  >
                    {product.icon}
                  </ProductIcon>
                  <ProductTitle>{product.name}</ProductTitle>
                  <ProductDescription>
                    {product.description.length > 80 
                      ? `${product.description.substring(0, 80)}...` 
                      : product.description
                    }
                  </ProductDescription>
                </div>
                <ProductFooter>
                  <PriceSection>
                    <span className="from">ab</span>
                    <span className="price">{formatProductPrice(product)}</span>
                    {product.discount && (
                      <span className="original">{formatOriginalPrice(product)}</span>
                    )}
                  </PriceSection>
                  <ViewButton className="view-button">
                    {activeCategory === 'instagram' ? '💎 Premium wählen' : 
                     activeCategory === 'tiktok' ? '⚡ Viral gehen' : 
                     '🚀 Jetzt kaufen'} →
                  </ViewButton>
                </ProductFooter>
                {product.discount && (
                  <ProductDiscount $color={activeTab?.color || '#FF6B35'}>
                    -{product.discount}%
                  </ProductDiscount>
                )}
              </ProductCard>
            </Link>
          ))}
        </ProductGrid>
      ) : (
        <EmptyState>
          <div className="icon">🔍</div>
          <div className="title">Keine Produkte gefunden</div>
          <div className="description">
            Für diese Kategorie sind aktuell keine Produkte verfügbar.
          </div>
        </EmptyState>
      )}
    </CategoryNavigationContainer>
  )
}

export default CategoryNavigation