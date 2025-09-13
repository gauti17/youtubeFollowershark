import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import styled from 'styled-components'
import { products } from '../data/products'
import { formatPrice, formatNumber } from '../lib/formatUtils'
import { pageSEOConfigs, generateStructuredData } from '../lib/seo'
import CategoryNavigation from '../components/CategoryNavigation'

const HeroSection = styled.section`
  padding: 20px 16px 80px 16px;
  min-height: 90vh;
  text-align: center;
  color: #1a1a1a;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 30%, #e2e8f0 70%, #cbd5e1 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (min-width: 640px) {
    padding: 40px 24px 100px 24px;
  }

  @media (min-width: 1024px) {
    padding: 60px 40px 140px 40px;
    min-height: 85vh;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.2" fill="%23FF6B35" opacity="0.08"/></pattern></defs><rect width="200" height="200" fill="url(%23dots)"/></svg>');
    pointer-events: none;
    opacity: 0.6;
  }

  &::after {
    content: '';
    position: absolute;
    top: 15%;
    right: -15%;
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(255, 142, 107, 0.08), rgba(139, 69, 255, 0.05));
    border-radius: 50%;
    filter: blur(100px);
    animation: float 8s ease-in-out infinite;
    z-index: 0;
  }

  @media (max-width: 640px) {
    &::after {
      width: 250px;
      height: 250px;
      right: -25%;
      top: 10%;
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
    33% { transform: translateY(-15px) scale(1.05) rotate(2deg); }
    66% { transform: translateY(-25px) scale(1.1) rotate(-2deg); }
  }
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TrustRating = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;

  @media (min-width: 640px) {
    gap: 24px;
    margin-bottom: 50px;
  }

  @media (min-width: 1024px) {
    gap: 30px;
    margin-bottom: 60px;
  }
`

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 20px;
  border-radius: 50px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 107, 53, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  font-size: 14px;

  @media (min-width: 640px) {
    gap: 10px;
    padding: 12px 24px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    gap: 12px;
    padding: 14px 28px;
    font-size: 16px;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 30px rgba(255, 107, 53, 0.15);
    border-color: rgba(255, 107, 53, 0.2);
  }
`

const RatingScore = styled.span`
  font-weight: 600;
  color: #1a1a1a;
`

const Stars = styled.span`
  color: #FFD700;
  filter: drop-shadow(0 1px 2px rgba(255, 215, 0, 0.3));
`

const ReviewCount = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 20px;
  border-radius: 50px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 107, 53, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  color: #4a5568;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;

  @media (min-width: 640px) {
    padding: 12px 24px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    padding: 14px 28px;
    font-size: 16px;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 30px rgba(255, 107, 53, 0.15);
    border-color: rgba(255, 107, 53, 0.2);
  }
`

const HeroContent = styled.div`
  margin-bottom: 50px;
  position: relative;
  z-index: 1;

  @media (min-width: 640px) {
    margin-bottom: 60px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 80px;
  }
`

const HeroSubtitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #FF6B35;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
  position: relative;
  z-index: 1;

  @media (min-width: 640px) {
    font-size: 16px;
    margin-bottom: 20px;
  }

  @media (min-width: 1024px) {
    font-size: 18px;
    margin-bottom: 24px;
  }
