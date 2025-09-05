import React from 'react'
import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'
import styled from 'styled-components'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  keywords?: string
  noSEO?: boolean
}

const MainContainer = styled.main`
  min-height: calc(100vh - 140px);
`

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'YouTube Growth Services', 
  description = 'Professional YouTube growth services including likes, views, German views, and subscribers to boost your channel organically.',
  keywords = 'youtube, growth, marketing, likes, views, subscribers, german views, watchtime',
  noSEO = false
}) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'youshark'
  
  return (
    <>
      {!noSEO && (
        <Head>
          <title>{title} - {appName}</title>
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="index, follow" />
          <meta name="author" content={appName} />
          
          {/* Open Graph Meta Tags */}
          <meta property="og:title" content={`${title} - ${appName}`} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL} />
          <meta property="og:site_name" content={appName} />
          
          {/* Twitter Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${title} - ${appName}`} />
          <meta name="twitter:description" content={description} />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          
          {/* Canonical URL */}
          <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL} />
        </Head>
      )}
      
      <Header />
      <MainContainer>{children}</MainContainer>
      <Footer />
    </>
  )
}

export default Layout