import { render, screen, waitFor } from '@testing-library/react'
import NewsClient from '../news-client'

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn()
}))

const mockUseSWR = require('swr').default

// Mock Next.js Link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

const mockNewsData = {
  items: [
    {
      id: '1',
      title: 'iPhone 15 Pro Review',
      excerpt: 'Our comprehensive review of the latest iPhone',
      imageUrl: '/news/iphone-15.jpg',
      imageAlt: 'iPhone 15 Pro',
      category: 'Reviews',
      dateISO: '2024-01-15T10:00:00Z',
      datePretty: 'January 15, 2024',
      slug: 'iphone-15-pro-review',
      badge: 'Breaking',
      priority: 'high',
      source: 'official',
      company: 'apple',
      author: 'John Doe',
      viewCount: 1000,
      commentCount: 50,
      body: '<p>Review content</p>'
    },
    {
      id: '2',
      title: 'Samsung Galaxy S24 Launch',
      excerpt: 'Samsung announces its latest flagship',
      imageUrl: '/news/galaxy-s24.jpg',
      imageAlt: 'Galaxy S24',
      category: 'Launches',
      dateISO: '2024-01-20T10:00:00Z',
      datePretty: 'January 20, 2024',
      slug: 'galaxy-s24-launch',
      badge: 'New',
      priority: 'medium',
      source: 'official',
      company: 'samsung',
      author: 'Jane Smith',
      viewCount: 800,
      commentCount: 30
    }
  ],
  total: 2,
  page: 1,
  pageSize: 4,
  personalized: false
}

describe('NewsClient Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSWR.mockReturnValue({
      data: mockNewsData,
      isLoading: false,
      error: undefined
    })
  })

  it('should render without crashing', () => {
    render(<NewsClient initialUrl="/api/news" initialData={mockNewsData} />)
    
    expect(screen.getByText('Latest News')).toBeInTheDocument()
  })

  it('should display news articles', () => {
    render(<NewsClient initialUrl="/api/news" initialData={mockNewsData} />)
    
    expect(screen.getByText('iPhone 15 Pro Review')).toBeInTheDocument()
    expect(screen.getByText('Samsung Galaxy S24 Launch')).toBeInTheDocument()
  })

  it('should display news article excerpts', () => {
    render(<NewsClient initialUrl="/api/news" initialData={mockNewsData} />)
    
    expect(screen.getByText('Our comprehensive review of the latest iPhone')).toBeInTheDocument()
    expect(screen.getByText('Samsung announces its latest flagship')).toBeInTheDocument()
  })

  it('should handle loading state', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined
    })

    render(<NewsClient initialUrl="/api/news" initialData={{ items: [], total: 0, page: 1, pageSize: 4, personalized: false }} />)
    
    expect(screen.getByText('Loading news...')).toBeInTheDocument()
  })

  it('should handle error state', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('API Error')
    })

    render(<NewsClient initialUrl="/api/news" initialData={{ items: [], total: 0, page: 1, pageSize: 4, personalized: false }} />)
    
    expect(screen.getByText('Error loading news: API Error')).toBeInTheDocument()
  })

  it('should display filter sidebar', () => {
    render(<NewsClient initialUrl="/api/news" initialData={mockNewsData} />)
    
    expect(screen.getByText('Filter News')).toBeInTheDocument()
    expect(screen.getByText('Clear All')).toBeInTheDocument()
  })

  it('should display pagination when there are multiple pages', () => {
    const largeData = {
      ...mockNewsData,
      total: 20,
      pageSize: 4
    }
    
    mockUseSWR.mockReturnValue({
      data: largeData,
      isLoading: false,
      error: undefined
    })

    render(<NewsClient initialUrl="/api/news" initialData={largeData} />)
    
    // Check for pagination controls (previous/next buttons)
    expect(screen.getByText(/Previous/i) || screen.getByText(/Next/i)).toBeTruthy()
  })

  it('should render news cards with correct structure', () => {
    render(<NewsClient initialUrl="/api/news" initialData={mockNewsData} />)
    
    // Check that news articles are rendered as cards
    expect(screen.getByText('iPhone 15 Pro Review')).toBeInTheDocument()
    expect(screen.getByText('Samsung Galaxy S24 Launch')).toBeInTheDocument()
  })

  it('should handle empty news data', () => {
    const emptyData = {
      items: [],
      total: 0,
      page: 1,
      pageSize: 4,
      personalized: false
    }
    
    mockUseSWR.mockReturnValue({
      data: emptyData,
      isLoading: false,
      error: undefined
    })

    render(<NewsClient initialUrl="/api/news" initialData={emptyData} />)
    
    expect(screen.getByText('Latest News')).toBeInTheDocument()
    // No news articles should be displayed
    expect(screen.queryByText('iPhone 15 Pro Review')).not.toBeInTheDocument()
  })

  it('should display navigation state when navigating', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined
    })

    render(<NewsClient initialUrl="/api/news" initialData={mockNewsData} />)
    
    // Should show loading when isNavigating is true
    expect(screen.getByText('Loading news...')).toBeInTheDocument()
  })
})



