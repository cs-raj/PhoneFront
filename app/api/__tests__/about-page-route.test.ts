import { GET } from '../about_page/route'
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

describe('About Page API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/about_page', () => {
    it('should return about page data successfully', async () => {
      // Mock successful Contentstack response
      const mockAboutData = {
        entries: [
          {
            uid: 'about-page-uid',
            title: 'About PhoneFront',
            slug: 'about',
            description: 'Learn more about our mission and team',
            content: 'Full about page content here...',
            team: [
              {
                name: 'John Doe',
                role: 'CEO',
                bio: 'Founder and CEO of PhoneFront'
              }
            ],
            mission: 'To provide the best smartphone reviews and information',
            values: ['Transparency', 'Accuracy', 'User-first approach']
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockAboutData)

      const request = new Request('http://localhost/api/about_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toMatchObject({
        uid: 'about-page-uid',
        title: 'About PhoneFront',
        slug: 'about',
        description: 'Learn more about our mission and team',
        personalized: false,
        variantParam: null
      })
    })

    it('should handle personalized content with variant param', async () => {
      // Mock successful Contentstack response
      const mockAboutData = {
        entries: [
          {
            uid: 'about-page-uid',
            title: 'Personalized About Page',
            slug: 'about',
            description: 'Personalized about content'
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockAboutData)

      const request = new Request('http://localhost/api/about_page?cs_personalize=exp_123_var_456', {
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

      const request = new Request('http://localhost/api/about_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('No about page data found')
      expect(data.personalized).toBe(false)
      expect(data.variantParam).toBeNull()
      expect(data.timestamp).toBeDefined()
    })

    it('should handle Contentstack API errors', async () => {
      // Mock Contentstack error
      ;(getAllEntries as jest.Mock).mockRejectedValue(mockContentstackResponses.error)

      const request = new Request('http://localhost/api/about_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('No about page data found')
      expect(data.personalized).toBe(false)
      expect(data.variantParam).toBeNull()
    })

    it('should handle unexpected errors', async () => {
      // Mock unexpected error by making URL constructor throw
      const originalURL = global.URL
      global.URL = jest.fn().mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      const request = new Request('http://localhost/api/about_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.message).toBe('About page API error')
      expect(data.error).toBe('Unexpected error')
      expect(data.personalized).toBe(false)
      expect(data.timestamp).toBeDefined()

      // Restore original URL
      global.URL = originalURL
    })

    it('should call getAllEntries with correct parameters', async () => {
      // Mock successful Contentstack response
      const mockAboutData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockAboutData)

      const request = new Request('http://localhost/api/about_page?cs_personalize=test_variant', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('about_page', 'test_variant')
    })

    it('should call getAllEntries with undefined when no variant', async () => {
      // Mock successful Contentstack response
      const mockAboutData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockAboutData)

      const request = new Request('http://localhost/api/about_page', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('about_page', undefined)
    })
  })
})




