import { GET } from '../careers_page/route'
import { getAllEntries } from '@/lib/contentstack-delivery'
import { createMockNextRequest, mockContentstackDeliveryResponses } from '@/test-utils/api-route-mock-data'

// Mock the Contentstack Delivery SDK
jest.mock('@/lib/contentstack-delivery', () => ({
  getAllEntries: jest.fn()
}))

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data: any, init?: ResponseInit) => {
      return new Response(JSON.stringify(data), {
        status: init?.status || 200,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers
        }
      })
    })
  }
}))

// Mock Personalize SDK
jest.mock('@contentstack/personalize-edge-sdk', () => ({
  VARIANT_QUERY_PARAM: 'cs_personalize'
}))

const mockGetAllEntries = getAllEntries as jest.MockedFunction<typeof getAllEntries>

// Mock console methods
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

describe('/api/careers_page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch careers page data successfully', async () => {
    // Arrange
    const mockCareersData = {
      entries: [{
        uid: 'careers-1',
        title: 'Careers at PhoneFront',
        description: 'Join our team',
        sections: [
          {
            hero_section: {
              heading: 'Join Our Team',
              subheading: 'Build the future of mobile technology'
            }
          }
        ],
        locale: 'en-us',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      }],
      count: 1
    }
    
    const request = createMockNextRequest('http://localhost:3000/api/careers_page')
    mockGetAllEntries.mockResolvedValue(mockCareersData)

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(mockGetAllEntries).toHaveBeenCalledWith('careers_page', undefined)
    expect(response.status).toBe(200)
    expect(responseData).toEqual({
      ...mockCareersData.entries[0],
      personalized: false,
      variantParam: null
    })
  })

  it('should handle personalized requests', async () => {
    // Arrange
    const mockCareersData = {
      entries: [{
        uid: 'careers-1',
        title: 'Careers at PhoneFront',
        description: 'Join our team',
        sections: [],
        locale: 'en-us',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      }],
      count: 1
    }
    
    const request = createMockNextRequest('http://localhost:3000/api/careers_page', {
      searchParams: { cs_personalize: 'exp_123_var_456' }
    })
    mockGetAllEntries.mockResolvedValue(mockCareersData)

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(mockGetAllEntries).toHaveBeenCalledWith('careers_page', 'exp_123_var_456')
    expect(response.status).toBe(200)
    expect(responseData.personalized).toBe(true)
    expect(responseData.variantParam).toBe('exp_123_var_456')
  })

  it('should handle empty Contentstack response', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/careers_page')
    mockGetAllEntries.mockResolvedValue({ entries: [], count: 0 })

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(responseData).toEqual({
      message: 'No careers page data found',
      personalized: false,
      variantParam: null,
      timestamp: expect.any(String)
    })
  })

  it('should handle Contentstack API errors', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/careers_page')
    mockGetAllEntries.mockRejectedValue(new Error('Contentstack API error'))

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(responseData).toEqual({
      message: 'No careers page data found',
      personalized: false,
      variantParam: null,
      timestamp: expect.any(String)
    })
  })

  it('should handle unexpected errors', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/careers_page')
    mockGetAllEntries.mockRejectedValue('String error')

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(responseData).toEqual({
      message: 'Careers page API error',
      error: 'Unknown error',
      personalized: false,
      timestamp: expect.any(String)
    })
  })

  it('should handle Error objects in unexpected errors', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/careers_page')
    const error = new Error('Test error message')
    mockGetAllEntries.mockRejectedValue(error)

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(responseData).toEqual({
      message: 'Careers page API error',
      error: 'Test error message',
      personalized: false,
      timestamp: expect.any(String)
    })
  })
})



