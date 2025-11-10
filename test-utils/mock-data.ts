import type { Phone, NewsItem, Review, Company } from '@/lib/types'

export const mockPhone: Phone = {
  id: '1',
  slug: 'iphone-15-pro',
  name: 'iPhone 15 Pro',
  brand: 'Apple',
  type: 'Flagship',
  os: 'iOS',
  price: '$999',
  specs: {
    display: '6.1" Super Retina XDR',
    battery: 'Up to 23 hours video playback',
    camera: '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
    processor: 'A17 Pro',
    storage: '128GB',
    ram: '8GB',
    screen_size: '6.1"',
    resolution: '2556 x 1179',
    refresh_rate: '120Hz',
    weight: '187g',
    dimensions: '146.6 x 70.6 x 8.25 mm',
    connectivity: '5G, Wi-Fi 6E, Bluetooth 5.3',
    sensors: 'Face ID, LiDAR Scanner',
    audio: 'Spatial Audio',
    charging: 'USB-C',
    water_resistance: 'IP68',
    colors: 'Natural Titanium, Blue Titanium, White Titanium, Black Titanium'
  },
  image: '/iphone-15-pro.jpg',
  createdAt: '2024-01-15T10:00:00Z',
  description: 'The latest iPhone with titanium design and A17 Pro chip',
  features: ['Titanium Design', 'A17 Pro Chip', 'Action Button', 'USB-C'],
  highlights: ['Pro camera system', 'Advanced computational photography', 'Titanium construction'],
  taxonomies: [
    { taxonomy_uid: 'company', term_uid: 'apple' },
    { taxonomy_uid: 'phone', term_uid: 'flagship' },
    { taxonomy_uid: 'phone', term_uid: 'ios' }
  ],
  company: [{ uid: 'apple-uid', _content_type_uid: 'company' }],
  raw_price: '999',
  release_date: '2024-09-15',
  seo_meta: {
    title: 'iPhone 15 Pro - Latest Apple Flagship',
    description: 'Discover the iPhone 15 Pro with titanium design and A17 Pro chip',
    keywords: ['iPhone', 'Apple', 'flagship', 'titanium', 'A17 Pro']
  },
  images: {
    uid: 'img-1',
    url: '/iphone-15-pro.jpg',
    title: 'iPhone 15 Pro',
    filename: 'iphone-15-pro.jpg',
    content_type: 'image/jpeg',
    file_size: '2.5MB'
  }
}

export const mockNewsItem: NewsItem = {
  id: '1',
  title: 'iPhone 15 Pro Review: The Best iPhone Yet',
  excerpt: 'Our comprehensive review of the latest iPhone with titanium design',
  image: '/news/iphone-15-pro-review.jpg',
  category: 'Reviews',
  publishedAt: '2024-01-15T10:00:00Z',
  url: '/news/iphone-15-pro-review'
}

export const mockReview: Review = {
  id: '1',
  slug: 'iphone-15-pro-review',
  title: 'iPhone 15 Pro Review: Titanium Excellence',
  rating: 4.5,
  pros: ['Excellent build quality', 'Outstanding camera system', 'Fast performance'],
  cons: ['Expensive', 'Limited storage options'],
  excerpt: 'The iPhone 15 Pro delivers exceptional performance with its titanium design',
  content: 'Full review content here...',
  publish_date: '2024-01-15T10:00:00Z',
  seo_meta: {
    title: 'iPhone 15 Pro Review - PhoneFront',
    description: 'Comprehensive review of the iPhone 15 Pro',
    keywords: ['iPhone 15 Pro', 'review', 'Apple', 'titanium']
  },
  phoneId: '1',
  phoneName: 'iPhone 15 Pro',
  phoneSlug: 'iphone-15-pro',
  reviewedOn: '2024-01-15T10:00:00Z',
  author: {
    name: 'John Doe',
    verified: true,
    avatar: '/reviewer-avatar.jpg',
    title: 'Senior Tech Reviewer',
    bio: 'Expert in smartphone technology',
    email: 'john@phonefront.com',
    avatarData: {
      url: '/reviewer-avatar.jpg',
      title: 'John Doe'
    }
  },
  likes: 42,
  comments: 8,
  images: {
    uid: 'review-img-1',
    url: '/reviews/iphone-15-pro-review.jpg',
    title: 'iPhone 15 Pro Review',
    filename: 'iphone-15-pro-review.jpg',
    content_type: 'image/jpeg',
    file_size: '1.8MB'
  },
  phone: {
    uid: 'phone-1',
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    brand: 'Apple',
    image: '/iphone-15-pro.jpg'
  },
  authorData: {
    name: 'John Doe',
    verified: true,
    avatar: '/reviewer-avatar.jpg',
    title: 'Senior Tech Reviewer',
    bio: 'Expert in smartphone technology',
    email: 'john@phonefront.com',
    avatarData: {
      url: '/reviewer-avatar.jpg',
      title: 'John Doe'
    }
  }
}

export const mockCompany: Company = {
  id: '1',
  name: 'Apple',
  slug: 'apple',
  description: 'Technology company known for innovative smartphones and devices',
  phonesCount: 15,
  color: '#007AFF',
  initial: 'A'
}

