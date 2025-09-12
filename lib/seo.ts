/**
 * SEO utilities for YouShark
 */

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'product' | 'article'
  noIndex?: boolean
  canonical?: string
}

export const defaultSEO = {
  title: 'YouShark - Social Media Growth für YouTube & TikTok | Views, Likes, Followers',
  description: '🚀 Werde zum Social Media Star! YouTube & TikTok Services für echte Views, Likes, Shares & Followers. Premium-Qualität ✓ Schnelle Lieferung ✓ 24/7 Support ✓',
  keywords: [
    'Social Media Growth',
    'YouTube Views kaufen',
    'TikTok Views kaufen',
    'YouTube Likes kaufen', 
    'TikTok Likes kaufen',
    'YouTube Abonnenten kaufen',
    'TikTok Followers kaufen',
    'TikTok Shares kaufen',
    'TikTok Kommentare kaufen',
    'Social Media Marketing',
    'YouTube Marketing',
    'TikTok Marketing',
    'Viral gehen',
    'Content Creator Services',
    'Influencer Marketing',
    'Deutsche YouTube Views',
    'YouTube & TikTok Promotion',
    'Echte Follower',
    'Social Media Wachstum'
  ],
  image: '/images/youshark-og-image.jpg',
  url: 'https://youshark.de',
  type: 'website' as const
}

export const generateSEOTags = (props: SEOProps = {}) => {
  const seo = { ...defaultSEO, ...props }
  
  const title = seo.title
  const description = seo.description
  const keywords = seo.keywords?.join(', ')
  const image = seo.image
  const url = seo.url
  const type = seo.type

  return {
    title,
    meta: [
      // Basic meta tags
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      
      // Robots
      { 
        name: 'robots', 
        content: seo.noIndex ? 'noindex,nofollow' : 'index,follow' 
      },
      
      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'YouShark' },
      { property: 'og:locale', content: 'de_DE' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      
      // Additional SEO
      { name: 'theme-color', content: '#FF6B35' },
      { name: 'msapplication-TileColor', content: '#FF6B35' },
    ],
    link: [
      // Canonical URL
      { rel: 'canonical', href: seo.canonical || url },
    ]
  }
}

// Product-specific SEO configurations
export const productSEOConfigs = {
  'youtube-views': {
    title: 'YouTube Views kaufen - Echte Aufrufe für deine Videos | YouShark',
    description: 'Kaufe echte YouTube Views und steigere die Reichweite deiner Videos. Sichere Lieferung, günstige Preise und 24/7 Support. Jetzt bestellen!',
    keywords: [
      'YouTube Views kaufen',
      'YouTube Aufrufe kaufen',
      'Echte YouTube Views',
      'YouTube Marketing',
      'Video Reichweite erhöhen',
      'YouTube Promotion',
      'Views günstig kaufen'
    ]
  },
  'youtube-likes': {
    title: 'YouTube Likes kaufen - Mehr Daumen hoch für deine Videos | YouShark',
    description: 'Kaufe echte YouTube Likes und verbessere das Engagement deiner Videos. Schnelle Lieferung, sichere Bezahlung und Top-Qualität.',
    keywords: [
      'YouTube Likes kaufen',
      'YouTube Daumen hoch kaufen',
      'Video Likes kaufen',
      'YouTube Engagement erhöhen',
      'Echte YouTube Likes',
      'YouTube Marketing'
    ]
  },
  'youtube-subscribers': {
    title: 'YouTube Abonnenten kaufen - Echte Follower für deinen Kanal | YouShark',
    description: 'Kaufe echte YouTube Abonnenten und baue deine Community auf. Organisches Wachstum, sichere Lieferung und dauerhafte Ergebnisse.',
    keywords: [
      'YouTube Abonnenten kaufen',
      'YouTube Follower kaufen',
      'Kanal Abonnenten erhöhen',
      'YouTube Community aufbauen',
      'Echte Abonnenten kaufen',
      'YouTube Wachstum'
    ]
  },
  'deutsche-youtube-views': {
    title: 'Deutsche YouTube Views kaufen - Lokale Reichweite erhöhen | YouShark',
    description: 'Kaufe deutsche YouTube Views für lokale Reichweite. Zielgruppenspezifische Aufrufe aus Deutschland für bessere Performance.',
    keywords: [
      'Deutsche YouTube Views kaufen',
      'YouTube Views Deutschland',
      'Lokale YouTube Views',
      'Deutsche Aufrufe kaufen',
      'YouTube Marketing Deutschland',
      'Regionale YouTube Promotion'
    ]
  }
}

