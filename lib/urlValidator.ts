// URL validation utilities for YouTube, TikTok, and Instagram
export interface ValidationResult {
  isValid: boolean
  error?: string
  urlType?: 'video' | 'channel' | 'tiktok' | 'tiktok-profile' | 'instagram' | 'instagram-profile'
  cleanUrl?: string
}

export class YouTubeUrlValidator {
  
  /**
   * Validate YouTube video URLs
   * Accepts various YouTube video URL formats
   */
  static validateVideoUrl(url: string): ValidationResult {
    if (!url || url.trim().length === 0) {
      return { isValid: false, error: 'URL ist erforderlich' }
    }

    const cleanUrl = url.trim()

    // Basic URL structure check
    if (!cleanUrl.startsWith('http')) {
      return { isValid: false, error: 'URL muss mit http:// oder https:// beginnen' }
    }

    // YouTube domain check (flexible)
    const youtubeDomains = [
      'youtube.com',
      'www.youtube.com',
      'youtu.be',
      'www.youtu.be',
      'm.youtube.com'
    ]

    const hasYoutubeDomain = youtubeDomains.some(domain => 
      cleanUrl.includes(domain)
    )

    if (!hasYoutubeDomain) {
      return { isValid: false, error: 'URL muss eine YouTube-URL sein' }
    }

    // Video URL patterns (flexible matching)
    const videoPatterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/ // YouTube Shorts URLs
    ]

    const hasVideoPattern = videoPatterns.some(pattern => 
      pattern.test(cleanUrl)
    )

    if (!hasVideoPattern) {
      return { 
        isValid: false, 
        error: 'URL muss ein gültiges YouTube-Video sein (z.B. youtube.com/watch?v=..., youtu.be/... oder youtube.com/shorts/...)' 
      }
    }

