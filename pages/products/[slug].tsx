import React, { useState, memo, useMemo, useCallback } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import Layout from '../../components/Layout'
import styled from 'styled-components'
import { Product, getProductBySlug, getAllProductSlugs, products, calculatePrice as calculatePriceWithDiscount, getQuantityDiscount } from '../../data/products'
import { useCart } from '../../lib/CartContext'
import { YouTubeUrlValidator } from '../../lib/urlValidator'
import { formatNumber } from '../../lib/formatUtils'
import SEO from '../../components/SEO'
import { productSEOConfigs, generateStructuredData } from '../../lib/seo'
import { useSmartFeedback } from '../../components/SmartFeedback'
import DynamicButton from '../../components/DynamicButton'

interface ProductPageProps {
  product: Product
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const RightColumn = styled.div``

const Breadcrumb = styled.div`
  color: #6b7280;
  font-size: 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
  letter-spacing: -0.01em;
  
  a {
    color: #6b7280;
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: #374151;
    }
  }
`

const ProductDetailsBox = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 8px;
  }
`

const ProductHeader = styled.div`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f3f4f6;
`

const ProductIconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`

const ProductIcon = styled.div`
  background: #ef4444;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`

const ProductTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.2;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 24px;
    line-height: 1.3;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    line-height: 1.4;
  }
`

const DiscountTag = styled.div`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
  margin-top: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.01em;
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.2);
`

const FeaturesSection = styled.div`
  
`

const FeaturesSectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.01em;
`

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  font-size: 15px;
  color: #4b5563;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.01em;
  
  &:before {
    content: '✓';
    color: #059669;
    font-weight: 700;
    margin-right: 12px;
    margin-top: 3px;
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
    box-shadow: 0 1px 2px rgba(5, 150, 105, 0.1);
  }
`

const PricingSummary = styled.div`
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 15px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #374151;
  font-weight: 500;
  letter-spacing: -0.01em;
  
  &:last-child {
    font-weight: 700;
    font-size: 18px;
    padding-top: 16px;
    border-top: 1px solid #d1d5db;
    margin-top: 16px;
    margin-bottom: 0;
    color: #111827;
  }
`

const SectionTitle = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.01em;
`

const OptionSection = styled.div`
  margin-bottom: 30px;
`

const RadioGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    gap: 10px;
  }
`

const RadioOption = styled.label<{ selected: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
  color: #374151;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
  letter-spacing: -0.01em;
  
  input {
    display: none;
  }
  
  &:before {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid ${props => props.selected ? '#8b5cf6' : '#d1d5db'};
    border-radius: 50%;
    margin-right: 8px;
    background: ${props => props.selected ? '#8b5cf6' : 'white'};
    position: relative;
    transition: all 0.2s ease;
  }
  
  ${props => props.selected && `
    &:after {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      background: white;
      border-radius: 50%;
      left: 5px;
      top: 5px;
    }
  `}
`

const QuantityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 15px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const QuantityButton = styled.button<{ selected: boolean }>`
  padding: 10px 14px;
  border: 1px solid ${props => props.selected ? '#8b5cf6' : '#d1d5db'};
  border-radius: 6px;
  background: ${props => props.selected ? '#8b5cf6' : 'white'};
  color: ${props => props.selected ? 'white' : '#374151'};
  font-size: 14px;
  font-weight: ${props => props.selected ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.01em;
  
  &:hover {
    border-color: #8b5cf6;
    background: ${props => props.selected ? '#8b5cf6' : '#f8fafc'};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`

const SpeedOptions = styled.div`
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`

const SpeedOption = styled.label<{ selected: boolean }>`
  display: block;
  padding: 12px;
  border: 1px solid ${props => props.selected ? '#8b5cf6' : '#e5e7eb'};
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  background: ${props => props.selected ? '#f8fafc' : 'white'};
  position: relative;
  
  @media (max-width: 480px) {
    padding: 10px;
    border-radius: 4px;
  }
  
  input {
    display: none;
  }
  
  &:before {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border: 2px solid ${props => props.selected ? '#8b5cf6' : '#d1d5db'};
    border-radius: 50%;
    background: ${props => props.selected ? '#8b5cf6' : 'white'};
    
    @media (max-width: 480px) {
      right: 10px;
      width: 14px;
      height: 14px;
    }
  }
  
  ${props => props.selected && `
    &:after {
      content: '';
      position: absolute;
      right: 18px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      background: white;
      border-radius: 50%;
      
      @media (max-width: 480px) {
        right: 16px;
        width: 5px;
        height: 5px;
      }
    }
  `}
`

const SpeedOptionText = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.01em;
`

const SpeedOptionPrice = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 400;
  letter-spacing: -0.01em;
`

const VideoInputSection = styled.div`
  margin-bottom: 30px;
`

const VideoInputContainer = styled.div`
  position: relative;
`

const UrlErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '⚠️';
    font-size: 14px;
  }