`

const HeroTitle = styled.h1`
  font-size: clamp(1.75rem, 8vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  letter-spacing: -0.02em;
  word-spacing: 0.04em;
  text-align: center;
  padding: 0 8px;

  @media (min-width: 640px) {
    margin-bottom: 32px;
    max-width: 600px;
    padding: 0 16px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 40px;
    max-width: 900px;
    padding: 0;
  }
  
  .primary-text {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .accent-text {
    background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #FF6B35, #FF8E6B);
      border-radius: 2px;
      opacity: 0.7;
    }
  }

  @media (max-width: 768px) {
    letter-spacing: 0.015em;
    word-spacing: 0.06em;
  }
`

const HighlightCircle = styled.span`
  color: #8B45FF;
  font-weight: 700;
  letter-spacing: 0.025em;
`

const HeroDescription = styled.p`
  font-size: 16px;
  margin-bottom: 32px;
  color: #4a5568;
  font-weight: 400;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  letter-spacing: 0.01em;
  position: relative;
  z-index: 1;
  padding: 0 8px;
  
  strong {
    color: #2d3748;
    font-weight: 600;
  }

  @media (min-width: 640px) {
    font-size: 18px;
    max-width: 600px;
    margin-bottom: 40px;
    padding: 0 16px;
  }

  @media (min-width: 1024px) {
    font-size: 20px;
    max-width: 800px;
    margin-bottom: 50px;
    line-height: 1.7;
    padding: 0;
  }
`

const CTASection = styled.div`
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  @media (min-width: 640px) {
    margin-bottom: 50px;
    gap: 20px;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: center;
    margin-bottom: 60px;
    gap: 24px;
  }
`

const PrimaryCTA = styled.span`
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
  color: white;
  padding: 16px 32px;
  border-radius: 50px;
  border: none;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
  justify-content: center;

  @media (min-width: 640px) {
    padding: 18px 40px;
    font-size: 18px;
    min-width: 220px;
  }

  @media (min-width: 1024px) {
    padding: 20px 45px;
    min-width: 240px;
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #FF8E6B 0%, #FFB199 100%);
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 30px rgba(255, 107, 53, 0.4);
    
    &::before {
      opacity: 1;
    }
  }
  
  span {
    position: relative;
    z-index: 1;
  }
`

const SecondaryCTA = styled.a`
  background: rgba(255, 255, 255, 0.9);
  color: #4a5568;
  padding: 16px 32px;
  border-radius: 50px;
  border: 2px solid rgba(255, 107, 53, 0.2);
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.02em;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
  justify-content: center;
  backdrop-filter: blur(10px);

  @media (min-width: 640px) {
    padding: 18px 40px;
    font-size: 18px;
    min-width: 220px;
  }

  @media (min-width: 1024px) {
    padding: 20px 45px;
    min-width: 240px;
  }

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 107, 53, 0.05);
    border-color: rgba(255, 107, 53, 0.4);
    color: #FF6B35;
    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.15);
  }
`

const HeroStats = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;

  @media (min-width: 640px) {
    gap: 24px;
    margin-top: 50px;
  }

  @media (min-width: 1024px) {
    gap: 32px;
    margin-top: 60px;
  }
`

const StatItem = styled.div`
  text-align: center;
  animation: fadeInUp 0.6s ease-out;
`

const StatNumber = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 4px;
  font-family: 'Inter', sans-serif;

  @media (min-width: 640px) {
    font-size: 24px;
  }

  @media (min-width: 1024px) {
    font-size: 28px;
  }
`

const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (min-width: 640px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }
`

const StatDivider = styled.div`
  color: #d1d5db;
  font-size: 16px;
  margin: 0 4px;

  @media (max-width: 640px) {
    display: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #FF8E6B 0%, #FFB199 100%);
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: inherit;
    border-radius: inherit;
    filter: blur(20px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 15px 40px rgba(255, 107, 53, 0.4);
    
    &::before {
      opacity: 1;
    }
    
    &::after {
      opacity: 0.6;
    }
  }
  
  span {
    position: relative;
    z-index: 1;
  }
`

const SectionDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 60px 0 50px 0;
  gap: 20px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin: 40px 0 30px 0;
  }
`

const DividerLine = styled.div`
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%);

  @media (max-width: 768px) {
    width: 50px;
  }
`

const DividerText = styled.span`
  color: #4a5568;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.9);
  padding: 0 15px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
`


const ViewAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  margin: 40px auto;
  position: relative;
  z-index: 1;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 107, 53, 0.4);
  }
`

const ViewAllContainer = styled.div`
  text-align: center;
  margin: 40px 0 60px 0;
  position: relative;
  z-index: 1;
`

const PaymentMethods = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
  margin-top: 40px;

  @media (min-width: 640px) {
    gap: 16px;
  }

  @media (min-width: 1024px) {
    gap: 20px;
  }
