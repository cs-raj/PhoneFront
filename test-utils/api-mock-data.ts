import type { HomePage, AboutPage, CareersPage, FAQsPage, ContactPage, Header, Footer } from '@/lib/types'

// Mock Contentstack API responses
export const mockContentstackHomePage: HomePage = {
  uid: 'home-page-uid',
  title: 'PhoneFront - Your Trusted Smartphone Guide',
  locale: 'en-us',
  hero_section: {
    headline: 'Discover the Latest Smartphones',
    highlight_text: 'Expert Reviews & Comparisons',
    description: 'Your trusted source for smartphone reviews, comparisons, and the latest mobile technology news.',
    cta_text: 'Explore Phones',
    cta_link: '/phones',
    background_image: '/hero-bg.jpg',
    stats: [
      { label: 'Phones Reviewed', value: '500+', color: 'primary' },
      { label: 'Expert Reviews', value: '1000+', color: 'accent' },
      { label: 'Happy Users', value: '50K+', color: 'secondary' }
    ]
  },
  featured_news_section: {
    section_title: 'Featured News',
    section_description: 'Stay updated with the latest smartphone news',
    show_view_all: true,
    number_of_articles: 3
  },
  latest_phones_section: {
    section_title: 'Latest Phones',
    section_description: 'Discover the newest smartphones hitting the market',
    show_view_all: true,
    number_of_phones: 12
  },
  seo_metadata: {
    meta_title: 'PhoneFront - Your Trusted Smartphone Guide',
    meta_description: 'Your trusted source for smartphone reviews, comparisons, and the latest mobile technology news.',
    meta_keywords: ['smartphone reviews', 'phone comparisons', 'mobile news', 'best smartphones'],
    og_image: '/og-image.jpg'
  }
}

export const mockContentstackAboutPage: AboutPage = {
  uid: 'about-page-uid',
  title: 'About PhoneFront',
  locale: 'en-us',
  sections: [
    {
      hero_section: {
        headline: 'About PhoneFront',
        description: 'Your trusted smartphone guide since 2020',
        background_image: '/about-hero.jpg'
      }
    },
    {
      mission_section: {
        title: 'Our Mission',
        description: 'To provide unbiased, comprehensive smartphone reviews and comparisons',
        features: [
          'Expert Analysis',
          'Unbiased Reviews',
          'Comprehensive Comparisons'
        ]
      }
    }
  ]
}

export const mockContentstackCareersPage: CareersPage = {
  uid: 'careers-page-uid',
  title: 'Join Our Team',
  locale: 'en-us',
  hero_section: {
    headline: 'Build the Future of Tech Reviews',
    description: 'Join our team of passionate tech enthusiasts',
    background_image: '/careers-hero.jpg'
  },
  open_positions: [
    {
      title: 'Senior Mobile Tech Reviewer',
      department: 'Editorial',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead our mobile technology review team'
    }
  ]
}

export const mockContentstackFAQsPage: FAQsPage = {
  uid: 'faqs-page-uid',
  title: 'Frequently Asked Questions',
  locale: 'en-us',
  faqs: [
    {
      question: 'How do you test smartphones?',
      answer: 'We conduct comprehensive testing including performance, camera, battery life, and user experience.'
    },
    {
      question: 'Are your reviews unbiased?',
      answer: 'Yes, we maintain strict editorial independence and provide honest, unbiased reviews.'
    }
  ]
}

export const mockContentstackContactPage: ContactPage = {
  uid: 'contact-page-uid',
  title: 'Contact Us',
  locale: 'en-us',
  contact_form: {
    title: 'Get in Touch',
    description: 'Have questions? We\'d love to hear from you.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true }
    ]
  },
  contact_info: {
    email: 'contact@phonefront.com',
    phone: '+1-555-0123',
    address: '123 Tech Street, Silicon Valley, CA 94000'
  }
}

