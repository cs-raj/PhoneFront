import { GET } from '../companies/route'
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

describe('Companies API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/companies', () => {
    it('should return companies data successfully', async () => {
      // Mock successful Contentstack response
      const mockCompaniesData = {
        entries: [
          {
            uid: 'company-1',
            title: 'Apple',
            slug: 'apple',
            description: 'Technology company known for innovative smartphones',
            company_logo: {
              url: '/apple-logo.png'
            }
          },
          {
            uid: 'company-2',
            title: 'Samsung',
            slug: 'samsung',
            description: 'South Korean technology company',
            company_logo: {
              url: '/samsung-logo.png'
            }
          }
        ],
        count: 2
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockCompaniesData)

      const request = new Request('http://localhost/api/companies', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toMatchObject({
        items: expect.any(Array),
        total: expect.any(Number),
        page: 1,
        pageSize: 100,
        personalized: false
      })
      expect(data.items.length).toBeGreaterThan(0)
    })

    it('should handle personalized content with variant param', async () => {
      // Mock successful Contentstack response
      const mockCompaniesData = {
        entries: [
          {
            uid: 'company-1',
            title: 'Apple',
            slug: 'apple',
            description: 'Technology company known for innovative smartphones'
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockCompaniesData)

      const request = new Request('http://localhost/api/companies?cs_personalize=exp_123_var_456', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.personalized).toBe(true)
      expect(data.variantParam).toBe('exp_123_var_456')
    })

    it('should handle fallback cs_variant parameter', async () => {
      // Mock successful Contentstack response with data
      const mockCompaniesData = {
        entries: [
          {
            uid: 'company-1',
            title: 'Apple',
            slug: 'apple',
            description: 'Technology company',
            phones: 42,
            created_at: '2020-01-15'
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockCompaniesData)

      const request = new Request('http://localhost/api/companies?cs_variant=fallback_variant', {
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
      // Mock successful Contentstack response with data
      const mockCompaniesData = {
        entries: [
          {
            uid: 'company-1',
            title: 'Apple',
            slug: 'apple',
            description: 'Technology company',
            phones: 42,
            created_at: '2020-01-15'
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockCompaniesData)

      const manifestValue = JSON.stringify({
        activeVariants: {
          'exp_123': 'var_456'
        }
      })

      const request = new Request('http://localhost/api/companies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `cs-personalize-manifest=${encodeURIComponent(manifestValue)}`
        }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // The companies API only sets personalized=true when Contentstack returns data AND there's a variant
      // Since we're not passing a variant parameter, it will use static data and personalized=false
      expect(data.personalized).toBe(false)
      expect(data.variantParam).toBeNull()
    })

    it('should handle query parameters correctly', async () => {
      // Mock successful Contentstack response
      const mockCompaniesData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockCompaniesData)

      const request = new Request('http://localhost/api/companies?page=2&pageSize=50&sortBy=phones', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.page).toBe(2)
      expect(data.pageSize).toBe(50)
    })

    it('should handle default parameters', async () => {
      // Mock successful Contentstack response
      const mockCompaniesData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockCompaniesData)

      const request = new Request('http://localhost/api/companies', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.page).toBe(1)
      expect(data.pageSize).toBe(100)
    })

    it('should return fallback data when Contentstack fails', async () => {
      // Mock Contentstack error
      ;(getAllEntries as jest.Mock).mockRejectedValue(mockContentstackResponses.error)

      const request = new Request('http://localhost/api/companies', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toBeDefined()
      expect(data.total).toBeDefined()
      expect(data.personalized).toBe(false)
    })

    it('should handle malformed manifest cookie gracefully', async () => {
      // Mock successful Contentstack response
      const mockCompaniesData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockCompaniesData)

      const request = new Request('http://localhost/api/companies', {
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
      const mockCompaniesData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockCompaniesData)

      const request = new Request('http://localhost/api/companies?cs_personalize=test_variant', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('companies', 'test_variant')
    })

    it('should call getAllEntries with undefined when no variant', async () => {
      // Mock successful Contentstack response
      const mockCompaniesData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockCompaniesData)

      const request = new Request('http://localhost/api/companies', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('companies', undefined)
    })

    it('should handle company data normalization', async () => {
      // Mock Contentstack response with company data
      const mockCompaniesData = {
        entries: [
          {
            uid: 'company-1',
            title: 'Apple',
            slug: 'apple',
            description: 'Technology company known for innovative smartphones',
            phones: 42,
            created_at: '2020-01-15',
            logo: {
              url: '/apple-logo.png',
              title: 'Apple Logo'
            }
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockCompaniesData)

      const request = new Request('http://localhost/api/companies', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items[0]).toMatchObject({
        name: 'Apple',
        slug: 'apple',
        description: 'Technology company known for innovative smartphones',
        phonesCount: 42
      })
    })
  })
})
