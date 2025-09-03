import React from 'react'
import Head from 'next/head'
import { generateSEOTags, generateStructuredData, SEOProps } from '../lib/seo'

interface SEOComponentProps extends SEOProps {
  structuredData?: any
  children?: React.ReactNode
}

const SEO: React.FC<SEOComponentProps> = ({ 
  structuredData,
  children,
  ...seoProps 
}) => {
  const seoTags = generateSEOTags(seoProps)

  return (
    <Head>
      {/* Title */}
      <title>{seoTags.title}</title>

      {/* Meta tags */}
      {seoTags.meta.map((meta, index) => {
        if ('name' in meta) {
          return (
            <meta
              key={`meta-name-${index}`}
              name={meta.name}
              content={meta.content}
            />
          )
        } else if ('property' in meta) {
          return (
            <meta
              key={`meta-property-${index}`}
              property={meta.property}
              content={meta.content}
            />
          )
        }
        return null
      })}

      {/* Link tags */}
      {seoTags.link.map((link, index) => (
        <link
          key={`link-${index}`}
          rel={link.rel}
          href={link.href}
        />
      ))}

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}

      {/* Additional custom tags */}
      {children}
    </Head>
  )
}

export default SEO