`

const PaymentCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 8px 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.05), rgba(255, 142, 107, 0.02));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: rgba(255, 107, 53, 0.2);
    
    &::before {
      opacity: 1;
    }
    
    img {
      filter: none;
      transform: scale(1.1);
    }
  }

  img {
    height: 28px;
    transition: all 0.3s ease;
    filter: grayscale(30%) brightness(0.9);
    position: relative;
    z-index: 1;
  }

  @media (min-width: 640px) {
    padding: 10px 20px;
    border-radius: 16px;
    
    img {
      height: 32px;
    }
  }

  @media (min-width: 1024px) {
    padding: 12px 24px;
    
    img {
      height: 36px;
    }
  }
`

// How It Works Section
const HowItWorksSection = styled.section`
  padding: 80px 0;
  background: white;
`

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.02em;
`

const SectionSubtitle = styled.p`
  font-size: 18px;
  text-align: center;
  color: #4a5568;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
`

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`

const StepCard = styled.div`
  text-align: center;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border-color: rgba(255, 107, 53, 0.2);
  }

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

  &:hover::before {
    opacity: 1;
  }
`

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  margin: 0 auto 20px auto;
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
  position: relative;
  z-index: 1;
`

const StepTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`

const StepDescription = styled.p`
  font-size: 16px;
  color: #4a5568;
  line-height: 1.6;
  position: relative;
  z-index: 1;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`

// Testimonials Section
const TestimonialsSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 25px;
  }
`

const TestimonialCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }

  &::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 20px;
    font-size: 60px;
    color: #FF6B35;
    font-family: Georgia, serif;
    opacity: 0.3;
  }
`

const TestimonialText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #2d3748;
  margin-bottom: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-style: italic;
`

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
`

const AuthorInfo = styled.div``

const AuthorName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`

const AuthorChannel = styled.div`
  font-size: 13px;
  color: #718096;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`

const TestimonialStars = styled.div`
  margin-left: auto;
  color: #FFD700;
  font-size: 16px;
`

// Trust Section
const TrustSection = styled.section`
  padding: 60px 0;
  background: white;
  text-align: center;
`

const TrustBadges = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 20px;
  }
`

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`

const TrustIcon = styled.div`
  font-size: 24px;
`

const TrustText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`


// Features Section
const FeaturesSection = styled.section`
  padding: 80px 0;
  background: white;
`

const FeaturesSectionTitle = styled.h2`
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`

const FeaturesSectionSubtitle = styled.p`
  font-size: 20px;
  text-align: center;
  color: #4a5568;
  margin-bottom: 60px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 25px;
  }
`

const FeatureCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$bgColor'
})<{ $bgColor: string }>`
  background: ${props => props.$bgColor};
  border-radius: 24px;
  padding: 40px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(30px, -30px);
  }
`

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
`

const FeatureTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  z-index: 1;
`

const FeatureDescription = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  z-index: 1;
`

const FeatureDetails = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  z-index: 1;
  
  strong {
    color: white;
    font-weight: 600;
  }
