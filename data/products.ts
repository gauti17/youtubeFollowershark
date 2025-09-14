export interface Product {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  features: string[]
  basePrice: number
  discount?: number
  speedOptions: SpeedOption[]
  quantityOptions: number[]
  inputType: 'video' | 'channel' | 'tiktok' | 'tiktok-profile' | 'instagram' | 'instagram-profile'
  inputPlaceholder: string
  category: 'views' | 'likes' | 'subscribers' | 'tiktok-views' | 'tiktok-likes' | 'tiktok-shares' | 'tiktok-followers' | 'instagram-followers' | 'instagram-likes' | 'instagram-views' | 'instagram-comments'
  targetOptions?: TargetOption[]
}

export interface SpeedOption {
  id: string
  name: string
  price: number
  description?: string
}

export interface TargetOption {
  id: string
  name: string
  price: number
}

// Quantity-based discount calculation
export const getQuantityDiscount = (quantity: number): number => {
  if (quantity >= 20000) return 40; // Max discount ceiling
  if (quantity >= 10000) return 30;
  if (quantity >= 5000) return 20;
  if (quantity >= 2500) return 10;
  return 0;
}


export const calculatePrice = (
  basePrice: number, 
  quantity: number, 
  speedPrice: number = 0, 
  targetPrice: number = 0
): { 
  subtotal: number; 
  discount: number; 
  discountAmount: number; 
  total: number; 
} => {
  // Calculate subtotal for discountable items (base + target price only)
  const discountableSubtotal = (basePrice + targetPrice) * quantity;
  const discount = getQuantityDiscount(quantity);
  const discountAmount = (discountableSubtotal * discount) / 100;
  const discountedSubtotal = discountableSubtotal - discountAmount;
  
  // Add speed price after discount (speed price is not discounted)
  const subtotal = discountableSubtotal + speedPrice;
  const total = discountedSubtotal + speedPrice;
  
  return {
    subtotal,
    discount,
    discountAmount,
    total
  };
}

