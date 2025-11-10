import { GET } from '../reviews/route'
import { getAllEntries } from '@/lib/contentstack-delivery'
import { mockContentstackResponses, createMockRequest } from '@/test-utils/api-mock-data'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
      headers: new Headers()
    }))
  }
}))

// Mock Contentstack Personalize SDK
jest.mock('@contentstack/personalize-edge-sdk', () => ({
  VARIANT_QUERY_PARAM: 'cs_personalize'
}))

// Mock Contentstack SDK
jest.mock('@/lib/contentstack-delivery', () => ({
  getAllEntries: jest.fn()
}))

// Mock console methods to avoid noise in tests
const originalConsoleLog = console.log
const originalConsoleError = console.error

beforeAll(() => {
  console.log = jest.fn()
  console.error = jest.fn()
})

afterAll(() => {
  console.log = originalConsoleLog
  console.error = originalConsoleError
})

describe('Reviews API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/reviews', () => {
    it('should return reviews data successfully', async () => {
      // Mock successful Contentstack response
      const mockReviewsData = {
        entries: [
          {
            uid: 'review-1',
            slug: 'iphone-15-pro-review',
            title: 'iPhone 15 Pro Review',
            rating: 4.5,
            pros: ['Great camera', 'Fast performance'],
            cons: ['Expensive', 'No headphone jack'],
            excerpt: 'A comprehensive review of the iPhone 15 Pro',
            content: 'Full review content here...',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            likes: 42,
            comments: 8,
            phone: [{
              uid: 'phone-1',
              title: 'iPhone 15 Pro',
              slug: 'iphone-15-pro',
              company: [{ uid: 'apple' }],
              images: { url: '/iphone-15-pro.jpg' }
            }],
            author: [{
              name: 'John Doe',
              title: 'Tech Reviewer',
              email: 'john@example.com',
              bio: 'Professional tech reviewer',
              avatar: {
                url: '/john-avatar.jpg',
                title: 'John Avatar'
              }
            }],
            images: {
              uid: 'img-1',
              url: '/review-image.jpg',
              title: 'Review Image',
              filename: 'review.jpg',
              content_type: 'image/jpeg',
              file_size: '1024'
            }
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockReviewsData)

      const request = new Request('http://localhost/api/reviews', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toMatchObject({
        items: expect.any(Array),
        meta: expect.objectContaining({
          total: expect.any(Number),
          page: expect.any(Number),
          limit: expect.any(Number),
          pages: expect.any(Number),
          personalized: false,
          variantParam: null
        })
      })
      expect(data.items.length).toBeGreaterThan(0)
      expect(data.items[0]).toMatchObject({
        id: 'review-1',
        slug: 'iphone-15-pro-review',
        title: 'iPhone 15 Pro Review',
        rating: 4.5,
        pros: ['Great camera', 'Fast performance'],
        cons: ['Expensive', 'No headphone jack']
      })
    })

    it('should handle personalized content with variant param', async () => {
      // Mock successful Contentstack response
      const mockReviewsData = {
        entries: [
          {
            uid: 'review-1',
            slug: 'personalized-review',
            title: 'Personalized Review',
            rating: 4.0,
            pros: ['Good features'],
            cons: ['Some issues'],
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            phone: [],
            author: []
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockReviewsData)

      const request = new Request('http://localhost/api/reviews?cs_personalize=exp_123_var_456', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.meta.personalized).toBe(true)
      expect(data.meta.variantParam).toBe('exp_123_var_456')
    })

    it('should handle phone filtering', async () => {
      // Mock successful Contentstack response
      const mockReviewsData = {
        entries: [
          {
            uid: 'review-1',
            slug: 'iphone-review',
            title: 'iPhone Review',
            rating: 4.5,
            pros: ['Great camera'],
            cons: ['Expensive'],
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            phone: [{
              uid: 'phone-1',
              title: 'iPhone 15 Pro',
              slug: 'iphone-15-pro',
              company: [{ uid: 'apple' }],
              images: { url: '/iphone.jpg' }
            }],
            author: []
          },
          {
            uid: 'review-2',
            slug: 'samsung-review',
            title: 'Samsung Review',
            rating: 4.0,
            pros: ['Good display'],
            cons: ['Bloatware'],
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            phone: [{
              uid: 'phone-2',
              title: 'Samsung Galaxy S24',
              slug: 'samsung-galaxy-s24',
              company: [{ uid: 'samsung' }],
              images: { url: '/samsung.jpg' }
            }],
            author: []
          }
        ],
        count: 2
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockReviewsData)

      const request = new Request('http://localhost/api/reviews?phone=iphone-15-pro', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toHaveLength(1)
      expect(data.items[0].phoneSlug).toBe('iphone-15-pro')
    })

    it('should handle rating filtering', async () => {
      // Mock successful Contentstack response
      const mockReviewsData = {
        entries: [
          {
            uid: 'review-1',
            slug: 'high-rating-review',
            title: 'High Rating Review',
            rating: 5.0,
            pros: ['Excellent'],
            cons: [],
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            phone: [],
            author: []
          },
          {
            uid: 'review-2',
            slug: 'low-rating-review',
            title: 'Low Rating Review',
            rating: 2.0,
            pros: [],
            cons: ['Poor quality'],
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            phone: [],
            author: []
          }
        ],
        count: 2
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockReviewsData)

      const request = new Request('http://localhost/api/reviews?rating=5', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toHaveLength(1)
      expect(data.items[0].rating).toBe(5.0)
    })

    it('should handle pagination', async () => {
      // Mock successful Contentstack response
      const mockReviewsData = {
        entries: Array.from({ length: 5 }, (_, i) => ({
          uid: `review-${i + 1}`,
          slug: `review-${i + 1}`,
          title: `Review ${i + 1}`,
          rating: 4.0,
          pros: ['Good'],
          cons: ['Some issues'],
          publish_date: '2024-01-15T10:00:00Z',
          created_at: '2024-01-15T10:00:00Z',
          phone: [],
          author: []
        })),
        count: 5
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockReviewsData)

      const request = new Request('http://localhost/api/reviews?page=2&limit=2', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.meta.page).toBe(2)
      expect(data.meta.limit).toBe(2)
      expect(data.meta.total).toBe(5)
      expect(data.meta.pages).toBe(3)
      expect(data.items).toHaveLength(2)
    })

    it('should handle default parameters', async () => {
      // Mock successful Contentstack response
      const mockReviewsData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockReviewsData)

      const request = new Request('http://localhost/api/reviews', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.meta.page).toBe(1)
      expect(data.meta.limit).toBe(12) // Empty response uses hardcoded limit
    })

    it('should return empty response when no reviews found', async () => {
      // Mock empty Contentstack response
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContentstackResponses.empty)

      const request = new Request('http://localhost/api/reviews', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toEqual([])
      expect(data.meta.total).toBe(0)
    })

    it('should handle Contentstack API errors', async () => {
      // Mock Contentstack error
      ;(getAllEntries as jest.Mock).mockRejectedValue(mockContentstackResponses.error)

      const request = new Request('http://localhost/api/reviews', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toEqual([])
      expect(data.meta.total).toBe(0)
    })

    it('should handle unexpected errors', async () => {
      // Mock getAllEntries to throw an error outside the try-catch
      ;(getAllEntries as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      const request = new Request('http://localhost/api/reviews', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toEqual([])
      expect(data.meta.total).toBe(0)
      // The error is caught by Contentstack try-catch, so personalized and error fields are not set
      expect(data.meta.personalized).toBeUndefined()
      expect(data.meta.error).toBeUndefined()
    })

    it('should call getAllEntries with correct parameters', async () => {
      // Mock successful Contentstack response
      const mockReviewsData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockReviewsData)

      const request = new Request('http://localhost/api/reviews?cs_personalize=test_variant', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('reviews', 'test_variant')
    })

    it('should call getAllEntries with undefined when no variant', async () => {
      // Mock successful Contentstack response
      const mockReviewsData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockReviewsData)

      const request = new Request('http://localhost/api/reviews', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('reviews', undefined)
    })

    it('should handle review data normalization', async () => {
      // Mock Contentstack response with review data
      const mockReviewsData = {
        entries: [
          {
            uid: 'review-1',
            slug: 'test-review',
            title: 'Test Review',
            rating: 4.5,
            pros: ['Great features'],
            cons: ['Some issues'],
            excerpt: 'This is a test review',
            content: 'Full review content',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            likes: 25,
            comments: 5,
            phone: [{
              uid: 'phone-1',
              title: 'Test Phone',
              slug: 'test-phone',
              company: [{ uid: 'test-company' }],
              images: { url: '/test-phone.jpg' }
            }],
            author: [{
              name: 'Jane Doe',
              title: 'Tech Reviewer',
              email: 'jane@example.com',
              bio: 'Professional reviewer',
              avatar: {
                url: '/jane-avatar.jpg',
                title: 'Jane Avatar'
              }
            }],
            images: {
              uid: 'img-1',
              url: '/review-image.jpg',
              title: 'Review Image',
              filename: 'review.jpg',
              content_type: 'image/jpeg',
              file_size: '2048'
            }
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockReviewsData)

      const request = new Request('http://localhost/api/reviews', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items[0]).toMatchObject({
        id: 'review-1',
        slug: 'test-review',
        title: 'Test Review',
        rating: 4.5,
        pros: ['Great features'],
        cons: ['Some issues'],
        excerpt: 'This is a test review',
        content: 'Full review content',
        likes: 25,
        comments: 5,
        phoneId: 'phone-1',
        phoneName: 'Test Phone',
        phoneSlug: 'test-phone',
        phone: {
          uid: 'phone-1',
          name: 'Test Phone',
          slug: 'test-phone',
          brand: 'test-company',
          image: '/test-phone.jpg'
        },
        author: {
          name: 'Jane Doe',
          verified: false,
          avatar: '/jane-avatar.jpg',
          title: 'Tech Reviewer',
          bio: 'Professional reviewer',
          email: 'jane@example.com',
          avatarData: {
            url: '/jane-avatar.jpg',
            title: 'Jane Avatar'
          }
        },
        authorData: {
          name: 'Jane Doe',
          verified: false,
          avatar: '/jane-avatar.jpg',
          title: 'Tech Reviewer',
          bio: 'Professional reviewer',
          email: 'jane@example.com',
          avatarData: {
            url: '/jane-avatar.jpg',
            title: 'Jane Avatar'
          }
        },
        images: {
          uid: 'img-1',
          url: '/review-image.jpg',
          title: 'Review Image',
          filename: 'review.jpg',
          content_type: 'image/jpeg',
          file_size: '2048'
        }
      })
    })

    it('should handle reviews without phone or author data', async () => {
      // Mock Contentstack response with minimal review data
      const mockReviewsData = {
        entries: [
          {
            uid: 'review-1',
            slug: 'minimal-review',
            title: 'Minimal Review',
            rating: 3.0,
            pros: ['Basic features'],
            cons: ['Limited functionality'],
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            phone: [],
            author: []
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockReviewsData)

      const request = new Request('http://localhost/api/reviews', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items[0]).toMatchObject({
        id: 'review-1',
        slug: 'minimal-review',
        title: 'Minimal Review',
        rating: 3.0,
        phoneId: undefined,
        phoneName: undefined,
        phoneSlug: undefined,
        phone: undefined,
        author: undefined,
        authorData: undefined
      })
    })
  })
})