`

// FAQ Accordion Component
const FAQAccordion: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index)
  }

  const faqData = [
    {
      question: 'Ist der Kauf von YouTube Views sicher?',
      answer: '<strong>Ja, absolut sicher!</strong> Wir verwenden nur echte Accounts und organische Methoden. Ihre Kanäle sind zu 100% geschützt und wir halten uns an alle YouTube-Richtlinien. Tausende zufriedene Kunden vertrauen bereits auf unsere sicheren Services.'
    },
    {
      question: 'Wie schnell werden die Views/Likes geliefert?',
      answer: 'Wir starten die Lieferung <strong>sofort nach Zahlungseingang</strong>. Je nach Service und Menge:<br/>• Views: 10.000-100.000 pro Tag<br/>• Likes: Bis zu 5.000 pro Tag<br/>• Abonnenten: 200-500 pro Tag<br/>Die Lieferung erfolgt natürlich und gleichmäßig verteilt.'
    },
    {
      question: 'Was ist der Unterschied zwischen internationalen und deutschen Views?',
      answer: '<strong>Internationale Views:</strong> Günstiger, weltweit gemischt, ideal für allgemeine Reichweite<br/><strong>Deutsche Views:</strong> 100% aus Deutschland, höhere Retention, perfekt für deutsche Zielgruppen und lokale Unternehmen. Deutsche Views haben eine höhere Wiedergabedauer und bessere Interaktionsraten.'
    },
    {
      question: 'Gibt es eine Geld-zurück-Garantie?',
      answer: '<strong>Ja, 100% Geld-zurück-Garantie!</strong> Falls Sie nicht zufrieden sind oder wir nicht liefern können, erstatten wir Ihnen den vollen Betrag zurück. Kontaktieren Sie einfach unseren 24/7 Support - wir lösen jedes Problem schnell und unkompliziert.'
    },
    {
      question: 'Sind die Abonnenten und Likes permanent?',
      answer: '<strong>Ja, alle Interaktionen sind dauerhaft!</strong> Wir arbeiten nur mit echten, aktiven Accounts. Sollten dennoch Abonnenten oder Likes verloren gehen (sehr selten), bieten wir eine <strong>Lifetime-Nachfüllgarantie</strong> - wir füllen kostenlos nach.'
    },
    {
      question: 'Welche Zahlungsmethoden akzeptieren Sie?',
      answer: 'Wir akzeptieren alle gängigen Zahlungsmethoden:<br/>• PayPal (sofort)<br/>• Kreditkarten (Visa, Mastercard)<br/>• Apple Pay & Google Pay<br/>• Sofortüberweisung & Klarna<br/>Alle Zahlungen sind SSL-verschlüsselt und 100% sicher.'
    }
  ]

  return (
    <>
      {faqData.map((item, index) => (
        <FAQItem key={index}>
          <FAQQuestion 
            $isOpen={openItem === index}
            onClick={() => toggleItem(index)}
          >
            <span>{item.question}</span>
            <span className="icon">+</span>
          </FAQQuestion>
          <FAQAnswer $isOpen={openItem === index}>
            <div 
              className="content" 
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </FAQAnswer>
        </FAQItem>
      ))}
    </>
  )
}

// FAQ Section
const FAQSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
`

const FAQItem = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`

const FAQQuestion = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$isOpen'
})<{ $isOpen: boolean }>`
  padding: 24px 30px;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.$isOpen ? '#FF6B35' : '#1a1a1a'};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  &:hover {
    color: #FF6B35;
  }
  
  .icon {
    font-size: 20px;
    transition: transform 0.3s ease;
    color: #FF6B35;
    font-weight: 300;
    transform: ${props => props.$isOpen ? 'rotate(45deg)' : 'rotate(0deg)'};
  }
`

const FAQAnswer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$isOpen'
})<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '300px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  .content {
    padding: ${props => props.$isOpen ? '0 30px 24px' : '0 30px 0'};
    font-size: 16px;
    line-height: 1.6;
    color: #4a5568;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transition: padding 0.3s ease;
    
    strong {
      color: #2d3748;
      font-weight: 600;
    }
  }
`

