import { render, screen, waitFor } from '@testing-library/react'
import ReviewsClient from '../reviews-client'

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn()
}))

const mockUseSWR = require('swr').default

// Mock fetcher
jest.mock('@/lib/fetcher', () => ({
  jsonFetcher: jest.fn()
}))

// Mock Next.js Link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

const mockReviewData = {
  items: [
    {
      id: '1',
      slug: 'iphone-15-pro-review',
      title: 'iPhone 15 Pro Review',
      rating: 4.5,
      pros: ['Excellent build quality', 'Outstanding camera'],
      cons: ['Expensive', 'Limited storage'],
      excerpt: 'The iPhone 15 Pro delivers exceptional performance',
      publish_date: '2024-01-15T10:00:00Z',
      reviewedOn: '2024-01-15T10:00:00Z',
      author: {
        name: 'John Doe',
        verified: true,
        avatar: '/reviewer.jpg',
        title: 'Senior Tech Reviewer'
      },
      authorData: {
        name: 'John Doe',
        verified: true,
        avatarData: {
          url: '/reviewer.jpg',
          title: 'John Doe'
        },
        title: 'Senior Tech Reviewer'
      },
      phone: {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro'
      },
      images: {
        url: '/iphone-15.jpg',
        title: 'iPhone 15 Pro'
      },
      likes: 42,
      comments: 8
    },
    {
      id: '2',
      slug: 'galaxy-s24-review',
      title: 'Samsung Galaxy S24 Review',
      rating: 4.0,
      pros: ['Great display', 'Good battery'],
      cons: ['Software updates'],
      excerpt: 'Samsung\'s latest flagship delivers',
      publish_date: '2024-01-20T10:00:00Z',
      reviewedOn: '2024-01-20T10:00:00Z',
      author: {
        name: 'Jane Smith',
        verified: false,
        avatar: '/reviewer2.jpg',
        title: 'Tech Writer'
      },
      phone: {
        name: 'Galaxy S24',
        slug: 'galaxy-s24'
      },
      likes: 30,
      comments: 5
    }
  ],
  meta: {
    total: 2,
    page: 1,
    limit: 10,
    pages: 1
  }
}

const mockPhonesData = {
  phones: [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      company: 'Apple'
    },
    {
      id: '2',
      name: 'Galaxy S24',
      slug: 'galaxy-s24',
      company: 'Samsung'
    }
  ],
  total: 2
}

describe('ReviewsClient Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSWR.mockImplementation((key: string) => {
      if (key === '/api/reviews/phones') {
        return {
          data: mockPhonesData,
          isLoading: false,
          error: undefined
        }
      }
      return {
        data: mockReviewData,
        isLoading: false,
        error: undefined
      }
    })
  })

  it('should render without crashing', () => {
    render(<ReviewsClient initialUrl="/api/reviews" initialData={mockReviewData} />)
    
    expect(screen.getByText(/Review/i) || screen.getByText('iPhone 15 Pro Review')).toBeTruthy()
  })

  it('should display review articles', () => {
    render(<ReviewsClient initialUrl="/api/reviews" initialData={mockReviewData} />)
    
    expect(screen.getByText('iPhone 15 Pro Review')).toBeInTheDocument()
    expect(screen.getByText('Samsung Galaxy S24 Review')).toBeInTheDocument()
  })

  it('should display review ratings', () => {
    render(<ReviewsClient initialUrl="/api/reviews" initialData={mockReviewData} />)
    
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('4.0')).toBeInTheDocument()
  })

  it('should display pros and cons', () => {
    render(<ReviewsClient initialUrl="/api/reviews" initialData={mockReviewData} />)
    
    expect(screen.getByText('Excellent build quality')).toBeInTheDocument()
    expect(screen.getByText('Expensive')).toBeInTheDocument()
    expect(screen.getByText('Great display')).toBeInTheDocument()
  })

  it('should display author information', () => {
    render(<ReviewsClient initialUrl="/api/reviews" initialData={mockReviewData} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('should display verified purchase badge when author is verified', () => {
    render(<ReviewsClient initialUrl="/api/reviews" initialData={mockReviewData} />)
    
    expect(screen.getByText('Verified Purchase')).toBeInTheDocument()
  })

  it('should handle loading state', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined
    })

    render(<ReviewsClient initialUrl="/api/reviews" initialData={mockReviewData} />)
    
    expect(screen.getByText('Loading reviews...')).toBeInTheDocument()
  })

  it('should handle error state', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('API Error')
    })

    render(<ReviewsClient initialUrl="/api/reviews" initialData={mockReviewData} />)
    
    expect(screen.getByText('Error loading reviews: API Error')).toBeInTheDocument()
  })

  it('should display filter controls', () => {
    render(<ReviewsClient initialUrl="/api/reviews" initialData={mockReviewData} />)
    
    expect(screen.getByText('Filter by Phone')).toBeInTheDocument()
    expect(screen.getByText('Filter by Rating')).toBeInTheDocument()
    expect(screen.getByText('Apply Filters')).toBeInTheDocument()
  })

  it('should display phone information in reviews', () => {
    render(<ReviewsClient initialUrl="/api/reviews" initialData={mockReviewData} />)
    
    expect(screen.getByText('Reviewing:')).toBeInTheDocument()
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument()
  })

  it('should handle empty reviews data', () => {
    const emptyData = {
      items: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
      }
    }
    
    mockUseSWR.mockReturnValue({
      data: emptyData,
      isLoading: false,
      error: undefined
    })

    render(<ReviewsClient initialUrl="/api/reviews" initialData={emptyData} />)
    
    // Should still show filter controls
    expect(screen.getByText('Filter by Phone')).toBeInTheDocument()
  })
})



