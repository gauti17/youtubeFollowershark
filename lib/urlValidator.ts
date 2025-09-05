// Basic YouTube URL validation utilities
export interface ValidationResult {
  isValid: boolean
  error?: string
  urlType?: 'video' | 'channel'
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
  static validateYouTubeUrl(url: string, expectedType?: 'video' | 'channel'): ValidationResult {
    if (!url || url.trim().length === 0) {
      return { isValid: false, error: 'URL ist erforderlich' }
    }

    // If specific type is expected, validate for that type
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