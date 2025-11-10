import { GET } from '../home_page/route'
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

describe('Home Page API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/home_page', () => {
    it('should return home page data successfully', async () => {
      // Mock successful Contentstack response
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContentstackResponses.success('home_page'))

      const request = createMockRequest('http://localhost/api/home_page')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toMatchObject({
        title: 'PhoneFront - Your Trusted Smartphone Guide',
        locale: 'en-us',
        personalized: false,
        variantParam: null
      })
      expect(data.hero_section).toBeDefined()
      expect(data.featured_news_section).toBeDefined()
      expect(data.latest_phones_section).toBeDefined()
    })

    it('should handle personalized content with variant param', async () => {
      // Mock successful Contentstack response
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContentstackResponses.success('home_page'))

      const request = createMockRequest('http://localhost/api/home_page', 'exp_123_var_456')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.personalized).toBe(true)
      expect(data.variantParam).toBe('exp_123_var_456')
    })

    it('should handle fallback cs_variant parameter', async () => {
      // Mock successful Contentstack response
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContentstackResponses.success('home_page'))

      const request = new Request('http://localhost/api/home_page?cs_variant=fallback_variant', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.personalized).toBe(true)
      expect(data.variantParam).toBe('fallback_variant')
    })

    it('should handle manifest cookie fallback', async () => {
      // Mock successful Contentstack response
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContentstackResponses.success('home_page'))

      const manifestValue = JSON.stringify({
        activeVariants: {
          'exp_123': 'var_456'
        }
      })

      const request = new Request('http://localhost/api/home_page?cs_variant=0_null', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `cs-personalize-manifest=${encodeURIComponent(manifestValue)}`
        }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.personalized).toBe(true)
      expect(data.variantParam).toBe('0_null')
    })

    it('should return 404 when no data found', async () => {
      // Mock empty Contentstack response
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContentstackResponses.empty)

      const request = createMockRequest('http://localhost/api/home_page')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toMatchObject({
        message: 'No home page data found',
        personalized: false,
        variantParam: null
      })
    })

    it('should handle Contentstack API errors', async () => {
      // Mock Contentstack error
      ;(getAllEntries as jest.Mock).mockRejectedValue(mockContentstackResponses.error)

      const request = createMockRequest('http://localhost/api/home_page')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toMatchObject({
        message: 'Home page API error',
        error: 'Contentstack API error'
      })
    })

    it('should handle malformed manifest cookie gracefully', async () => {
      // Mock successful Contentstack response
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContentstackResponses.success('home_page'))

      const request = new Request('http://localhost/api/home_page', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'cs-personalize-manifest=invalid-json'
        }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.personalized).toBe(false)
      expect(data.variantParam).toBeNull()
    })

    it('should handle null variant param in manifest', async () => {
      // Mock successful Contentstack response
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContentstackResponses.success('home_page'))

      const request = new Request('http://localhost/api/home_page?cs_variant=0_null', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'cs-personalize-manifest=' + encodeURIComponent(JSON.stringify({
            activeVariants: {}
          }))
        }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.personalized).toBe(true)
      expect(data.variantParam).toBe('0_null')
    })

    it('should call getAllEntries with correct parameters', async () => {
      // Mock successful Contentstack response
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContentstackResponses.success('home_page'))

      const request = createMockRequest('http://localhost/api/home_page', 'test_variant')
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('home_page', 'test_variant')
    })

    it('should call getAllEntries with undefined when no variant', async () => {
      // Mock successful Contentstack response
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContentstackResponses.success('home_page'))

      const request = createMockRequest('http://localhost/api/home_page')
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('home_page', undefined)
    })
  })
})
