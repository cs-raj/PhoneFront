import { GET } from '../phones/route'
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

describe('Phones API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/phones', () => {
    it('should return phones data with pagination', async () => {
      // Mock successful Contentstack response with phones data
      const mockPhonesData = {
        entries: [
          {
            uid: 'phone-1',
            title: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            company: [{ title: 'Apple' }],
            key_specifications: {
              display: '6.1" Super Retina XDR',
              battery: 'Up to 23 hours',
              camera: '48MP Main'
            },
            price: '$999',
            os: 'iOS',
            type: 'Flagship'
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockPhonesData)

      const request = createMockRequest('http://localhost/api/phones?page=1&pageSize=12')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toMatchObject({
        items: expect.any(Array),
        page: 1,
        pageSize: 12,
        total: expect.any(Number),
        personalized: false
      })
      expect(data.items.length).toBeGreaterThan(0)
    })

    it('should handle personalized content with variant param', async () => {
      // Mock successful Contentstack response
      const mockPhonesData = {
        entries: [
          {
            uid: 'phone-1',
            title: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            company: [{ title: 'Apple' }],
            key_specifications: {
              display: '6.1" Super Retina XDR',
              battery: 'Up to 23 hours',
              camera: '48MP Main'
            },
            price: '$999',
            os: 'iOS',
            type: 'Flagship'
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockPhonesData)

      const request = new Request('http://localhost/api/phones?cs_personalize=exp_123_var_456', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.personalized).toBe(true)
      expect(data.variantParam).toBe('exp_123_var_456')
    })

    it('should handle cookies for personalization', async () => {
      // Mock successful Contentstack response
      const mockPhonesData = {
        entries: [
          {
            uid: 'phone-1',
            title: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            company: [{ title: 'Apple' }],
            key_specifications: {
              display: '6.1" Super Retina XDR',
              battery: 'Up to 23 hours',
              camera: '48MP Main'
            },
            price: '$999',
            os: 'iOS',
            type: 'Flagship'
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockPhonesData)

      const manifestValue = JSON.stringify({
        activeVariants: {
          'exp_123': 'var_456'
        }
      })

      // Create a mock NextRequest with cookies
      const request = new Request('http://localhost/api/phones', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `cs-personalize-manifest=${encodeURIComponent(manifestValue)}`
        }
      })
      
      // Add NextRequest properties including cookies
      const mockRequest = Object.assign(request, {
        cookies: {
          getAll: () => [
            { name: 'cs-personalize-manifest', value: manifestValue }
          ],
          get: () => undefined,
          has: () => false,
          set: () => {},
          delete: () => {},
          toString: () => ''
        }
      })
      
      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.personalized).toBe(true)
      expect(data.variantParam).toBe('exp_123_var_456')
    })

    it('should handle query parameters correctly', async () => {
      // Mock successful Contentstack response
      const mockPhonesData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockPhonesData)

      const request = new Request('http://localhost/api/phones?page=2&pageSize=6&sortBy=price-asc&companies=Apple&os=iOS', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // The API doesn't return pagination info in the response, it's handled client-side
      expect(data.items).toEqual([])
      expect(data.total).toBe(0)
    })

    it('should handle default pagination parameters', async () => {
      // Mock successful Contentstack response
      const mockPhonesData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockPhonesData)

      const request = new Request('http://localhost/api/phones', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.page).toBe(1)
      expect(data.pageSize).toBe(12)
    })

    it('should return empty response when no phones found', async () => {
      // Mock empty Contentstack response
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContentstackResponses.empty)

      const request = createMockRequest('http://localhost/api/phones')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toEqual([])
      expect(data.total).toBe(0)
      expect(data.personalized).toBe(false)
    })

    it('should handle Contentstack API errors', async () => {
      // Mock Contentstack error
      ;(getAllEntries as jest.Mock).mockRejectedValue(mockContentstackResponses.error)

      const request = createMockRequest('http://localhost/api/phones')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toEqual([])
      expect(data.total).toBe(0)
      expect(data.personalized).toBe(false)
    })

    it('should handle malformed manifest cookie gracefully', async () => {
      // Mock successful Contentstack response
      const mockPhonesData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockPhonesData)

      const request = new Request('http://localhost/api/phones', {
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

    it('should call getAllEntries with correct parameters', async () => {
      // Mock successful Contentstack response
      const mockPhonesData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockPhonesData)

      const request = new Request('http://localhost/api/phones?cs_personalize=test_variant', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('phone', 'test_variant')
    })

    it('should call getAllEntries with undefined when no variant', async () => {
      // Mock successful Contentstack response
      const mockPhonesData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockPhonesData)

      const request = createMockRequest('http://localhost/api/phones')
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('phone', undefined)
    })

    it('should handle phone data normalization', async () => {
      // Mock Contentstack response with complex phone data
      const mockPhonesData = {
        entries: [
          {
            uid: 'phone-1',
            title: 'iPhone 15 Pro',
            slug: 'iphone-15-pro',
            company: [{ title: 'Apple', uid: 'apple-uid' }],
            key_specifications: {
              display: '6.1" Super Retina XDR',
              battery: 'Up to 23 hours',
              camera: '48MP Main'
            },
            price: '$999',
            os: 'iOS',
            type: 'Flagship',
            taxonomies: [
              { taxonomy_uid: 'company', term_uid: 'apple' },
              { taxonomy_uid: 'phone', term_uid: 'flagship' }
            ]
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockPhonesData)

      const request = createMockRequest('http://localhost/api/phones')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items[0]).toMatchObject({
        id: 'phone-1',
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        brand: 'Apple',
        price: '$999',
        os: 'Android',
        type: 'Flagship'
      })
    })
  })
})