const HomePage: React.FC = () => {
  
  
  // Generate structured data for homepage
  const websiteStructuredData = generateStructuredData('website', {})

  return (
    <>
      <SEO
        {...pageSEOConfigs.home}
        structuredData={websiteStructuredData}
      />
      <Layout noSEO>
      <HeroSection>
        <Container>
          <TrustRating>
            <Rating>
              <RatingScore>4,46 auf</RatingScore>
              <Stars>⭐⭐⭐⭐⭐</Stars>
            </Rating>
            <ReviewCount>150+ Bewertungen 👥</ReviewCount>
          </TrustRating>

          <HeroContent>
            <HeroSubtitle>
              🚀 Der #1 Social Media Growth Service in Deutschland
            </HeroSubtitle>
            
            <HeroTitle>
              <span className="primary-text">Werde zum</span><br />
              <span className="accent-text">Social Media Star</span><br className="hidden sm:block" />
              <span className="primary-text"> auf </span><span className="accent-text">YouTube, TikTok & Instagram!</span>
            </HeroTitle>
            
            <HeroDescription>
              <strong>Millionen von Views, Likes und Followern</strong> warten auf dich! Verwandle deine Social Media Präsenz in eine<br className="hidden sm:block" />
              <strong>Erfolgsgeschichte</strong> - mit echten Ergebnissen, die deinen Content viral gehen lassen. <strong>Starte heute!</strong>
            </HeroDescription>

            <CTASection>
              <Link href="/shop">
                <PrimaryCTA>
                  <span>🔥 Viral gehen - Jetzt starten!</span>
                </PrimaryCTA>
              </Link>
              <SecondaryCTA href="#how-it-works">
                <span>⚡ Wie es funktioniert</span>
              </SecondaryCTA>
            </CTASection>
            
            <HeroStats>
              <StatItem>
                <StatNumber>50K+</StatNumber>
                <StatLabel>Zufriedene Kunden</StatLabel>
              </StatItem>
              <StatDivider>•</StatDivider>
              <StatItem>
                <StatNumber>1M+</StatNumber>
                <StatLabel>Views vermittelt</StatLabel>
              </StatItem>
              <StatDivider>•</StatDivider>
              <StatItem>
                <StatNumber>24/7</StatNumber>
                <StatLabel>Support</StatLabel>
              </StatItem>
            </HeroStats>
          </HeroContent>

          <SectionDivider>
            <DividerLine />
            <DividerText>🔥 Unsere Top Services</DividerText>
            <DividerLine />
          </SectionDivider>
          
          {/* Category Navigation Component */}
          <CategoryNavigation />

          <ViewAllContainer>
            <ViewAllButton href="/shop">
              <span>🛍️</span>
              Alle Services anzeigen
            </ViewAllButton>
          </ViewAllContainer>

        </Container>
      </HeroSection>

      {/* How It Works Section */}
      <HowItWorksSection id="how-it-works">
        <Container>
          <SectionTitle>So funktioniert es</SectionTitle>
          <SectionSubtitle>
            In nur 3 einfachen Schritten zu mehr YouTube, TikTok & Instagram Erfolg. Schnell, sicher und garantiert viral.
          </SectionSubtitle>
          
          <StepsGrid>
            <StepCard>
              <StepNumber>1</StepNumber>
              <StepTitle>Service wählen</StepTitle>
              <StepDescription>
                Wählen Sie den gewünschten Service: YouTube Views/Likes/Abonnenten oder TikTok Views/Likes/Shares/Kommentare - alles in Premium-Qualität.
              </StepDescription>
            </StepCard>
            
            <StepCard>
              <StepNumber>2</StepNumber>
              <StepTitle>Bestellen & Bezahlen</StepTitle>
              <StepDescription>
                Geben Sie Ihre YouTube- oder TikTok-URL ein, wählen Sie die gewünschte Menge und bezahlen Sie sicher mit PayPal oder anderen Methoden.
              </StepDescription>
            </StepCard>
            
            <StepCard>
              <StepNumber>3</StepNumber>
              <StepTitle>Ergebnisse erhalten</StepTitle>
              <StepDescription>
                Lehnen Sie sich zurück! Wir starten sofort mit der Lieferung. Echte, hochwertige Interaktionen von realen Nutzern - garantiert sicher.
              </StepDescription>
            </StepCard>
          </StepsGrid>
          
          <TrustBadges>
            <TrustBadge>
              <TrustIcon>🔒</TrustIcon>
              <TrustText>100% Sicher</TrustText>
            </TrustBadge>
            <TrustBadge>
              <TrustIcon>⚡</TrustIcon>
              <TrustText>Sofortstart</TrustText>
            </TrustBadge>
            <TrustBadge>
              <TrustIcon>👥</TrustIcon>
              <TrustText>Echte Nutzer</TrustText>
            </TrustBadge>
            <TrustBadge>
              <TrustIcon>💎</TrustIcon>
              <TrustText>Premium Qualität</TrustText>
            </TrustBadge>
            <TrustBadge>
              <TrustIcon>🛡️</TrustIcon>
              <TrustText>Geld-zurück-Garantie</TrustText>
            </TrustBadge>
          </TrustBadges>
        </Container>
      </HowItWorksSection>

      {/* Testimonials Section */}
      <TestimonialsSection>
        <Container>
          <SectionTitle>Was unsere Kunden sagen</SectionTitle>
          <SectionSubtitle>
            Über 50.000 zufriedene Creator vertrauen bereits auf youshark. Lesen Sie echte Bewertungen.
          </SectionSubtitle>
          
          <TestimonialsGrid>
            <TestimonialCard>
              <TestimonialText>
                youshark hat meinen Kanal komplett verändert! Die Views kommen schnell und sehen absolut natürlich aus. Meine Videos ranken jetzt viel besser und ich bekomme mehr organische Zuschauer.
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>MK</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>Markus K.</AuthorName>
                  <AuthorChannel>Gaming Channel • 45K Abonnenten</AuthorChannel>
                </AuthorInfo>
                <TestimonialStars>⭐⭐⭐⭐⭐</TestimonialStars>
              </TestimonialAuthor>
            </TestimonialCard>
            
            <TestimonialCard>
              <TestimonialText>
                Ich war skeptisch, aber youshark hat mich überzeugt. Professioneller Service, schnelle Lieferung und wirklich echte Likes. Kann ich nur weiterempfehlen!
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>JS</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>Julia S.</AuthorName>
                  <AuthorChannel>Beauty & Lifestyle • 28K Abonnenten</AuthorChannel>
                </AuthorInfo>
                <TestimonialStars>⭐⭐⭐⭐⭐</TestimonialStars>
              </TestimonialAuthor>
            </TestimonialCard>
            
            <TestimonialCard>
              <TestimonialText>
                Als Unternehmen brauchen wir Zuverlässigkeit. youshark liefert konstant hochwertige Ergebnisse und der Support ist erstklassig. Absolute Empfehlung!
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>TW</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>Thomas W.</AuthorName>
                  <AuthorChannel>Business Channel • 120K Abonnenten</AuthorChannel>
                </AuthorInfo>
                <TestimonialStars>⭐⭐⭐⭐⭐</TestimonialStars>
              </TestimonialAuthor>
            </TestimonialCard>
            
            <TestimonialCard>
              <TestimonialText>
                Endlich ein Service, der hält was er verspricht! Die deutschen Views haben meinem lokalen Business-Kanal enormen Aufschwung gegeben. Danke youshark!
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>AM</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>Anna M.</AuthorName>
                  <AuthorChannel>Food & Rezepte • 32K Abonnenten</AuthorChannel>
                </AuthorInfo>
                <TestimonialStars>⭐⭐⭐⭐⭐</TestimonialStars>
              </TestimonialAuthor>
            </TestimonialCard>
            
            <TestimonialCard>
              <TestimonialText>
                Ich nutze youshark seit über einem Jahr für verschiedene Projekte. Die Qualität ist immer top und der Service super zuverlässig. Klare 5 Sterne!
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>DL</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>David L.</AuthorName>
                  <AuthorChannel>Tech Reviews • 89K Abonnenten</AuthorChannel>
                </AuthorInfo>
                <TestimonialStars>⭐⭐⭐⭐⭐</TestimonialStars>
              </TestimonialAuthor>
            </TestimonialCard>
            
            <TestimonialCard>
              <TestimonialText>
                youshark hat mir geholfen, meine Musik einem größeren Publikum zu präsentieren. Die Abonnenten bleiben und interagieren wirklich mit meinen Videos!
              </TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>LK</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>Lisa K.</AuthorName>
                  <AuthorChannel>Musik & Cover • 67K Abonnenten</AuthorChannel>
                </AuthorInfo>
                <TestimonialStars>⭐⭐⭐⭐⭐</TestimonialStars>
              </TestimonialAuthor>
            </TestimonialCard>
          </TestimonialsGrid>
        </Container>
      </TestimonialsSection>

      {/* FAQ Section */}
      <FAQSection>
        <Container>
          <SectionTitle>Häufig gestellte Fragen</SectionTitle>
          <SectionSubtitle>
            Alle wichtigen Antworten zu unseren Social Media Growth Services für YouTube, TikTok & Instagram. Haben Sie weitere Fragen? Kontaktieren Sie unseren 24/7 Support!
          </SectionSubtitle>
          
          <FAQGrid>
            <FAQAccordion />
          </FAQGrid>
        </Container>
      </FAQSection>
      
      {/* Features Section */}
      <FeaturesSection>
        <Container>
          <FeaturesSectionTitle>
            Social Media Growth - seriös,<br />
            schnell & erfolgreich!
          </FeaturesSectionTitle>
          <FeaturesSectionSubtitle>
            Warum sich täglich über 1000 Content Creator für youshark entscheiden und unseren blitzschnellen,
            zuverlässigen Premium-Service für YouTube & TikTok nutzen.
          </FeaturesSectionSubtitle>
          
          <FeaturesGrid>
            <FeatureCard $bgColor="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
              <FeatureIcon>⚡</FeatureIcon>
              <FeatureTitle>Schnelle Vermittlung</FeatureTitle>
              <FeatureDescription>
                Bei youshark ist der Kauf von YouTube & TikTok Services blitzschnell und kinderleicht. Das ist der Hauptgrund, 
                warum sich täglich über 1000 Content Creator uns anvertrauen und unseren Premium-Service 
                für explosives Social Media Wachstum nutzen.
              </FeatureDescription>
              <FeatureDetails>
                Nach der Bestellung starten wir sofort mit der 
                Lieferung von Views, Likes, Shares, Kommentaren & Followern, 
                sodass dein Content innerhalb weniger 
                Minuten viral geht!
              </FeatureDetails>
            </FeatureCard>
            
            <FeatureCard $bgColor="linear-gradient(135deg, #a855f7 0%, #9333ea 100%)">
              <FeatureIcon>🚀</FeatureIcon>
              <FeatureTitle>Kompetenter Live-Support</FeatureTitle>
              <FeatureDescription>
                Die Zusammenarbeit mit youshark bedeutet, mit Social Media Experten zu arbeiten, die wissen wie Viral-Marketing funktioniert. 
                Solltest du Fragen, Bedenken oder ein Anliegen haben, stehen wir dir 24/7 zur 
                Verfügung.
              </FeatureDescription>
              <FeatureDetails>
                <strong>Wir sind live für dich da</strong> und unterstützen dich 
                mit Experten-Beratung für maximalen Erfolg auf 
                YouTube, TikTok und anderen Social Media Plattformen.
              </FeatureDetails>
            </FeatureCard>
            
            <FeatureCard $bgColor="linear-gradient(135deg, #FF6B35 0%, #FF8E6B 100%)">
              <FeatureIcon>🏆</FeatureIcon>
              <FeatureTitle>Services von höchster Qualität</FeatureTitle>
              <FeatureDescription>
                Oft wird vor Social Media Growth Services gewarnt, weil der Markt von billigen Anbietern 
                überflutet ist, die minderwertige Fake-Accounts liefern und deinen Content gefährden können.
              </FeatureDescription>
              <FeatureDetails>
                <strong>Bei youshark ist das anders:</strong> Wir setzen auf Premium-Qualität 
                statt Billig-Services. Alle unsere YouTube & TikTok 
                Services werden streng auf Echtheit und 
                Qualität geprüft.
                <br/><br/>
                <strong>Nur echte Accounts mit Profilbildern:</strong> Keine Bots, 
                keine Fake-Profile - nur authentische Nutzer, 
                die deinen Content wirklich viral gehen lassen!
              </FeatureDetails>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </FeaturesSection>
      
      {/* Trust Section */}
      <TrustSection>
        <Container>
          <SectionTitle>Vertrauen Sie dem Marktführer</SectionTitle>
          <TrustBadges>
            <TrustBadge>
              <TrustIcon>🏆</TrustIcon>
              <TrustText>5 Jahre Erfahrung</TrustText>
            </TrustBadge>
            <TrustBadge>
              <TrustIcon>👥</TrustIcon>
              <TrustText>50.000+ Kunden</TrustText>
            </TrustBadge>
            <TrustBadge>
              <TrustIcon>⭐</TrustIcon>
              <TrustText>4.8/5 Bewertung</TrustText>
            </TrustBadge>
            <TrustBadge>
              <TrustIcon>🔄</TrustIcon>
              <TrustText>Geld-zurück-Garantie</TrustText>
            </TrustBadge>
            <TrustBadge>
              <TrustIcon>📞</TrustIcon>
              <TrustText>24/7 Support</TrustText>
            </TrustBadge>
          </TrustBadges>
        </Container>
      </TrustSection>
      </Layout>
    </>
  )
}

export default HomePage