export const mockPhones: Phone[] = [
  mockPhone,
  {
    id: '2',
    slug: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    type: 'Flagship',
    os: 'Android',
    price: '$1199',
    specs: {
      display: '6.8" Dynamic AMOLED 2X',
      battery: 'Up to 24 hours video playback',
      camera: '200MP Main, 12MP Ultra Wide, 10MP Telephoto',
      processor: 'Snapdragon 8 Gen 3',
      storage: '256GB',
      ram: '12GB',
      screen_size: '6.8"',
      resolution: '3120 x 1440',
      refresh_rate: '120Hz',
      weight: '232g',
      dimensions: '162.3 x 79.0 x 8.6 mm',
      connectivity: '5G, Wi-Fi 7, Bluetooth 5.3',
      sensors: 'Ultrasonic Fingerprint, Face Recognition',
      audio: 'Stereo Speakers',
      charging: 'USB-C',
      water_resistance: 'IP68',
      colors: 'Titanium Black, Titanium Gray, Titanium Violet, Titanium Yellow'
    },
    image: '/samsung-galaxy-s24-ultra.jpg',
    createdAt: '2024-01-15T10:00:00Z',
    description: 'Samsung\'s flagship with AI-powered camera and S Pen',
    features: ['S Pen', 'AI Camera', 'Titanium Design', 'Wireless Charging'],
    highlights: ['200MP camera system', 'S Pen integration', 'Titanium construction'],
    taxonomies: [
      { taxonomy_uid: 'company', term_uid: 'samsung' },
      { taxonomy_uid: 'phone', term_uid: 'flagship' },
      { taxonomy_uid: 'phone', term_uid: 'android' }
    ],
    company: [{ uid: 'samsung-uid', _content_type_uid: 'company' }],
    raw_price: '1199',
    release_date: '2024-01-17',
    seo_meta: {
      title: 'Samsung Galaxy S24 Ultra - AI-Powered Flagship',
      description: 'Discover the Galaxy S24 Ultra with AI camera and S Pen',
      keywords: ['Galaxy S24 Ultra', 'Samsung', 'flagship', 'AI', 'S Pen']
    },
    images: {
      uid: 'img-2',
      url: '/samsung-galaxy-s24-ultra.jpg',
      title: 'Samsung Galaxy S24 Ultra',
      filename: 'samsung-galaxy-s24-ultra.jpg',
      content_type: 'image/jpeg',
      file_size: '2.8MB'
    }
  }
]

export const mockNewsItems: NewsItem[] = [
  mockNewsItem,
  {
    ...mockNewsItem,
    id: '2',
    title: 'Samsung Galaxy S24 Ultra: AI-Powered Photography',
    excerpt: 'Samsung\'s latest flagship with advanced AI camera features',
    url: '/news/samsung-galaxy-s24-ultra-ai-camera'
  }
]

export const mockReviews: Review[] = [
  mockReview,
  {
    ...mockReview,
    id: '2',
    slug: 'samsung-galaxy-s24-ultra-review',
    title: 'Samsung Galaxy S24 Ultra Review: AI Excellence',
    rating: 4.3,
    phoneId: '2',
    phoneName: 'Samsung Galaxy S24 Ultra',
    phoneSlug: 'samsung-galaxy-s24-ultra'
  }
]

export const mockCompanies: Company[] = [
  mockCompany,
  {
    id: '2',
    name: 'Samsung',
    slug: 'samsung',
    description: 'South Korean technology company',
    phonesCount: 25,
    color: '#1E88E5',
    initial: 'S'
  }
]

// Additional mock data for Contentstack-dependent components
export const mockHomePage = {
  hero_section: {
    headline: 'Discover the Latest',
    highlight_text: 'Smartphones',
    subheadline: 'Find the perfect smartphone for your needs with our comprehensive reviews and comparisons',
    badge_text: 'Featured',
    cta_buttons: [
      {
        button_text: 'Browse Phones',
        button_link: { href: '/phones' },
        button_style: 'default',
        icon_name: 'ArrowRight',
        _metadata: { uid: 'browse-phones-button' }
      },
      {
        button_text: 'Read Reviews',
        button_link: { href: '/reviews' },
        button_style: 'outline',
        icon_name: 'Star',
        _metadata: { uid: 'read-reviews-button' }
      }
    ],
    stats: [
      { number: '500+', label: 'Phones Reviewed', color: 'primary', _metadata: { uid: 'phones-stat' } },
      { number: '50+', label: 'Expert Reviews', color: 'accent', _metadata: { uid: 'reviews-stat' } },
      { number: '1000+', label: 'Happy Users', color: 'secondary', _metadata: { uid: 'users-stat' } }
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
  }
}

export const mockHeader = {
  title: 'PhoneFront',
  group: [
    {
      link: {
        href: '/phones',
        title: 'Phones'
      }
    },
    {
      link: {
        href: '/news',
        title: 'News'
      }
    },
    {
      link: {
        href: '/reviews',
        title: 'Reviews'
      }
    }
  ]
}

export const mockFooter = {
  title: 'PhoneFront',
  description: 'Your ultimate destination for smartphone information',
  links: [
    { href: '/about', title: 'About' },
    { href: '/contact', title: 'Contact' }
  ]
}

export const mockApiResponse = {
  items: mockPhones,
  page: 1,
  pageSize: 12,
  total: 2,
  personalized: true,
  variantParam: 'test-variant'
}

export const mockNewsApiResponse = {
  items: mockNewsItems,
  page: 1,
  pageSize: 12,
  total: 2,
  personalized: true,
  variantParam: 'test-variant'
}

export const mockReviewsApiResponse = {
  items: mockReviews,
  page: 1,
  pageSize: 12,
  total: 2,
  personalized: true,
  variantParam: 'test-variant'
}

export const mockCompaniesApiResponse = {
  items: mockCompanies,
  page: 1,
  pageSize: 12,
  total: 2,
  personalized: true,
  variantParam: 'test-variant'
}