`

const UrlSuccessMessage = styled.div`
  color: #10b981;
  font-size: 14px;
  margin-top: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '✅';
    font-size: 14px;
  }
`

const VideoInput = styled.input<{ $hasError?: boolean; $isValid?: boolean }>`
  width: 100%;
  padding: 14px 14px 14px 44px;
  border: 1px solid ${props => 
    props.$hasError ? '#ef4444' : 
    props.$isValid ? '#10b981' : '#d1d5db'};
  border-radius: 8px;
  font-size: 16px; /* Increased for iOS zoom prevention */
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 400;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;
  
  @media (max-width: 480px) {
    padding: 12px 12px 12px 40px;
    border-radius: 6px;
  }
  
  &:focus {
    outline: none;
    border-color: ${props => 
      props.$hasError ? '#ef4444' : 
      props.$isValid ? '#10b981' : '#8b5cf6'};
    box-shadow: 0 0 0 3px ${props => 
      props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 
      props.$isValid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(139, 92, 246, 0.1)'};
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #9ca3af;
    
    @media (max-width: 480px) {
      font-size: 14px;
    }
  }
`

const VideoIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #ef4444;
  font-size: 16px;
`

const AddToCartButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  padding: 16px 24px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.01em;
  box-shadow: 0 4px 6px rgba(139, 92, 246, 0.2);
  min-height: 44px;
  
  @media (max-width: 768px) {
    padding: 18px 24px;
    font-size: 17px;
    min-height: 48px;
  }
  
  @media (max-width: 480px) {
    padding: 16px 20px;
    font-size: 16px;
    border-radius: 8px;
    gap: 8px;
  }
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(139, 92, 246, 0.3);
  }
  
  &:active {
    transform: translateY(0px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const RecommendationsSection = styled.div`
  margin-top: 80px;
  padding-top: 60px;
  border-top: 1px solid #e5e7eb;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const ScrollContainer = styled.div`
  position: relative;
  
  @media (min-width: 769px) {
    &:hover .scroll-arrow {
      opacity: 1;
    }
  }
`

const ScrollArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
  opacity: 0;
  z-index: 10;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  &.left {
    left: -24px;
  }
  
  &.right {
    right: -24px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`

const RecommendationsTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 32px;
  text-align: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.02em;
  margin-left: 0;
  margin-right: 0;
  padding-left: 0;
  padding-right: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 24px;
    line-height: 1.3;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 20px;
    line-height: 1.4;
  }
`

const ProductGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 0 24px 0;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    border-radius: 4px;
    transition: background 0.2s ease;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  }
  
  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #8b5cf6 #f1f5f9;
  
  @media (max-width: 768px) {
    gap: 16px;
    padding: 8px 0 16px 0;
    margin: 0 -15px;
    padding-left: 15px;
    padding-right: 15px;
    flex-direction: row;
    align-items: stretch;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    margin: 0 -12px;
    padding-left: 12px;
    padding-right: 12px;
    flex-direction: row;
  }
`

const ProductCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  min-width: 280px;
  max-width: 280px;
  flex-shrink: 0;
  flex-grow: 0;
  white-space: normal;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    border-color: #8b5cf6;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.02) 0%, rgba(139, 92, 246, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    min-width: 240px;
    max-width: 240px;
    padding: 18px;
  }
  
  @media (max-width: 480px) {
    min-width: 220px;
    max-width: 220px;
    padding: 16px;
  }
  
  @media (max-width: 360px) {
    min-width: 200px;
    max-width: 200px;
    padding: 14px;
  }
`

const ProductCardIcon = styled.div`
  font-size: 40px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
`

const ProductCardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.01em;
  position: relative;
  z-index: 1;
  line-height: 1.3;
  
  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  @media (max-width: 360px) {
    font-size: 15px;
    margin-bottom: 8px;
  }
`

const ProductCardDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  z-index: 1;
  overflow-wrap: break-word;
  word-break: break-word;
  
  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 14px;
    line-height: 1.4;
  }
  
  @media (max-width: 360px) {
    font-size: 12px;
    margin-bottom: 12px;
  }
`

const ProductCardPrice = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #8b5cf6;
  margin-bottom: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  z-index: 1;
`

const ProductCardButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.01em;
  position: relative;
  z-index: 1;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
  }
`

const ProductCardDiscount = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  z-index: 2;
`

// Mobile-only recommendations section
const MobileRecommendationsSection = styled.div`
  display: none;
  margin-top: 40px;
  padding: 20px 0;
  border-top: 1px solid #e5e7eb;
  
  @media (max-width: 768px) {
    display: block;
  }
`

const MobileRecommendationsTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.02em;
  padding: 0 15px;
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 16px;
    padding: 0 12px;
  }
`

const MobileProductGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 15px;
  
  @media (max-width: 480px) {
    padding: 0 12px;
    gap: 12px;
  }
`

const MobileProductCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #8b5cf6;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    gap: 12px;
  }