export const mockContentstackHeader: Header = {
  uid: 'header-uid',
  title: 'PhoneFront',
  locale: 'en-us',
  group: [
    {
      link: {
        title: 'Phones',
        href: '/phones'
      }
    },
    {
      link: {
        title: 'News',
        href: '/news'
      }
    },
    {
      link: {
        title: 'Companies',
        href: '/companies'
      }
    },
    {
      link: {
        title: 'About',
        href: '/about'
      }
    }
  ]
}

export const mockContentstackFooter: Footer = {
  uid: 'footer-uid',
  title: 'PhoneFront',
  locale: 'en-us',
  navigation_links: [
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Privacy', href: '/privacy' }
  ],
  social_media_links: [
    { platform: 'Twitter', url: 'https://twitter.com/phonefront' },
    { platform: 'Facebook', url: 'https://facebook.com/phonefront' }
  ],
  contact_information: {
    email: 'contact@phonefront.com',
    phone: '+1-555-0123'
  }
}

// Mock Contentstack entries responses
export const mockContentstackEntries = {
  home_page: {
    entries: [mockContentstackHomePage],
    count: 1
  },
  about_page: {
    entries: [mockContentstackAboutPage],
    count: 1
  },
  careers_page: {
    entries: [mockContentstackCareersPage],
    count: 1
  },
  faqs_page: {
    entries: [mockContentstackFAQsPage],
    count: 1
  },
  contact_page: {
    entries: [mockContentstackContactPage],
    count: 1
  },
  header: {
    entries: [mockContentstackHeader],
    count: 1
  },
  footer: {
    entries: [mockContentstackFooter],
    count: 1
  }
}

// Mock API response structures
export const mockApiResponses = {
  homePage: {
    ...mockContentstackHomePage,
    personalized: false,
    variantParam: null
  },
  aboutPage: {
    ...mockContentstackAboutPage,
    personalized: false,
    variantParam: null
  },
  careersPage: {
    ...mockContentstackCareersPage,
    personalized: false,
    variantParam: null
  },
  faqsPage: {
    ...mockContentstackFAQsPage,
    personalized: false,
    variantParam: null
  },
  contactPage: {
    ...mockContentstackContactPage,
    personalized: false,
    variantParam: null
  },
  header: {
    ...mockContentstackHeader,
    personalized: false,
    variantParam: null
  },
  footer: {
    ...mockContentstackFooter,
    personalized: false,
    variantParam: null
  }
}

// Mock personalized responses
export const mockPersonalizedResponses = {
  homePage: {
    ...mockContentstackHomePage,
    personalized: true,
    variantParam: 'exp_123_var_456'
  },
  aboutPage: {
    ...mockContentstackAboutPage,
    personalized: true,
    variantParam: 'exp_123_var_456'
  }
}

// Mock error responses
export const mockErrorResponses = {
  noData: {
    message: 'No data found',
    personalized: false,
    variantParam: null,
    timestamp: new Date().toISOString()
  },
  apiError: {
    message: 'API error',
    error: 'Test error message',
    personalized: false,
    timestamp: new Date().toISOString()
  }
}

// Mock Contentstack SDK responses
export const mockContentstackResponses = {
  success: (contentType: string) => mockContentstackEntries[contentType as keyof typeof mockContentstackEntries],
  empty: {
    entries: [],
    count: 0
  },
  error: new Error('Contentstack API error')
}

// Mock NextRequest objects for testing
export const createMockRequest = (url: string, variantParam?: string) => {
  const fullUrl = variantParam ? `${url}?cs_variant=${variantParam}` : url
  const request = new Request(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  // Add NextRequest properties
  return Object.assign(request, {
    cookies: {
      getAll: () => [],
      get: () => undefined,
      has: () => false,
      set: () => {},
      delete: () => {},
      toString: () => ''
    },
    geo: {
      city: '',
      country: '',
      region: '',
      latitude: '',
      longitude: ''
    },
    ip: '',
    nextUrl: new URL(fullUrl),
    headers: request.headers
  })
}

// Mock NextRequest with cookies
export const createMockRequestWithCookies = (url: string, cookies: Record<string, string>) => {
  const cookieString = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')
  
  return new Request(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieString
    }
  })
}
