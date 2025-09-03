import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { products, Product } from '../data/products'
import { formatPrice } from '../lib/formatUtils'

const ShopContainer = styled.div`
  min-height: 90vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 40px 0 80px 0;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`

const ShopHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`

const ShopTitle = styled.h1`
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
  font-family: 'FF DIN', 'DIN 1451', 'DIN Alternate', 'Franklin Gothic Medium', sans-serif;
  
  .accent {
    background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`

const ShopSubtitle = styled.p`
  font-size: 20px;
  color: #4a5568;
  font-family: 'Inter', sans-serif;
  max-width: 600px;
  margin: 0 auto 40px auto;
  line-height: 1.6;
`

const FilterSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 50px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 15px;
  }
`

const FilterButton = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  border: 2px solid ${props => props.active ? '#FF6B35' : '#e2e8f0'};
  background: ${props => props.active ? 'linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    border-color: #FF6B35;
    background: ${props => props.active ? 'linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%)' : 'rgba(255, 107, 53, 0.1)'};
    color: ${props => props.active ? 'white' : '#FF6B35'};
    transform: translateY(-2px);
  }
`

const SearchBar = styled.div`
  max-width: 400px;
  margin: 0 auto 40px auto;
  position: relative;
  
  input {
    width: 100%;
    padding: 16px 50px 16px 20px;
    border: 2px solid #e2e8f0;
    border-radius: 50px;
    font-size: 16px;
    font-family: 'Inter', sans-serif;
    background: white;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #FF6B35;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }
    
    &::placeholder {
      color: #9ca3af;
    }
  }
  
  .search-icon {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    font-size: 18px;
  }
`

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 25px;
  }
`

const ProductCard = styled(Link)`
  display: block;
  background: white;
  border-radius: 20px;
  padding: 30px;
  text-decoration: none;
  color: inherit;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.02) 0%, rgba(255, 107, 53, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 107, 53, 0.3);
    
    &::before {
      opacity: 1;
    }
    
    .product-icon {
      transform: scale(1.1) rotate(5deg);
    }
    
    .cta-button {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
      color: white;
      transform: translateY(-2px);
    }
  }
`

const ProductHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`

const ProductIcon = styled.div`
  font-size: 48px;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`

const ProductDiscount = styled.div`
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`

const ProductTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
  font-family: 'Inter', sans-serif;
  position: relative;
  z-index: 1;
`

const ProductDescription = styled.p`
  font-size: 16px;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
  position: relative;
  z-index: 1;
`

const ProductFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 25px;
  position: relative;
  z-index: 1;
  
  li {
    font-size: 14px;
    color: #718096;
    margin-bottom: 8px;
    padding-left: 20px;
    position: relative;
    font-family: 'Inter', sans-serif;
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #48bb78;
      font-weight: bold;
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`

const ProductPricing = styled.div`
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  
  .price {
    font-size: 20px;
    font-weight: 700;
    color: #FF6B35;
    font-family: 'Inter', sans-serif;
    
    .from {
      font-size: 14px;
      font-weight: 500;
      color: #718096;
      margin-right: 4px;
    }
  }
  
  .original-price {
    font-size: 16px;
    color: #9ca3af;
    text-decoration: line-through;
    margin-left: 8px;
    font-family: 'Inter', sans-serif;
  }
`

const CTAButton = styled.div`
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #4a5568;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  position: relative;
  z-index: 1;
`

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  padding: 60px 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
`

const StatItem = styled.div`
  .number {
    font-size: 36px;
    font-weight: 700;
    color: #FF6B35;
    margin-bottom: 8px;
    font-family: 'Inter', sans-serif;
  }
  
  .label {
    font-size: 16px;
    color: #4a5568;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
  }
`

const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  
  .icon {
    font-size: 64px;
    margin-bottom: 24px;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 24px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 12px;
    font-family: 'Inter', sans-serif;
  }
  
  p {
    font-size: 16px;
    color: #718096;
    font-family: 'Inter', sans-serif;
  }
`

const ShopPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', name: 'Alle Services' },
    { id: 'views', name: 'Views' },
    { id: 'likes', name: 'Likes' },
    { id: 'subscribers', name: 'Abonnenten' }
  ]

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (activeFilter !== 'all') {
      filtered = filtered.filter(product => product.category === activeFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [activeFilter, searchTerm])

  const formatPriceDisplay = (price: number) => {
    return formatPrice(price)
  }

  const calculateDiscountedPrice = (basePrice: number, discount?: number) => {
    if (!discount) return basePrice
    return basePrice * (1 - discount / 100)
  }

  return (
    <Layout 
      title="Shop - youshark YouTube Growth Services" 
      description="Entdecken Sie alle YouTube Growth Services von youshark. Views, Likes, Abonnenten und mehr - alles für Ihren YouTube-Erfolg!"
      keywords="youtube services, youtube growth, buy youtube views, buy youtube likes, buy youtube subscribers, german youtube views"
    >
      <ShopContainer>
        <Container>
          <ShopHeader>
            <ShopTitle>
              YouTube Growth <span className="accent">Services</span>
            </ShopTitle>
            <ShopSubtitle>
              Entdecken Sie alle Premium Services für explosives YouTube-Wachstum. 
              Von Views bis Abonnenten - alles für Ihren Erfolg!
            </ShopSubtitle>
          </ShopHeader>

          <SearchBar>
            <input
              type="text"
              placeholder="Services durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </SearchBar>

          <FilterSection>
            {categories.map(category => (
              <FilterButton
                key={category.id}
                active={activeFilter === category.id}
                onClick={() => setActiveFilter(category.id)}
              >
                {category.name}
              </FilterButton>
            ))}
          </FilterSection>

          {filteredProducts.length === 0 ? (
            <NoResults>
              <div className="icon">🔍</div>
              <h3>Keine Services gefunden</h3>
              <p>Versuchen Sie andere Suchbegriffe oder wählen Sie eine andere Kategorie.</p>
            </NoResults>
          ) : (
            <>
              <ProductsGrid>
                {filteredProducts.map(product => {
                  const discountedPrice = calculateDiscountedPrice(product.basePrice, product.discount)
                  
                  return (
                    <ProductCard key={product.id} href={`/products/${product.slug}`}>
                      <ProductHeader>
                        <ProductIcon className="product-icon">{product.icon}</ProductIcon>
                        {product.discount && (
                          <ProductDiscount>-{product.discount}%</ProductDiscount>
                        )}
                      </ProductHeader>

                      <ProductTitle>{product.name}</ProductTitle>
                      <ProductDescription>{product.description}</ProductDescription>

                      <ProductFeatures>
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ProductFeatures>

                      <ProductPricing>
                        <div className="price">
                          <span className="from">ab</span>
                          {formatPriceDisplay(discountedPrice)}
                          {product.discount && (
                            <span className="original-price">
                              {formatPriceDisplay(product.basePrice)}
                            </span>
                          )}
                        </div>
                      </ProductPricing>

                      <CTAButton className="cta-button">
                        Service ansehen →
                      </CTAButton>
                    </ProductCard>
                  )
                })}
              </ProductsGrid>

              <StatsSection>
                <StatItem>
                  <div className="number">50.000+</div>
                  <div className="label">Zufriedene Kunden</div>
                </StatItem>
                <StatItem>
                  <div className="number">5 Jahre</div>
                  <div className="label">Erfahrung</div>
                </StatItem>
                <StatItem>
                  <div className="number">24/7</div>
                  <div className="label">Support</div>
                </StatItem>
                <StatItem>
                  <div className="number">4.8★</div>
                  <div className="label">Bewertung</div>
                </StatItem>
              </StatsSection>
            </>
          )}
        </Container>
      </ShopContainer>
    </Layout>
  )
}

export default ShopPage