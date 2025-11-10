import { render, screen } from '@testing-library/react'
import NewsArticleDetailPage from '../page'

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, style, className }: any) => (
    <img src={src} alt={alt} className={className} style={style} />
  )
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => [])
  }))
}))

// Mock AuthorCard component
jest.mock('@/components/author-card', () => ({
  __esModule: true,
  default: ({ author }: any) => (
    <div data-testid="author-card">
      <div>{author.name}</div>
      <div>{author.email}</div>
    </div>
  )
}))

// Mock fetch
global.fetch = jest.fn()

describe('NewsArticleDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render news article when found', async () => {
    const mockNewsData = {
      items: [
        {
          id: '1',
          title: 'iPhone 15 Pro Review',
          excerpt: 'Comprehensive review',
          slug: 'iphone-15-pro-review',
          imageUrl: '/news/iphone-15.jpg',
          imageAlt: 'iPhone 15 Pro',
          category: 'Reviews',
          dateISO: '2024-01-15T10:00:00Z',
          datePretty: 'January 15, 2024',
          badge: 'Breaking',
          author: 'John Doe',
          authorData: {
            name: 'John Doe',
            email: 'john@phonefront.com'
          },
          body: '<p>Review content</p>',
          viewCount: 1000,
          commentCount: 50
        }
      ],
      total: 1
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewsData
    })

    const page = await NewsArticleDetailPage({ params: Promise.resolve({ slug: 'iphone-15-pro-review' }) })
    const { container } = render(page)

    expect(screen.getByText('iPhone 15 Pro Review')).toBeInTheDocument()
  })

  it('should display not found when article does not exist', async () => {
    const mockNewsData = {
      items: [
        {
          id: '1',
          slug: 'other-article',
          title: 'Other Article'
        }
      ],
      total: 1
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewsData
    })

    const page = await NewsArticleDetailPage({ params: Promise.resolve({ slug: 'non-existent-article' }) })
    const { container } = render(page)

    expect(screen.getByText('News Article Not Found')).toBeInTheDocument()
  })

  it('should fetch news articles with cookies', async () => {
    const mockNewsData = {
      items: [],
      total: 0
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewsData
    })

    await NewsArticleDetailPage({ params: Promise.resolve({ slug: 'test-article' }) })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/news'),
      expect.objectContaining({
        next: { revalidate: 60 },
        headers: expect.objectContaining({
          Cookie: expect.any(String)
        })
      })
    )
  })

  it('should display article image when available', async () => {
    const mockNewsData = {
      items: [
        {
          id: '1',
          title: 'Test Article',
          slug: 'test-article',
          imageUrl: '/news/test.jpg',
          imageAlt: 'Test Image',
          category: 'News',
          dateISO: '2024-01-15T10:00:00Z',
          datePretty: 'January 15, 2024',
          author: 'John Doe',
          body: '<p>Content</p>'
        }
      ],
      total: 1
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewsData
    })

    const page = await NewsArticleDetailPage({ params: Promise.resolve({ slug: 'test-article' }) })
    const { container } = render(page)

    const image = container.querySelector('img[src="/news/test.jpg"]')
    expect(image).toBeInTheDocument()
  })

  it('should display author card when author data is available', async () => {
    const mockNewsData = {
      items: [
        {
          id: '1',
          title: 'Test Article',
          slug: 'test-article',
          imageUrl: '/news/test.jpg',
          imageAlt: 'Test Image',
          category: 'News',
          dateISO: '2024-01-15T10:00:00Z',
          datePretty: 'January 15, 2024',
          author: 'John Doe',
          authorData: {
            name: 'John Doe',
            email: 'john@phonefront.com',
            title: 'Tech Writer',
            bio: 'Expert writer',
            avatar: {
              url: '/avatar.jpg',
              title: 'John'
            }
          },
          body: '<p>Content</p>'
        }
      ],
      total: 1
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNewsData
    })

    const page = await NewsArticleDetailPage({ params: Promise.resolve({ slug: 'test-article' }) })
    const { container } = render(page)

    expect(screen.getByTestId('author-card')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    const page = await NewsArticleDetailPage({ params: Promise.resolve({ slug: 'test-article' }) })
    const { container } = render(page)

    expect(screen.getByText('News Article Not Found')).toBeInTheDocument()
  })

  it('should handle fetch errors', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const page = await NewsArticleDetailPage({ params: Promise.resolve({ slug: 'test-article' }) })
    const { container } = render(page)

    expect(screen.getByText('News Article Not Found')).toBeInTheDocument()
  })
})