`

const MobileProductIcon = styled.div`
  font-size: 32px;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 8px;
  
  @media (max-width: 480px) {
    font-size: 28px;
    width: 40px;
    height: 40px;
  }
`

const MobileProductContent = styled.div`
  flex: 1;
  min-width: 0;
`

const MobileProductTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.3;
  
  @media (max-width: 480px) {
    font-size: 15px;
  }
`

const MobileProductPrice = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #8b5cf6;
  margin-bottom: 4px;
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`

const MobileProductDescription = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 480px) {
    font-size: 11px;
    -webkit-line-clamp: 1;
  }
`

const MobileProductDiscount = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
`

const SEOContentSection = styled.div`
  margin-top: 60px;
  padding: 40px 0;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 20px;
`

const SEOTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
  text-align: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.02em;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 20px;
    line-height: 1.3;
    padding: 0 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 16px;
    line-height: 1.4;
    padding: 0 12px;
  }
`

const SEODescription = styled.div`
  max-width: 800px;
  margin: 0 auto 40px auto;
  padding: 0 20px;
  
  p {
    font-size: 16px;
    line-height: 1.7;
    color: #4b5563;
    margin-bottom: 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight: 400;
  }
  
  h3 {
    font-size: 22px;
    font-weight: 600;
    color: #111827;
    margin: 32px 0 16px 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    letter-spacing: -0.01em;
  }
  
  ul {
    margin: 16px 0;
    padding-left: 0;
    list-style: none;
    
    li {
      position: relative;
      padding-left: 28px;
      margin-bottom: 12px;
      font-size: 16px;
      line-height: 1.6;
      color: #4b5563;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      
      &:before {
        content: '✓';
        position: absolute;
        left: 0;
        top: 2px;
        color: #059669;
        font-weight: 700;
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        box-shadow: 0 1px 2px rgba(5, 150, 105, 0.1);
      }
    }
  }
`

const FAQSection = styled.div`
  margin-top: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
`

const FAQTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 24px;
  text-align: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.01em;
`

const FAQItem = styled.div`
  background: white;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const FAQQuestion = styled.div`
  padding: 20px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.01em;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:after {
    content: '+';
    font-size: 20px;
    color: #8b5cf6;
    font-weight: 400;
  }
`