export const products: Product[] = [
  {
    id: 'youtube-views',
    name: 'YouTube Views',
    slug: 'youtube-views',
    icon: '▶️',
    description: 'Kaufe hochwertige YouTube Views mit hoher Retention. Schnelle Lieferung, sichere Abwicklung und 24/7 Support.',
    features: [
      'Es kommt zu Verzögerungen',
      'Internationale Aufrufe',
      'Geschwindigkeit: Int. Views 100.000/ Tag'
    ],
    basePrice: 0.01,
    discount: 10,
    speedOptions: [
      {
        id: 'standard',
        name: 'Standard',
        price: 0,
        description: 'Normale Liefergeschwindigkeit'
      },
      {
        id: 'delayed',
        name: 'Verzögert',
        price: 7.99,
        description: 'Langsamere, natürlichere Lieferung'
      }
    ],
    quantityOptions: [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000],
    inputType: 'video',
    inputPlaceholder: 'https://www.youtube.com/watch?v=... oder /shorts/...',
    category: 'views',
    targetOptions: [
      {
        id: 'international',
        name: 'Internationale',
        price: 0
      },
      {
        id: 'deutsche',
        name: 'Deutsche',
        price: 0.02
      }
    ]
  },
  {
    id: 'youtube-likes',
    name: 'YouTube Likes',
    slug: 'youtube-likes',
    icon: '👍',
    description: 'Kaufe echte YouTube Likes von aktiven Nutzern. Schnelle Lieferung, sichere Abwicklung und 24/7 Support.',
    features: [
      'Echte, aktive Nutzer',
      'Sichere Lieferung',
      'Geschwindigkeit: 5.000 Likes/Tag',
      'Lifetime Garantie'
    ],
    basePrice: 0.02,
    speedOptions: [
      {
        id: 'standard',
        name: 'Standard',
        price: 0
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 4.99
      }
    ],
    quantityOptions: [50, 100, 250, 500, 1000, 2500, 5000, 10000],
    inputType: 'video',
    inputPlaceholder: 'https://www.youtube.com/watch?v=... oder /shorts/...',
    category: 'likes'
  },
  {
    id: 'youtube-subscribers',
    name: 'YouTube Abonnenten',
    slug: 'youtube-subscribers',
    icon: '👥',
    description: 'Kaufe echte YouTube Abonnenten von aktiven Nutzern. Permanente Abonnenten mit Lifetime-Garantie.',
    features: [
      'Echte, aktive Nutzer',
      'Permanente Abonnenten',
      'Geschwindigkeit: 500 Abonnenten/Tag',
      'Lifetime Garantie'
    ],
    basePrice: 0.075,
    discount: 10,
    speedOptions: [
      {
        id: 'standard',
        name: 'Standard',
        price: 0
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 9.99
      }
    ],
    quantityOptions: [25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
    inputType: 'channel',
    inputPlaceholder: 'https://www.youtube.com/@dein-kanal',
    category: 'subscribers'
  },
  {
    id: 'deutsche-youtube-views',
    name: 'Deutsche YouTube Views',
    slug: 'deutsche-youtube-views',
    icon: '🇩🇪',
    description: 'Kaufe deutsche YouTube Views für gezieltes deutschsprachiges Publikum. 100% deutscher Traffic mit hoher Retention.',
    features: [
      '100% deutscher Traffic',
      'Hohe Wiedergabedauer',
      'Geschwindigkeit: 10.000 Views/Tag',
      'Geo-targeted Lieferung'
    ],
    basePrice: 0.025, // 50% reduced from original 0.05 for quantities 250, 500, 1000
    discount: 50,
    speedOptions: [
      {
        id: 'standard',
        name: 'Standard',
        price: 0,
        description: 'Normale Liefergeschwindigkeit'
      },
      {
        id: 'delayed',
        name: 'Verzögert',
        price: 12.99,
        description: 'Langsamere, natürlichere Lieferung'
      }
    ],
    quantityOptions: [250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000],
    inputType: 'video',
    inputPlaceholder: 'https://www.youtube.com/watch?v=... oder /shorts/...',
    category: 'views'
  },
  {
    id: 'tiktok-views',
    name: 'TikTok Views',
    slug: 'tiktok-views',
    icon: '📱',
    description: 'Steigere deine TikTok Reichweite mit echten Views von aktiven Nutzern. Hohe Retention-Rate und algorithmussichere Lieferung.',
    features: [
      'Echte Views von aktiven TikTok-Nutzern',
      'Hohe Retention-Rate für bessere Rankings',
      'Algorithmussichere Lieferung',
      'Geschwindigkeit: 50.000 Views/Tag',
      'Lifetime Garantie',
      'Sofortiger Start der Lieferung'
    ],
    basePrice: 0.015,
    discount: 15,
    speedOptions: [
      {
        id: 'standard',
        name: 'Standard',
        price: 0,
        description: 'Normale Liefergeschwindigkeit'
      },
      {
        id: 'delayed',
        name: 'Verzögert',
        price: 9.99,
        description: 'Langsamere, natürlichere Lieferung'
      }
    ],
    quantityOptions: [100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000],
    inputType: 'tiktok',
    inputPlaceholder: 'https://www.tiktok.com/@username/video/...',
    category: 'tiktok-views'
  },
  {
    id: 'tiktok-likes',
    name: 'TikTok Likes',
    slug: 'tiktok-likes',
    icon: '❤️',
    description: 'Erhöhe das Engagement deiner TikTok Videos mit echten Likes von aktiven Nutzern. Mehr Likes = Mehr Reichweite.',
    features: [
      'Echte Likes von aktiven TikTok-Accounts',
      'Organisches Engagement für bessere Rankings',
      'Sofortiger Algorithmus-Boost',
      'Geschwindigkeit: 10.000 Likes/Tag',
      'Lifetime Garantie',
      '24/7 Support'
    ],
    basePrice: 0.025,
    discount: 10,
    speedOptions: [
      {
        id: 'standard',
        name: 'Standard',
        price: 0,
        description: 'Normale Liefergeschwindigkeit'
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 5.99,
        description: 'Schnellere Lieferung mit Premium-Accounts'
      }
    ],
    quantityOptions: [25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
    inputType: 'tiktok',
    inputPlaceholder: 'https://www.tiktok.com/@username/video/...',
    category: 'tiktok-likes'
  },
  {
    id: 'tiktok-shares',
    name: 'TikTok Shares',
    slug: 'tiktok-shares',
    icon: '🔄',
    description: 'Maximiere deine virale Reichweite mit echten TikTok Shares. Der beste Weg für exponentielles Wachstum.',
    features: [
      'Echter viraler Traffic und Reichweite',
      'Algorithmus-Boost durch Shares',
      'Echte TikTok-Nutzer teilen dein Video',
      'Geschwindigkeit: 2.500 Shares/Tag',
      'Premium Service für maximale Wirkung',
      'Lifetime Garantie'
    ],
    basePrice: 0.08,
    discount: 20,
    speedOptions: [
      {
        id: 'standard',
        name: 'Standard',
        price: 0,
        description: 'Normale Liefergeschwindigkeit'
      },
      {
        id: 'express',
        name: 'Express',
        price: 12.99,
        description: 'Schnellere Lieferung für maximale Wirkung'
      }
    ],
    quantityOptions: [10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
    inputType: 'tiktok',
    inputPlaceholder: 'https://www.tiktok.com/@username/video/...',
    category: 'tiktok-shares'
  },
  {
    id: 'tiktok-followers',
    name: 'TikTok Followers',
    slug: 'tiktok-followers',
    icon: '👥',
    description: 'Baue deine TikTok-Community mit echten Followern auf. Hochwertige, aktive Accounts für nachhaltiges Wachstum.',
    features: [
      'Echte TikTok-Accounts mit hoher Aktivität',
      'Permanente Follower mit Lifetime-Garantie',
      'Natürliche Lieferung für Algorithmus-Sicherheit',
      'Geschwindigkeit: 2.000 Follower/Tag',
      'Premium-Qualität für Creator-Accounts',
      '24/7 Premium-Support'
    ],
    basePrice: 0.08,
    discount: 15,
    speedOptions: [
      {
        id: 'standard',
        name: 'Standard Lieferung',
        price: 0,
        description: '1.000-2.000 Follower/Tag'
      },
      {
        id: 'premium',
        name: 'Premium Lieferung',
        price: 10.99,
        description: 'Bis zu 3.000 Follower/Tag'
      }
    ],
    quantityOptions: [50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000],
    inputType: 'tiktok-profile',
    inputPlaceholder: 'https://www.tiktok.com/@dein-profil',
    category: 'tiktok-followers'
  },

  // Instagram Products - Premium positioning with 20-30% higher pricing than TikTok
  {
    id: 'instagram-followers',
    name: 'Instagram Followers',
    slug: 'instagram-followers',
    icon: '👥',
    description: 'Baue deine Instagram-Community mit echten Followern auf. Hochwertige, aktive Accounts für nachhaltiges Wachstum.',
    features: [
      'Echte Instagram-Accounts mit hoher Aktivität',
      'Permanente Follower mit Lifetime-Garantie',
      'Langsame, natürliche Lieferung für Sicherheit',
      'Geschwindigkeit: 1.000 Follower/Tag',
      'Premium-Qualität für Business-Accounts',
      '24/7 Premium-Support'
    ],
    basePrice: 0.095, // 27% higher than TikTok equivalent (0.075)
    discount: 15,
    speedOptions: [
      {
        id: 'standard',
        name: 'Standard Lieferung',
        price: 0,
        description: '500-1.000 Follower/Tag'
      },
      {
        id: 'premium',
        name: 'Premium Lieferung',
        price: 12.99,
        description: 'Bis zu 2.000 Follower/Tag'
      }
    ],
    quantityOptions: [50, 100, 250, 500, 1000, 2500, 5000, 10000, 20000],
    inputType: 'instagram-profile',
    inputPlaceholder: 'https://www.instagram.com/dein-profil/',
    category: 'instagram-followers'
  },
  {
    id: 'instagram-likes',
    name: 'Instagram Likes',
    slug: 'instagram-likes',
    icon: '❤️',
    description: 'Steigere das Engagement deiner Instagram Posts mit echten Likes. Mehr Sichtbarkeit im Instagram-Algorithmus.',
    features: [
      'Echte Likes von aktiven Instagram-Nutzern',
      'Sofortiger Algorithmus-Boost für Posts',
      'Hohe Engagement-Rate für bessere Reichweite',
      'Geschwindigkeit: 15.000 Likes/Tag',
      'Lifetime-Garantie auf alle Likes',
      'Sichere und diskrete Lieferung'
    ],
    basePrice: 0.032, // 28% higher than TikTok (0.025)
    discount: 12,
    speedOptions: [
      {
        id: 'standard',
        name: 'Standard',
        price: 0,
        description: 'Normale Liefergeschwindigkeit'
      },
      {
        id: 'instant',
        name: 'Sofort-Lieferung',
        price: 7.99,
        description: 'Start innerhalb von 1 Stunde'
      }
    ],
    quantityOptions: [50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000],
    inputType: 'instagram',
    inputPlaceholder: 'https://www.instagram.com/p/ABC123...',
    category: 'instagram-likes'
  },
  {
    id: 'instagram-views',
    name: 'Instagram Views',
    slug: 'instagram-views',
    icon: '👀',
    description: 'Maximiere die Reichweite deiner Instagram Reels und Stories. Echte Views für viralen Content.',
    features: [
      'Echte Views für Reels und Stories',
      'Algorithmus-optimierte Lieferung',
      'Hohe Retention-Rate für bessere Performance',
      'Geschwindigkeit: 100.000 Views/Tag',
      'Perfekt für Reels und Video-Content',
      'Lifetime-Garantie'
    ],
    basePrice: 0.019, // 27% higher than TikTok (0.015)
    discount: 18,
    speedOptions: [
      {
        id: 'standard',
        name: 'Standard',
        price: 0,
        description: 'Optimale Liefergeschwindigkeit'
      },
      {
        id: 'viral',
        name: 'Viral-Boost',
        price: 9.99,
        description: 'Maximale Geschwindigkeit für viralen Effekt'
      }
    ],
    quantityOptions: [500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000],
    inputType: 'instagram',
    inputPlaceholder: 'https://www.instagram.com/reel/ABC123... oder Story-Link',
    category: 'instagram-views'
  },
  {
    id: 'instagram-comments',
    name: 'Instagram Kommentare',
    slug: 'instagram-comments',
    icon: '💬',
    description: 'Belebe deine Instagram Posts mit echten, hochwertigen Kommentaren. Deutsche und englische Premium-Kommentare.',
    features: [
      'Hochwertige deutsche und englische Kommentare',
      'Echte Instagram-Accounts kommentieren',
      'Personalisierte und relevante Inhalte',
      'Geschwindigkeit: 200 Kommentare/Tag',
      'Premium-Service mit individueller Betreuung',
      'Lifetime-Garantie auf alle Kommentare'
    ],
    basePrice: 0.195, // 30% higher than TikTok (0.15)
    speedOptions: [
      {
        id: 'standard',
        name: 'Standard',
        price: 0,
        description: 'Qualitäts-Kommentare über 2-3 Tage verteilt'
      },
      {
        id: 'premium',
        name: 'Premium Custom',
        price: 15.99,
        description: 'Individuell angepasste Kommentare'
      }
    ],
    quantityOptions: [5, 10, 25, 50, 100, 200, 500],
    inputType: 'instagram',
    inputPlaceholder: 'https://www.instagram.com/p/ABC123...',
    category: 'instagram-comments',
    targetOptions: [
      {
        id: 'mixed',
        name: 'Gemischt (Deutsch/Englisch)',
        price: 0
      },
      {
        id: 'german',
        name: 'Nur Deutsche Premium-Kommentare',
        price: 0.08
      },
      {
        id: 'business',
        name: 'Business-fokussierte Kommentare',
        price: 0.12
      }
    ]
  }
]

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug)
}

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category)
}

export const getAllProductSlugs = (): string[] => {
  return products.map(product => product.slug)
}