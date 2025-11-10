import { GET } from '../contact_page/route'
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

describe('Contact Page API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/contact_page', () => {
    it('should return contact page data successfully', async () => {
      // Mock successful Contentstack response
      const mockContactData = {
        entries: [
          {
            uid: 'contact-page-uid',
            title: 'Contact PhoneFront',
            slug: 'contact',
            description: 'Get in touch with our team',
            content: 'Full contact page content here...',
            contact_info: {
              email: 'contact@phonefront.com',
              phone: '+1-555-0123',
              address: '123 Tech Street, Silicon Valley, CA'
            },
            social_links: [
              { platform: 'Twitter', url: 'https://twitter.com/phonefront' },
              { platform: 'LinkedIn', url: 'https://linkedin.com/company/phonefront' }
            ]
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContactData)

      const request = new Request('http://localhost/api/contact_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toMatchObject({
        uid: 'contact-page-uid',
        title: 'Contact PhoneFront',
        slug: 'contact',
        description: 'Get in touch with our team',
        personalized: false,
        variantParam: null
      })
    })

    it('should handle personalized content with variant param', async () => {
      // Mock successful Contentstack response
      const mockContactData = {
        entries: [
          {
            uid: 'contact-page-uid',
            title: 'Personalized Contact Page',
            slug: 'contact',
            description: 'Personalized contact content'
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContactData)

      const request = new Request('http://localhost/api/contact_page?cs_personalize=exp_123_var_456', {
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

      const request = new Request('http://localhost/api/contact_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('No contact page data found')
      expect(data.personalized).toBe(false)
      expect(data.variantParam).toBeNull()
      expect(data.timestamp).toBeDefined()
    })

    it('should handle Contentstack API errors', async () => {
      // Mock Contentstack error
      ;(getAllEntries as jest.Mock).mockRejectedValue(mockContentstackResponses.error)

      const request = new Request('http://localhost/api/contact_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('No contact page data found')
      expect(data.personalized).toBe(false)
      expect(data.variantParam).toBeNull()
    })

    it('should handle unexpected errors', async () => {
      // Mock unexpected error by making URL constructor throw
      const originalURL = global.URL
      global.URL = jest.fn().mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      const request = new Request('http://localhost/api/contact_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('Contact page API error')
      expect(data.error).toBe('Unexpected error')
      expect(data.personalized).toBe(false)
      expect(data.timestamp).toBeDefined()

      // Restore original URL
      global.URL = originalURL
    })

    it('should call getAllEntries with correct parameters', async () => {
      // Mock successful Contentstack response
      const mockContactData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContactData)

      const request = new Request('http://localhost/api/contact_page?cs_personalize=test_variant', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('contact_page', 'test_variant')
    })

    it('should call getAllEntries with undefined when no variant', async () => {
      // Mock successful Contentstack response
      const mockContactData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContactData)

      const request = new Request('http://localhost/api/contact_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('contact_page', undefined)
    })
  })
})