const FAQAnswer = styled.div`
  padding: 0 24px 20px 24px;
  font-size: 15px;
  line-height: 1.6;
  color: #4b5563;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const { addItem } = useCart()
  const { showFeedback, isMobile } = useSmartFeedback()
  const [quantity, setQuantity] = useState(product.quantityOptions[0]) // Service quantity (100, 200, etc.)
  const [orderQuantity, setOrderQuantity] = useState(1) // Order multiplier (1, 2, 3, etc.)
  const [speedOption, setSpeedOption] = useState(product.speedOptions[0].id)
  const [targetOption, setTargetOption] = useState(product.targetOptions?.[0]?.id || '')
  const [inputValue, setInputValue] = useState('')
  const [urlError, setUrlError] = useState<string>('')
  const [isUrlValid, setIsUrlValid] = useState(false)
  const [buttonState, setButtonState] = useState<'default' | 'loading' | 'success' | 'error'>('default')
  
  // Memoize scroll functions
  const scrollLeft = useCallback(() => {
    const container = document.getElementById('recommendations-scroll')
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }, [])
  
  const scrollRight = useCallback(() => {
    const container = document.getElementById('recommendations-scroll')
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }, [])

  // Memoize URL validation
  const validateUrl = useCallback((url: string) => {
    if (!url.trim()) {
      setUrlError('')
      setIsUrlValid(false)
      return
    }

    const validation = YouTubeUrlValidator.validateYouTubeUrl(url, product.inputType)
    
    if (validation.isValid) {
      setUrlError('')
      setIsUrlValid(true)
    } else {
      setUrlError(validation.error || 'Ungültige URL')
      setIsUrlValid(false)
    }
  }, [product.inputType])

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    // Debounced validation (validate after user stops typing)
    clearTimeout((window as any).urlValidationTimeout)
    ;(window as any).urlValidationTimeout = setTimeout(() => {
      validateUrl(newValue)
    }, 500)
  }, [validateUrl])

  const handleAddToCart = async () => {
    // Set loading state for mobile
    if (isMobile) {
      setButtonState('loading')
    }

    // Validate URL before adding to cart
    if (!inputValue.trim()) {
      if (isMobile) {
        setButtonState('error')
        setUrlError('Bitte geben Sie eine YouTube-URL ein.')
        setTimeout(() => setButtonState('default'), 2000)
      } else {
        showFeedback('Bitte geben Sie eine YouTube-URL ein.', 'warning')
      }
      return
    }

    const validation = YouTubeUrlValidator.validateYouTubeUrl(inputValue.trim(), product.inputType)
    if (!validation.isValid) {
      if (isMobile) {
        setButtonState('error')
        setUrlError(`Ungültige URL: ${validation.error}`)
        setTimeout(() => setButtonState('default'), 2000)
      } else {
        showFeedback(`Ungültige URL: ${validation.error}`, 'error')
      }
      return
    }

    // Clear any previous errors
    setUrlError('')

    // Calculate final price with selected options
    let basePrice = product.basePrice
    
    // Apply discount if available
    if (product.discount) {
      basePrice = basePrice * (1 - product.discount / 100)
    }
    
    // Add speed option price
    const selectedSpeed = product.speedOptions.find(option => option.id === speedOption)
    if (selectedSpeed) {
      basePrice += selectedSpeed.price
    }
    
    // Add target option price
    if (product.targetOptions && targetOption) {
      const selectedTarget = product.targetOptions.find(option => option.id === targetOption)
      if (selectedTarget) {
        basePrice += selectedTarget.price
      }
    }
    
    // Use the unit price (before order quantity multiplication) for cart item
    const cartSpeedOption = product.speedOptions.find(opt => opt.id === speedOption)
    const cartTargetOption = product.targetOptions?.find(opt => opt.id === targetOption)
    const speedPrice = cartSpeedOption ? cartSpeedOption.price : 0
    const targetPrice = cartTargetOption ? cartTargetOption.price : 0
    
    // Calculate unit price using same logic as pricing display but without order quantity multiplication
    const priceBreakdown = calculatePriceWithDiscount(
      product.basePrice,
      quantity,
      0, // Don't include speed price in discount calculation
      targetPrice
    )
    const unitPrice = priceBreakdown.total + speedPrice
    
    console.log(`[ProductPage] Adding to cart - ${product.name}:`, {
      orderQuantity: orderQuantity,
      serviceQuantity: quantity,
      totalServiceQuantity: quantity * orderQuantity,
      unitPrice: unitPrice,
      displayTotal: parseFloat(prices.total),
      speedOption: speedOption,
      targetOption: targetOption,
      priceBreakdownDetails: {
        basePrice: product.basePrice,
        serviceQuantity: quantity,
        targetPrice: targetPrice,
        speedPrice: speedPrice,
        pricingTotal: priceBreakdown.total
      }
    })
    
    // Get option names for display
    const speedName = product.speedOptions.find(option => option.id === speedOption)?.name || ''
    const targetName = product.targetOptions?.find(option => option.id === targetOption)?.name || ''
    
    addItem({
      productId: product.id,
      quantity: orderQuantity, // Use the order quantity multiplier
      price: unitPrice, // Unit price - will be multiplied by cart with quantity
      selectedOptions: {
        speed: speedName,
        target: targetName,
        url: inputValue.trim(),
        selectedQuantity: quantity * orderQuantity, // Store the total quantity (service qty × order qty)
        baseServiceQuantity: quantity // Store the original service quantity for backend calculation
      }
    })
    
    // Show success feedback
    if (isMobile) {
      setButtonState('success')
      setTimeout(() => setButtonState('default'), 2000)
    } else {
      showFeedback(`✅ Erfolgreich hinzugefügt: ${formatNumber(quantity * orderQuantity)} ${product.name}`, 'success')
    }
  }

  // Memoize expensive price calculations
  const prices = useMemo(() => {
    // Get selected options
    const selectedSpeed = product.speedOptions.find(opt => opt.id === speedOption)
    const selectedTarget = product.targetOptions?.find(opt => opt.id === targetOption)
    
    // Calculate prices - speed pricing should be separate from quantity discounts
    const targetPrice = selectedTarget ? selectedTarget.price : 0
    const speedPrice = selectedSpeed ? selectedSpeed.price : 0
    
    // Apply quantity discount only to base + target price (not speed)
    const priceBreakdown = calculatePriceWithDiscount(
      product.basePrice,
      quantity,
      0, // Don't include speed price in discount calculation
      targetPrice
    )
    
    // Add speed price after discount calculation (speed price is not discounted)
    const subtotalWithSpeed = priceBreakdown.subtotal + speedPrice
    const totalWithSpeed = priceBreakdown.total + speedPrice
    
    // Multiply by order quantity for multiple orders
    const finalSubtotal = subtotalWithSpeed * orderQuantity
    const finalDiscountAmount = priceBreakdown.discountAmount * orderQuantity
    const finalTotal = totalWithSpeed * orderQuantity
    
    return {
      subtotal: finalSubtotal.toFixed(2),
      discount: finalDiscountAmount.toFixed(2),  
      total: finalTotal.toFixed(2),
      discountPercentage: priceBreakdown.discount
    }
  }, [product, quantity, orderQuantity, speedOption, targetOption])

  // Memoize other products calculation for recommendations
  const otherProducts = useMemo(() => 
    products.filter(p => p.id !== product.id).slice(0, 6)
  , [product.id])

  // Generate SEO content based on product type
  const getSEOContent = (product: Product) => {
    const categoryMap = {
      'views': {
        title: `${product.name} - Echte YouTube Views kaufen 2024`,
        content: {
          intro: `Steigern Sie Ihre YouTube-Reichweite mit unserem Premium ${product.name} Service. Wir bieten hochwertige, echte Views von realen Nutzern mit hoher Retention-Rate und schneller Lieferung.`,
          benefits: [
            'Echte Views von aktiven YouTube-Nutzern',
            'Hohe Retention-Rate für bessere Rankings',
            'Schnelle und sichere Lieferung',
            '24/7 Kundenservice und Support',
            'Geld-zurück-Garantie bei Problemen',
            'Keine Bots oder gefälschte Accounts',
            'YouTube-TOS konforme Methoden',
            'Lifetime-Garantie auf alle Views'
          ],
          detailed: `Unser ${product.name} Service ist die perfekte Lösung für Content Creator, Unternehmen und Influencer, die ihre YouTube-Präsenz organisch ausbauen möchten. Mit jahrelanger Erfahrung im Social Media Marketing bieten wir ausschließlich hochwertige Views von echten, aktiven Nutzern.`,
          whyChoose: 'Warum YouShark für YouTube Views wählen?',
          reasons: [
            'Über 50.000 zufriedene Kunden weltweit',
            'Sichere Zahlungsmethoden und Datenschutz',
            'Sofortiger Start nach Bestellung',
            'Transparente Preisgestaltung ohne versteckte Kosten',
            'Professioneller Support in deutscher Sprache'
          ]
        },
        faqs: [
          {
            question: 'Sind die YouTube Views echt?',
            answer: 'Ja, alle unsere Views stammen von echten, aktiven YouTube-Nutzern. Wir verwenden keine Bots oder automatisierte Software.'
          },
          {
            question: 'Wie schnell erhalte ich die Views?',
            answer: 'Die Lieferung beginnt normalerweise innerhalb von 1-6 Stunden nach Bestellung. Die vollständige Lieferung erfolgt je nach gewählter Geschwindigkeit.'
          },
          {
            question: 'Ist der Service sicher für meinen Kanal?',
            answer: 'Absolut sicher. Unsere Methoden sind vollständig YouTube-TOS konform und bergen kein Risiko für Ihren Kanal.'
          },
          {
            question: 'Gibt es eine Garantie?',
            answer: 'Ja, wir bieten eine Lifetime-Garantie. Falls Views verschwinden sollten, ersetzen wir diese kostenfrei.'
          }
        ]
      },
      'likes': {
        title: `${product.name} - Echte YouTube Likes kaufen 2024`,
        content: {
          intro: `Erhöhen Sie das Engagement Ihrer YouTube-Videos mit unserem Premium ${product.name} Service. Echte Likes von realen Nutzern steigern Ihre Glaubwürdigkeit und Reichweite nachhaltig.`,
          benefits: [
            'Echte Likes von aktiven YouTube-Nutzern',
            'Sofortiger Start der Lieferung',
            'Hohe Qualität und Sicherheit',
            'Keine Risiken für Ihren Kanal',
            '24/7 Premium-Support',
            'Geld-zurück-Garantie',
            'Lifetime-Nachfüllgarantie',
            'YouTube-TOS konforme Methoden'
          ],
          detailed: `YouTube Likes sind ein wichtiger Rankingfaktor und zeigen anderen Nutzern, dass Ihr Content wertvoll ist. Unser ${product.name} Service hilft Ihnen dabei, mehr organisches Engagement zu erhalten und Ihre Videos in den Suchergebnissen besser zu positionieren.`,
          whyChoose: 'Warum YouShark für YouTube Likes?',
          reasons: [
            'Premium-Qualität seit über 5 Jahren',
            'Diskrete und sichere Lieferung',
            'Faire Preise ohne Abofallen',
            'Deutscher Kundenservice',
            'SSL-verschlüsselte Bestellabwicklung'
          ]
        },
        faqs: [
          {
            question: 'Wie funktioniert der Like-Service?',
            answer: 'Nach Ihrer Bestellung werden echte YouTube-Nutzer Ihr Video organisch liken. Der Prozess ist vollautomatisch und sicher.'
          },
          {
            question: 'Kann ich Likes für mehrere Videos kaufen?',
            answer: 'Ja, Sie können für jedes Video separate Bestellungen aufgeben oder uns für Mengenrabatte kontaktieren.'
          },
          {
            question: 'Verschwinden die Likes wieder?',
            answer: 'Nein, unsere Likes sind permanent. Falls doch einmal Likes verschwinden sollten, ersetzen wir diese kostenlos.'
          },
          {
            question: 'Ist der Service diskret?',
            answer: 'Ja, die Likes werden natürlich über einen längeren Zeitraum verteilt, sodass es völlig organisch aussieht.'
          }
        ]
      },
      'subscribers': {
        title: `${product.name} - Echte YouTube Abonnenten kaufen 2024`,
        content: {
          intro: `Wachsen Sie Ihren YouTube-Kanal mit unserem Premium ${product.name} Service. Echte, aktive Abonnenten von realen Nutzern für nachhaltiges Kanalwachstum.`,
          benefits: [
            'Echte Abonnenten von aktiven Accounts',
            'Permanente Abonnenten mit Garantie',
            'Langsame, natürliche Lieferung',
            'Kein Risiko für Ihren Kanal',
            'Professioneller 24/7 Support',
            'Geld-zurück-Garantie',
            'Lifetime-Nachfüllservice',
            'Vollständig YouTube-konform'
          ],
          detailed: `Abonnenten sind das Fundament eines erfolgreichen YouTube-Kanals. Unser ${product.name} Service bringt Ihnen echte, engagierte Abonnenten, die Ihren Content auch langfristig unterstützen und Ihre Reichweite organisch steigern.`,
          whyChoose: 'Warum YouShark für YouTube Abonnenten?',
          reasons: [
            'Höchste Qualitätsstandards in der Branche',
            'Natürliches Wachstum ohne Auffälligkeiten',
            'Transparente und faire Preisgestaltung',
            'Kompetenter deutschsprachiger Support',
            'Über 10 Jahre Erfahrung im Social Media Marketing'
          ]
        },
        faqs: [
          {
            question: 'Sind die Abonnenten echt und aktiv?',
            answer: 'Ja, alle Abonnenten stammen von echten, aktiven YouTube-Accounts. Wir arbeiten nicht mit Bots oder inaktiven Profilen.'
          },
          {
            question: 'Wie lange dauert die Lieferung?',
            answer: 'Die Abonnenten werden langsam und natürlich über mehrere Tage/Wochen verteilt, um ein organisches Wachstum zu simulieren.'
          },
          {
            question: 'Bleiben die Abonnenten dauerhaft?',
            answer: 'Ja, unsere Abonnenten sind permanent. Falls einige deabonnieren sollten, füllen wir diese mit unserer Garantie nach.'
          },
          {
            question: 'Ist mein Kanal sicher?',
            answer: 'Absolut. Unsere Methoden entsprechen vollständig den YouTube-Richtlinien und bergen kein Risiko für Ihren Kanal.'
          }
        ]
      }
    }
    
    return categoryMap[product.category] || categoryMap['views']
  }

  const seoContent = getSEOContent(product)

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": seoContent.content.intro,
    "brand": {
      "@type": "Brand",
      "name": "YouShark"
    },
    "category": `YouTube ${product.category}`,
    "offers": {
      "@type": "Offer",
      "url": `https://youshark.de/products/${product.slug}`,
      "priceCurrency": "EUR",
      "price": product.basePrice * 1000,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "YouShark"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "2500"
    }
  }

  // Generate SEO configuration for this product
  const productSEO = useMemo(() => {
    const seoConfig = productSEOConfigs[product.slug as keyof typeof productSEOConfigs] || {
      title: `${product.name} kaufen - ${product.description} | YouShark`,
      description: `Kaufe ${product.name} für deinen YouTube Kanal. ${product.description} Sichere Lieferung, günstige Preise und 24/7 Support.`,
      keywords: [
        `${product.name} kaufen`,
        `YouTube ${product.category} kaufen`,
        `Echte ${product.category}`,
        'YouTube Marketing',
        'Social Media Marketing'
      ]
    }

    return {
      ...seoConfig,
      url: `https://youshark.de/products/${product.slug}`,
      image: '/images/youshark-og-image.jpg',
      type: 'product' as const,
      canonical: `https://youshark.de/products/${product.slug}`
    }
  }, [product.slug, product.name, product.description, product.category])

  // Generate structured data for this product
  const productStructuredData = useMemo(() => {
    return generateStructuredData('product', {
      name: product.name,
      description: product.description,
      price: product.basePrice
    })
  }, [product.name, product.description, product.basePrice])

  return (
    <>
      <SEO 
        {...productSEO}
        structuredData={productStructuredData}
      />
      <Layout noSEO>
      <Container>
        <LeftColumn>
          <Breadcrumb>
            <a href="/">← YouTube</a> / Views
          </Breadcrumb>

          <ProductDetailsBox>
            <ProductHeader>
              <ProductIconRow>
                <ProductIcon>▶</ProductIcon>
                <ProductTitle>{product.name}</ProductTitle>
              </ProductIconRow>
              {product.discount && (
                <DiscountTag>-{product.discount}%</DiscountTag>
              )}
            </ProductHeader>

            <FeaturesSection>
              <FeaturesSectionTitle>Produktmerkmale</FeaturesSectionTitle>
              <FeaturesList>
                {product.features.map((feature, index) => (
                  <FeatureItem key={index}>{feature}</FeatureItem>
                ))}
              </FeaturesList>
            </FeaturesSection>

            <PricingSummary>
              <PriceRow>
                <span>Zwischensumme</span>
                <span>{prices.subtotal} €</span>
              </PriceRow>
              {prices.discountPercentage > 0 && (
                <PriceRow>
                  <span>Mengenrabatt ({prices.discountPercentage}%)</span>
                  <span style={{color: '#FF6B35'}}>-{prices.discount} €</span>
                </PriceRow>
              )}
              <PriceRow>
                <span><strong>Gesamtsumme</strong></span>
                <span><strong>{prices.total} €</strong></span>
              </PriceRow>
              {prices.discountPercentage > 0 && (
                <div style={{fontSize: '14px', color: '#16a34a', textAlign: 'center', marginTop: '8px'}}>
                  🎉 Du sparst {prices.discount} € durch Mengenrabatt!
                </div>
              )}
            </PricingSummary>
          </ProductDetailsBox>
        </LeftColumn>

        <RightColumn>
          {product.targetOptions && (
            <OptionSection>
              <SectionTitle>Wähle aus:</SectionTitle>
              <RadioGroup>
                {product.targetOptions.map(option => (
                  <RadioOption 
                    key={option.id}
                    selected={targetOption === option.id}
                    onClick={() => setTargetOption(option.id)}
                  >
                    <input 
                      type="radio" 
                      name="target"
                      checked={targetOption === option.id}
                      onChange={() => setTargetOption(option.id)}
                    />
                    {option.name}
                  </RadioOption>
                ))}
              </RadioGroup>
            </OptionSection>
          )}

          <OptionSection>
            <SectionTitle>Wähle aus: Anzahl der Views</SectionTitle>
            <QuantityGrid>
              {product.quantityOptions.slice(0, 8).map(option => {
                const discount = getQuantityDiscount(option)
                return (
                  <QuantityButton
                    key={option}
                    selected={quantity === option}
                    onClick={() => setQuantity(option)}
                    style={{ position: 'relative' }}
                  >
                    {option === 0 ? 'Keine' : formatNumber(option)}
                    {discount > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#16a34a',
                        color: 'white',
                        fontSize: '10px',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        -{discount}%
                      </div>
                    )}
                  </QuantityButton>
                )
              })}
            </QuantityGrid>
            <QuantityGrid>
              {product.quantityOptions.slice(8).map(option => {
                const discount = getQuantityDiscount(option)
                return (
                  <QuantityButton
                    key={option}
                    selected={quantity === option}
                    onClick={() => setQuantity(option)}
                    style={{ position: 'relative' }}
                  >
                    {formatNumber(option)}
                    {discount > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#16a34a',
                        color: 'white',
                        fontSize: '10px',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        -{discount}%
                      </div>
                    )}
                  </QuantityButton>
                )
              })}
            </QuantityGrid>
          </OptionSection>

          <OptionSection>
            <SectionTitle>Anzahl</SectionTitle>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              justifyContent: 'center'
            }}>
              <button 
                onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                disabled={orderQuantity <= 1}
                style={{
                  background: '#f7fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: orderQuantity <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#4a5568',
                  minHeight: '44px', // Better touch target
                  touchAction: 'manipulation'
                }}
              >
                -
              </button>
              <span style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#2d3748',
                minWidth: '50px',
                textAlign: 'center',
                padding: '0 8px'
              }}>
                {orderQuantity}
              </span>
              <button 
                onClick={() => setOrderQuantity(orderQuantity + 1)}
                style={{
                  background: '#f7fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#4a5568',
                  minHeight: '44px', // Better touch target
                  touchAction: 'manipulation'
                }}
              >
                +
              </button>
            </div>
          </OptionSection>

          {product.speedOptions.length > 1 && (
            <OptionSection>
              <SectionTitle>Wähle deine Geschwindigkeit *</SectionTitle>
              <SpeedOptions>
                {product.speedOptions.map(option => (
                  <SpeedOption 
                    key={option.id}
                    selected={speedOption === option.id}
                    onClick={() => setSpeedOption(option.id)}
                  >
                    <input 
                      type="radio" 
                      name="speed"
                      checked={speedOption === option.id}
                      onChange={() => setSpeedOption(option.id)}
                    />
                    <SpeedOptionText>
                      {option.name} {option.price > 0 && `(+${option.price.toFixed(2)} €)`}
                    </SpeedOptionText>
                    {option.description && (
                      <SpeedOptionPrice>{option.description}</SpeedOptionPrice>
                    )}
                  </SpeedOption>
                ))}
              </SpeedOptions>
            </OptionSection>
          )}

          <VideoInputSection>
            <SectionTitle>
              {product.inputType === 'video' ? 'Youtube Videolink:' : 'Youtube Channellink:'} *
            </SectionTitle>
            <VideoInputContainer>
              <VideoIcon>📺</VideoIcon>
              <VideoInput
                type="url"
                value={inputValue}
                onChange={handleUrlChange}
                placeholder={product.inputPlaceholder}
                $hasError={!!urlError}
                $isValid={isUrlValid}
              />
            </VideoInputContainer>
            {urlError && (
              <UrlErrorMessage>{urlError}</UrlErrorMessage>
            )}
            {isUrlValid && !urlError && inputValue.trim() && (
              <UrlSuccessMessage>Gültige YouTube-URL erkannt</UrlSuccessMessage>
            )}
          </VideoInputSection>

          <DynamicButton
            state={buttonState}
            onClick={handleAddToCart}
            disabled={!inputValue.trim() || !isUrlValid || !!urlError}
          />
        </RightColumn>
      </Container>

      <RecommendationsSection>
        <Container>
          <RecommendationsTitle>Das kaufen Kunden auch</RecommendationsTitle>
          <ScrollContainer>
            <ScrollArrow className="scroll-arrow left" onClick={scrollLeft}>
              ←
            </ScrollArrow>
            <ScrollArrow className="scroll-arrow right" onClick={scrollRight}>
              →
            </ScrollArrow>
            <ProductGrid id="recommendations-scroll">
              {otherProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.slug}`} passHref>
                  <ProductCard>
                    {relatedProduct.discount && (
                      <ProductCardDiscount>-{relatedProduct.discount}%</ProductCardDiscount>
                    )}
                    <ProductCardIcon>{relatedProduct.icon}</ProductCardIcon>
                    <ProductCardTitle>{relatedProduct.name}</ProductCardTitle>
                    <ProductCardDescription>
                      {relatedProduct.description.length > 100 
                        ? `${relatedProduct.description.substring(0, 100)}...`
                        : relatedProduct.description
                      }
                    </ProductCardDescription>
                    <ProductCardPrice>
                      ab {relatedProduct.discount 
                        ? (relatedProduct.basePrice * (1 - relatedProduct.discount / 100) * 1000).toFixed(2)
                        : (relatedProduct.basePrice * 1000).toFixed(2)
                      }€
                    </ProductCardPrice>
                    <ProductCardButton>Jetzt kaufen</ProductCardButton>
                  </ProductCard>
                </Link>
              ))}
            </ProductGrid>
          </ScrollContainer>
        </Container>
      </RecommendationsSection>

      {/* Mobile-only recommendations section */}
      <MobileRecommendationsSection>
        <Container>
          <MobileRecommendationsTitle>Das kaufen Kunden auch</MobileRecommendationsTitle>
          <MobileProductGrid>
            {otherProducts.slice(0, 3).map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/products/${relatedProduct.slug}`} passHref>
                <MobileProductCard>
                  {relatedProduct.discount && (
                    <MobileProductDiscount>-{relatedProduct.discount}%</MobileProductDiscount>
                  )}
                  <MobileProductIcon>{relatedProduct.icon}</MobileProductIcon>
                  <MobileProductContent>
                    <MobileProductTitle>{relatedProduct.name}</MobileProductTitle>
                    <MobileProductPrice>
                      ab {relatedProduct.discount 
                        ? (relatedProduct.basePrice * (1 - relatedProduct.discount / 100) * 1000).toFixed(2)
                        : (relatedProduct.basePrice * 1000).toFixed(2)
                      }€
                    </MobileProductPrice>
                    <MobileProductDescription>
                      {relatedProduct.description.length > 80 
                        ? `${relatedProduct.description.substring(0, 80)}...`
                        : relatedProduct.description
                      }
                    </MobileProductDescription>
                  </MobileProductContent>
                </MobileProductCard>
              </Link>
            ))}
          </MobileProductGrid>
        </Container>
      </MobileRecommendationsSection>

      <SEOContentSection>
        <Container>
          <SEOTitle>{seoContent.title}</SEOTitle>
          <SEODescription>
            <p>{seoContent.content.intro}</p>
            
            <h3>Was Sie bei YouShark erhalten:</h3>
            <ul>
              {seoContent.content.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
            
            <p>{seoContent.content.detailed}</p>
            
            <h3>{seoContent.content.whyChoose}</h3>
            <ul>
              {seoContent.content.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
            
            <p>
              Bestellen Sie noch heute Ihren {product.name} Service und erleben Sie den Unterschied, den echte, hochwertige {product.category} für Ihren YouTube-Erfolg machen können. Mit YouShark investieren Sie in nachhaltiges Wachstum und professionelle Qualität.
            </p>
          </SEODescription>
          
          <FAQSection>
            <FAQTitle>Häufig gestellte Fragen</FAQTitle>
            {seoContent.faqs.map((faq, index) => (
              <FAQItem key={index}>
                <FAQQuestion>{faq.question}</FAQQuestion>
                <FAQAnswer>{faq.answer}</FAQAnswer>
              </FAQItem>
            ))}
          </FAQSection>
        </Container>
      </SEOContentSection>
      </Layout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllProductSlugs()
  const paths = slugs.map((slug) => ({
    params: { slug }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      product
    }
  }
}

export default ProductPage