    return {
      isValid: true,
      urlType: 'video',
      cleanUrl
    }
  }

  /**
   * Validate YouTube channel URLs
   * Accepts various YouTube channel URL formats
   */
  static validateChannelUrl(url: string): ValidationResult {
    if (!url || url.trim().length === 0) {
      return { isValid: false, error: 'Kanal-URL ist erforderlich' }
    }

    const cleanUrl = url.trim()

    // Basic URL structure check
    if (!cleanUrl.startsWith('http')) {
      return { isValid: false, error: 'URL muss mit http:// oder https:// beginnen' }
    }

    // YouTube domain check
    const youtubeDomains = [
      'youtube.com',
      'www.youtube.com',
      'm.youtube.com'
    ]

    const hasYoutubeDomain = youtubeDomains.some(domain => 
      cleanUrl.includes(domain)
    )

    if (!hasYoutubeDomain) {
      return { isValid: false, error: 'URL muss eine YouTube-URL sein' }
    }

    // Channel URL patterns (flexible matching)
    const channelPatterns = [
      /youtube\.com\/@([a-zA-Z0-9_.-]+)/, // New @username format
      /youtube\.com\/c\/([a-zA-Z0-9_.-]+)/, // Custom URL
      /youtube\.com\/channel\/([a-zA-Z0-9_-]{24})/, // Channel ID
      /youtube\.com\/user\/([a-zA-Z0-9_.-]+)/ // Legacy username
    ]

    const hasChannelPattern = channelPatterns.some(pattern => 
      pattern.test(cleanUrl)
    )

    if (!hasChannelPattern) {
      return { 
        isValid: false, 
        error: 'URL muss ein gültiger YouTube-Kanal sein (z.B. youtube.com/@kanalname oder youtube.com/channel/...)' 
      }
    }

    return {
      isValid: true,
      urlType: 'channel',
      cleanUrl
    }
  }

  /**
   * Generic validator that determines URL type and validates accordingly
   */
  static validateYouTubeUrl(url: string, expectedType?: 'video' | 'channel' | 'tiktok' | 'tiktok-profile' | 'instagram' | 'instagram-profile'): ValidationResult {
    if (!url || url.trim().length === 0) {
      return { isValid: false, error: 'URL ist erforderlich' }
    }

    // If TikTok type is expected, use TikTok validator
    if (expectedType === 'tiktok' || expectedType === 'tiktok-profile') {
      return this.validateTikTokUrl(url)
    }

    // If Instagram type is expected, use Instagram validator
    if (expectedType === 'instagram' || expectedType === 'instagram-profile') {
      return this.validateInstagramUrl(url)
    }

    // If specific YouTube type is expected, validate for that type
    if (expectedType === 'video') {
      return this.validateVideoUrl(url)
    }
    
    if (expectedType === 'channel') {
      return this.validateChannelUrl(url)
    }

    // Auto-detect URL type if not specified
    const videoResult = this.validateVideoUrl(url)
    if (videoResult.isValid) {
      return videoResult
    }

    const channelResult = this.validateChannelUrl(url)
    if (channelResult.isValid) {
      return channelResult
    }

    // If neither format works, return a generic error
    return {
      isValid: false,
      error: 'URL muss eine gültige YouTube-Video oder Kanal-URL sein'
    }
  }

  /**
   * Validate TikTok video URLs
   * Accepts various TikTok video URL formats
   */
  static validateTikTokUrl(url: string): ValidationResult {
    if (!url || url.trim().length === 0) {
      return { isValid: false, error: 'TikTok URL ist erforderlich' }
    }

    const cleanUrl = url.trim()

    // Basic URL structure check
    if (!cleanUrl.startsWith('http')) {
      return { isValid: false, error: 'URL muss mit http:// oder https:// beginnen' }
    }

    // TikTok domain check
    const tiktokDomains = [
      'tiktok.com',
      'www.tiktok.com',
      'm.tiktok.com',
      'vm.tiktok.com'
    ]

    const hasTikTokDomain = tiktokDomains.some(domain => 
      cleanUrl.includes(domain)
    )

    if (!hasTikTokDomain) {
      return { isValid: false, error: 'URL muss eine TikTok-URL sein' }
    }

    // TikTok video URL patterns
    const tiktokPatterns = [
      /tiktok\.com\/@([a-zA-Z0-9_.]+)\/video\/(\d+)/,  // Standard video URL
      /tiktok\.com\/t\/([a-zA-Z0-9_]+)/,               // Short URL format
      /vm\.tiktok\.com\/([a-zA-Z0-9_]+)/,             // Mobile short URL
      /tiktok\.com\/@([^\/]+)\/video\/(\d{19})/       // Full video ID format
    ]

    const hasTikTokPattern = tiktokPatterns.some(pattern => 
      pattern.test(cleanUrl)
    )

    if (!hasTikTokPattern) {
      return { 
        isValid: false, 
        error: 'URL muss ein gültiges TikTok-Video sein (z.B. tiktok.com/@username/video/...)' 
      }
    }

    return {
      isValid: true,
      urlType: 'tiktok',
      cleanUrl
    }
  }

  /**
   * Validate Instagram URLs
   * Accepts various Instagram URL formats: profiles, posts, reels, stories
   */
  static validateInstagramUrl(url: string): ValidationResult {
    if (!url || url.trim().length === 0) {
      return { isValid: false, error: 'Instagram URL ist erforderlich' }
    }

    const cleanUrl = url.trim()

    // Basic URL structure check
    if (!cleanUrl.startsWith('http')) {
      return { isValid: false, error: 'URL muss mit http:// oder https:// beginnen' }
    }

    // Instagram domain check
    const instagramDomains = [
      'instagram.com',
      'www.instagram.com',
      'm.instagram.com'
    ]

    const hasInstagramDomain = instagramDomains.some(domain => 
      cleanUrl.includes(domain)
    )

    if (!hasInstagramDomain) {
      return { isValid: false, error: 'URL muss eine Instagram-URL sein' }
    }

    // Instagram URL patterns
    const instagramPatterns = [
      /instagram\.com\/([a-zA-Z0-9_.]+)\/?$/,                      // Profile URL
      /instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?/,                   // Post URL
      /instagram\.com\/reel\/([a-zA-Z0-9_-]+)\/?/,                // Reels URL
      /instagram\.com\/tv\/([a-zA-Z0-9_-]+)\/?/,                  // IGTV URL
      /instagram\.com\/stories\/([a-zA-Z0-9_.]+)\/([0-9]+)\/?/,   // Stories URL
      /instagram\.com\/([a-zA-Z0-9_.]+)\/p\/([a-zA-Z0-9_-]+)\/?/, // Profile post URL
      /instagram\.com\/([a-zA-Z0-9_.]+)\/reel\/([a-zA-Z0-9_-]+)\/?/ // Profile reel URL
    ]

    const hasInstagramPattern = instagramPatterns.some(pattern => 
      pattern.test(cleanUrl)
    )

    if (!hasInstagramPattern) {
      return { 
        isValid: false, 
        error: 'URL muss ein gültiger Instagram-Link sein (Profil, Post, Reel oder Story)' 
      }
    }

    return {
      isValid: true,
      urlType: 'instagram',
      cleanUrl
    }
  }

  /**
   * Extract video ID from YouTube video URL
   */
  static extractVideoId(url: string): string | null {
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/ // YouTube Shorts URLs
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }

  /**
   * Extract channel identifier from YouTube channel URL
   */
  static extractChannelId(url: string): string | null {
    const patterns = [
      { pattern: /youtube\.com\/@([a-zA-Z0-9_.-]+)/, type: 'handle' },
      { pattern: /youtube\.com\/c\/([a-zA-Z0-9_.-]+)/, type: 'custom' },
      { pattern: /youtube\.com\/channel\/([a-zA-Z0-9_-]{24})/, type: 'id' },
      { pattern: /youtube\.com\/user\/([a-zA-Z0-9_.-]+)/, type: 'user' }
    ]

    for (const { pattern } of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }

  /**
   * Clean and normalize YouTube URL
   */
  static cleanUrl(url: string): string {
    let cleanUrl = url.trim()
    
    try {
      // Remove tracking parameters
      const urlObj = new URL(cleanUrl)
      const paramsToKeep = ['v', 'list'] // Keep essential YouTube parameters
      
      const newSearchParams = new URLSearchParams()
      paramsToKeep.forEach(param => {
        const value = urlObj.searchParams.get(param)
        if (value) {
          newSearchParams.set(param, value)
        }
      })
      
      urlObj.search = newSearchParams.toString()
      return urlObj.toString()
    } catch (error) {
      // If URL parsing fails, return the original cleaned URL
      return cleanUrl
    }
  }
}

export default YouTubeUrlValidator