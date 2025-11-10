import { GET } from '../phones/route'
import { getAllEntries } from '@/lib/contentstack-delivery'
import { createMockNextRequest } from '@/test-utils/api-route-mock-data'

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

const mockGetAllEntries = getAllEntries as jest.MockedFunction<typeof getAllEntries>

// Mock console methods
const originalConsoleError = console.error

beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalConsoleError
})

describe('/api/reviews/phones', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch phones successfully', async () => {
    // Arrange
    const mockPhonesData = {
      entries: [
        {
          uid: 'phone-1',
          title: 'iPhone 15 Pro',
          slug: 'iphone-15-pro',
          company: 'Apple',
          taxonomies: []
        },
        {
          uid: 'phone-2',
          title: 'Galaxy S24 Ultra',
          slug: 'galaxy-s24-ultra',
          company: [{ title: 'Samsung' }],
          taxonomies: []
        }
      ],
      count: 2
    }
    
    const request = createMockNextRequest('http://localhost:3000/api/reviews/phones')
    mockGetAllEntries.mockResolvedValue(mockPhonesData)

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(mockGetAllEntries).toHaveBeenCalledWith('phone')
    expect(response.status).toBe(200)
    expect(responseData.phones).toHaveLength(2)
    expect(responseData.total).toBe(2)
    expect(responseData.phones[0]).toEqual({
      id: 'phone-1',
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      company: 'Apple'
    })
  })

  it('should extract company from company field (string)', async () => {
    // Arrange
    const mockPhonesData = {
      entries: [
        {
          uid: 'phone-1',
          title: 'iPhone 15 Pro',
          slug: 'iphone-15-pro',
          company: 'Apple',
          taxonomies: []
        }
      ],
      count: 1
    }
    
    const request = createMockNextRequest('http://localhost:3000/api/reviews/phones')
    mockGetAllEntries.mockResolvedValue(mockPhonesData)

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(responseData.phones[0].company).toBe('Apple')
  })

  it('should extract company from company field (array with title)', async () => {
    // Arrange
    const mockPhonesData = {
      entries: [
        {
          uid: 'phone-1',
          title: 'Galaxy S24',
          slug: 'galaxy-s24',
          company: [{ title: 'Samsung' }],
          taxonomies: []
        }
      ],
      count: 1
    }
    
    const request = createMockNextRequest('http://localhost:3000/api/reviews/phones')
    mockGetAllEntries.mockResolvedValue(mockPhonesData)

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(responseData.phones[0].company).toBe('Samsung')
  })

  it('should extract company from company field (object with title)', async () => {
    // Arrange
    const mockPhonesData = {
      entries: [
        {
          uid: 'phone-1',
          title: 'Pixel 9',
          slug: 'pixel-9',
          company: { title: 'Google' },
          taxonomies: []
        }
      ],
      count: 1
    }
    
    const request = createMockNextRequest('http://localhost:3000/api/reviews/phones')
    mockGetAllEntries.mockResolvedValue(mockPhonesData)

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(responseData.phones[0].company).toBe('Google')
  })

  it('should extract company from taxonomies when company field is not available', async () => {
    // Arrange
    const mockPhonesData = {
      entries: [
        {
          uid: 'phone-1',
          title: 'OnePlus 13',
          slug: 'oneplus-13',
          company: null,
          taxonomies: [
            { taxonomy_uid: 'company', term_uid: 'oneplus' }
          ]
        }
      ],
      count: 1
    }
    
    const request = createMockNextRequest('http://localhost:3000/api/reviews/phones')
    mockGetAllEntries.mockResolvedValue(mockPhonesData)

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(responseData.phones[0].company).toBe('OnePlus')
  })

  it('should return Unknown company when no company data is available', async () => {
    // Arrange
    const mockPhonesData = {
      entries: [
        {
          uid: 'phone-1',
          title: 'Unknown Phone',
          slug: 'unknown-phone',
          company: null,
          taxonomies: []
        }
      ],
      count: 1
    }
    
    const request = createMockNextRequest('http://localhost:3000/api/reviews/phones')
    mockGetAllEntries.mockResolvedValue(mockPhonesData)

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(responseData.phones[0].company).toBe('Unknown')
  })

  it('should sort phones alphabetically by name', async () => {
    // Arrange
    const mockPhonesData = {
      entries: [
        {
          uid: 'phone-3',
          title: 'Z Phone',
          slug: 'z-phone',
          company: 'Unknown',
          taxonomies: []
        },
        {
          uid: 'phone-1',
          title: 'A Phone',
          slug: 'a-phone',
          company: 'Unknown',
          taxonomies: []
        },
        {
          uid: 'phone-2',
          title: 'M Phone',
          slug: 'm-phone',
          company: 'Unknown',
          taxonomies: []
        }
      ],
      count: 3
    }
    
    const request = createMockNextRequest('http://localhost:3000/api/reviews/phones')
    mockGetAllEntries.mockResolvedValue(mockPhonesData)

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(responseData.phones[0].name).toBe('A Phone')
    expect(responseData.phones[1].name).toBe('M Phone')
    expect(responseData.phones[2].name).toBe('Z Phone')
  })

  it('should filter out phones without required fields', async () => {
    // Arrange
    const mockPhonesData = {
      entries: [
        {
          uid: 'phone-1',
          title: 'Valid Phone',
          slug: 'valid-phone',
          company: 'Apple',
          taxonomies: []
        },
        {
          uid: 'phone-2',
          // Missing title
          slug: 'invalid-phone',
          company: 'Apple',
          taxonomies: []
        },
        {
          uid: 'phone-3',
          title: 'Another Valid Phone',
          // Missing slug
          company: 'Samsung',
          taxonomies: []
        }
      ],
      count: 3
    }
    
    const request = createMockNextRequest('http://localhost:3000/api/reviews/phones')
    mockGetAllEntries.mockResolvedValue(mockPhonesData)

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(responseData.phones).toHaveLength(1)
    expect(responseData.phones[0].name).toBe('Valid Phone')
  })

  it('should handle empty response', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/reviews/phones')
    mockGetAllEntries.mockResolvedValue({ entries: [], count: 0 })

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(responseData.phones).toEqual([])
    expect(responseData.total).toBe(0)
  })

  it('should handle null or undefined response', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/reviews/phones')
    mockGetAllEntries.mockResolvedValue(null as any)

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(200)
    expect(responseData.phones).toEqual([])
    expect(responseData.total).toBe(0)
  })

  it('should handle API errors', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/reviews/phones')
    mockGetAllEntries.mockRejectedValue(new Error('API error'))

    // Act
    const response = await GET(request)
    const responseData = await response.json()

    // Assert
    expect(response.status).toBe(500)
    expect(responseData.error).toBe('Failed to fetch phones')
  })
})



