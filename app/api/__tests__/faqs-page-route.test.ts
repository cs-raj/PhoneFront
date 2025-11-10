import { GET } from '../faqs_page/route'
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

describe('FAQs Page API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/faqs_page', () => {
    it('should return FAQs page data successfully', async () => {
      // Mock successful Contentstack response
      const mockFAQsData = {
        entries: [
          {
            uid: 'faqs-page-uid',
            title: 'Frequently Asked Questions',
            slug: 'faqs',
            description: 'Find answers to common questions about smartphones',
            content: 'Full FAQs page content here...',
            faqs: [
              {
                question: 'What is the best smartphone for photography?',
                answer: 'The iPhone 15 Pro and Samsung Galaxy S24 Ultra are excellent choices for photography.'
              },
              {
                question: 'How often should I update my phone?',
                answer: 'Most smartphones receive updates for 3-5 years, but it depends on the manufacturer.'
              }
            ],
            categories: ['General', 'Technical', 'Purchasing']
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockFAQsData)

      const request = new Request('http://localhost/api/faqs_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toMatchObject({
        uid: 'faqs-page-uid',
        title: 'Frequently Asked Questions',
        slug: 'faqs',
        description: 'Find answers to common questions about smartphones',
        personalized: false,
        variantParam: null
      })
    })

    it('should handle personalized content with variant param', async () => {
      // Mock successful Contentstack response
      const mockFAQsData = {
        entries: [
          {
            uid: 'faqs-page-uid',
            title: 'Personalized FAQs Page',
            slug: 'faqs',
            description: 'Personalized FAQs content'
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockFAQsData)

      const request = new Request('http://localhost/api/faqs_page?cs_personalize=exp_123_var_456', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.personalized).toBe(true)
      expect(data.variantParam).toBe('exp_123_var_456')
    })

    it('should return fallback message when no data found', async () => {
      // Mock empty Contentstack response
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContentstackResponses.empty)

      const request = new Request('http://localhost/api/faqs_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('No FAQs page data found')
      expect(data.personalized).toBe(false)
      expect(data.variantParam).toBeNull()
      expect(data.timestamp).toBeDefined()
    })

    it('should handle Contentstack API errors', async () => {
      // Mock Contentstack error
      ;(getAllEntries as jest.Mock).mockRejectedValue(mockContentstackResponses.error)

      const request = new Request('http://localhost/api/faqs_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('No FAQs page data found')
      expect(data.personalized).toBe(false)
      expect(data.variantParam).toBeNull()
    })

    it('should handle unexpected errors', async () => {
      // Mock unexpected error by making URL constructor throw
      const originalURL = global.URL
      global.URL = jest.fn().mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      const request = new Request('http://localhost/api/faqs_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('FAQs page API error')
      expect(data.error).toBe('Unexpected error')
      expect(data.personalized).toBe(false)
      expect(data.timestamp).toBeDefined()

      // Restore original URL
      global.URL = originalURL
    })

    it('should call getAllEntries with correct parameters', async () => {
      // Mock successful Contentstack response
      const mockFAQsData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockFAQsData)

      const request = new Request('http://localhost/api/faqs_page?cs_personalize=test_variant', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('faqs_page', 'test_variant')
    })

    it('should call getAllEntries with undefined when no variant', async () => {
      // Mock successful Contentstack response
      const mockFAQsData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockFAQsData)

      const request = new Request('http://localhost/api/faqs_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('faqs_page', undefined)
    })
  })
})