// Page-specific SEO configurations
export const pageSEOConfigs = {
  home: {
    title: 'YouShark - #1 Social Media Growth für YouTube & TikTok | Viral gehen!',
    description: '🚀 Werde zum Social Media Star! YouTube & TikTok Growth Services: Views, Likes, Shares, Followers & mehr. Premium-Qualität ✓ Viral-Garantie ✓ 24/7 Support ✓',
    keywords: [
      'Social Media Growth',
      'YouTube Views kaufen',
      'TikTok Views kaufen',
      'YouTube Likes kaufen',
      'TikTok Likes kaufen',
      'TikTok Shares kaufen',
      'YouTube Abonnenten kaufen',
      'TikTok Followers kaufen',
      'Social Media Marketing',
      'Viral gehen',
      'Content Creator',
      'Influencer Services',
      'YouShark'
    ]
  },
  shop: {
    title: 'Shop - Social Media Growth Services für YouTube & TikTok | YouShark',
    description: 'Entdecke alle Premium Social Media Services von YouShark. YouTube & TikTok Views, Likes, Shares, Followers und mehr für viralen Erfolg.',
    keywords: [
      'Social Media Services kaufen',
      'YouTube & TikTok Services',
      'Social Media Growth Shop',
      'YouTube TikTok Marketing',
      'Viral Marketing Services'
    ]
  },
  about: {
    title: 'Über YouShark - Dein Partner für YouTube Erfolg',
    description: 'Erfahre mehr über YouShark, Deutschlands vertrauenswürdigste Plattform für YouTube Marketing. Seit Jahren helfen wir Creators beim Wachstum.',
    keywords: [
      'YouShark',
      'YouTube Marketing Experten',
      'Über uns',
      'YouTube Wachstum',
      'Social Media Marketing'
    ]
  },
  faq: {
    title: 'Häufig gestellte Fragen - YouShark FAQ',
    description: 'Finde Antworten auf häufig gestellte Fragen zu unseren YouTube Marketing Services. Alles über Views, Likes, Abonnenten und mehr.',
    keywords: [
      'YouShark FAQ',
      'YouTube Marketing Fragen',
      'Hilfe',
      'Support',
      'Antworten'
    ]
  }
}

// Schema.org structured data
export const generateStructuredData = (type: 'website' | 'product' | 'organization', data: any) => {
  const baseStructure = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'website':
      return {
        ...baseStructure,
        '@type': 'WebSite',
        name: 'YouShark',
        url: 'https://youshark.de',
        description: defaultSEO.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://youshark.de/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }

    case 'organization':
      return {
        ...baseStructure,
        '@type': 'Organization',
        name: 'YouShark',
        url: 'https://youshark.de',
        logo: 'https://youshark.de/images/logo.png',
        description: 'Deutschlands führende Plattform für YouTube Marketing Services',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          availableLanguage: 'German'
        },
        sameAs: [
          'https://www.facebook.com/youshark',
          'https://www.instagram.com/youshark',
          'https://www.twitter.com/youshark'
        ]
      }

    case 'product':
      return {
        ...baseStructure,
        '@type': 'Product',
        name: data.name,
        description: data.description,
        brand: {
          '@type': 'Brand',
          name: 'YouShark'
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: data.price,
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'YouShark'
          }
        }
      }

    default:
      return baseStructure
  }
}