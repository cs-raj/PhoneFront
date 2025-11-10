import { GET } from '../news/route'
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

describe('News API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/news', () => {
    it('should return news data successfully', async () => {
      // Mock successful Contentstack response
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'iphone-16-launch',
            title: 'iPhone 16 Launch Announced',
            excerpt: 'Apple announces the latest iPhone with new features',
            body: 'Full article content here...',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            featured_image: {
              url: '/iphone-16-image.jpg',
              title: 'iPhone 16 Image'
            },
            author: [{
              title: 'John Doe',
              name: 'John Doe',
              email: 'john@example.com',
              bio: 'Tech journalist',
              avatar: {
                url: '/john-avatar.jpg',
                title: 'John Avatar'
              }
            }],
            taxonomies: [
              { taxonomy_uid: 'news', term_uid: 'launches' },
              { taxonomy_uid: 'company', term_uid: 'apple' }
            ],
            breaking_news: false
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toMatchObject({
        items: expect.any(Array),
        total: expect.any(Number),
        personalized: false,
        variantParam: null
      })
      expect(data.items.length).toBeGreaterThan(0)
      expect(data.items[0]).toMatchObject({
        id: 'news-1',
        slug: 'iphone-16-launch',
        title: 'iPhone 16 Launch Announced',
        excerpt: 'Apple announces the latest iPhone with new features',
        href: '/news/iphone-16-launch',
        category: 'Launches'
      })
    })

    it('should handle personalized content with variant param', async () => {
      // Mock successful Contentstack response
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'personalized-news',
            title: 'Personalized News Article',
            excerpt: 'This is personalized content',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?cs_personalize=exp_123_var_456', {
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
      // Mock successful Contentstack response
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'fallback-news',
            title: 'Fallback News Article',
            excerpt: 'This uses fallback variant',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?cs_variant=fallback_variant', {
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
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'manifest-news',
            title: 'Manifest News Article',
            excerpt: 'This uses manifest cookie',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const manifestValue = JSON.stringify({
        activeVariants: {
          'exp_123': 'var_456'
        }
      })

      const request = new Request('http://localhost/api/news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `cs-personalize-manifest=${encodeURIComponent(manifestValue)}`
        }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // The news API only sets personalized=true when Contentstack returns data AND there's a variant
      // Since we're not passing a variant parameter, it will use static data and personalized=false
      expect(data.personalized).toBe(false)
      expect(data.variantParam).toBeNull()
    })

    it('should handle category filtering', async () => {
      // Mock successful Contentstack response
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'launch-news',
            title: 'Launch News',
            excerpt: 'This is a launch',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: [
              { taxonomy_uid: 'news', term_uid: 'launches' }
            ]
          },
          {
            uid: 'news-2',
            slug: 'rumor-news',
            title: 'Rumor News',
            excerpt: 'This is a rumor',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: [
              { taxonomy_uid: 'news', term_uid: 'rumors' }
            ]
          }
        ],
        count: 2
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?category=launches', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toHaveLength(1)
      expect(data.items[0].category).toBe('Launches')
    })

    it('should handle multiple category filtering', async () => {
      // Mock successful Contentstack response
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'launch-news',
            title: 'Launch News',
            excerpt: 'This is a launch',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: [
              { taxonomy_uid: 'news', term_uid: 'launches' }
            ]
          },
          {
            uid: 'news-2',
            slug: 'rumor-news',
            title: 'Rumor News',
            excerpt: 'This is a rumor',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: [
              { taxonomy_uid: 'news', term_uid: 'rumors' }
            ]
          }
        ],
        count: 2
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?category=launches,rumors', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toHaveLength(2)
    })

    it('should handle sorting by latest (default)', async () => {
      // Mock successful Contentstack response with different dates
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'old-news',
            title: 'Old News',
            excerpt: 'This is old',
            publish_date: '2024-01-01T10:00:00Z',
            created_at: '2024-01-01T10:00:00Z',
            taxonomies: []
          },
          {
            uid: 'news-2',
            slug: 'new-news',
            title: 'New News',
            excerpt: 'This is new',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          }
        ],
        count: 2
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items[0].title).toBe('New News') // Latest first
      expect(data.items[1].title).toBe('Old News')
    })

    it('should handle sorting by oldest', async () => {
      // Mock successful Contentstack response with different dates
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'old-news',
            title: 'Old News',
            excerpt: 'This is old',
            publish_date: '2024-01-01T10:00:00Z',
            created_at: '2024-01-01T10:00:00Z',
            taxonomies: []
          },
          {
            uid: 'news-2',
            slug: 'new-news',
            title: 'New News',
            excerpt: 'This is new',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          }
        ],
        count: 2
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?sort=oldest', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items[0].title).toBe('Old News') // Oldest first
      expect(data.items[1].title).toBe('New News')
    })

    it('should handle pagination', async () => {
      // Mock successful Contentstack response
      const mockNewsData = {
        entries: Array.from({ length: 5 }, (_, i) => ({
          uid: `news-${i + 1}`,
          slug: `news-${i + 1}`,
          title: `News ${i + 1}`,
          excerpt: `Excerpt ${i + 1}`,
          publish_date: '2024-01-15T10:00:00Z',
          created_at: '2024-01-15T10:00:00Z',
          taxonomies: []
        })),
        count: 5
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?page=2&pageSize=2', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.page).toBe(2)
      expect(data.pageSize).toBe(2)
      expect(data.total).toBe(5)
      expect(data.items).toHaveLength(2)
    })

    it('should handle legacy limit parameter', async () => {
      // Mock successful Contentstack response
      const mockNewsData = {
        entries: Array.from({ length: 5 }, (_, i) => ({
          uid: `news-${i + 1}`,
          slug: `news-${i + 1}`,
          title: `News ${i + 1}`,
          excerpt: `Excerpt ${i + 1}`,
          publish_date: '2024-01-15T10:00:00Z',
          created_at: '2024-01-15T10:00:00Z',
          taxonomies: []
        })),
        count: 5
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?limit=3', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toHaveLength(3)
      expect(data.total).toBe(5)
      expect(data.page).toBeUndefined() // No pagination when using limit
    })

    it('should return empty response when no news found', async () => {
      // Mock empty Contentstack response
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockContentstackResponses.empty)

      const request = new Request('http://localhost/api/news', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
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

      const request = new Request('http://localhost/api/news', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toEqual([])
      expect(data.total).toBe(0)
      expect(data.personalized).toBe(false)
    })

    it('should handle unexpected errors', async () => {
      // Mock getAllEntries to throw an error outside the try-catch
      ;(getAllEntries as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      const request = new Request('http://localhost/api/news', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toEqual([])
      expect(data.total).toBe(0)
      expect(data.personalized).toBe(false)
      // The news API doesn't set an error field in the response, it just returns empty data
      expect(data.error).toBeUndefined()
    })

    it('should handle malformed manifest cookie gracefully', async () => {
      // Mock successful Contentstack response
      const mockNewsData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news', {
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
      const mockNewsData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?cs_personalize=test_variant', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('news', 'test_variant')
    })

    it('should call getAllEntries with undefined when no variant', async () => {
      // Mock successful Contentstack response
      const mockNewsData = {
        entries: [],
        count: 0
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      await GET(request)

      expect(getAllEntries).toHaveBeenCalledWith('news', undefined)
    })

    it('should handle priority filtering', async () => {
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'high-priority-news',
            title: 'High Priority News',
            excerpt: 'This is high priority',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: [
              { taxonomy_uid: 'news', term_uid: 'high-priority' }
            ]
          },
          {
            uid: 'news-2',
            slug: 'low-priority-news',
            title: 'Low Priority News',
            excerpt: 'This is low priority',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: [
              { taxonomy_uid: 'news', term_uid: 'low-priority' }
            ]
          }
        ],
        count: 2
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?priority=high-priority', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toHaveLength(1)
      expect(data.items[0].slug).toBe('high-priority-news')
    })

    it('should handle source filtering', async () => {
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'official-news',
            title: 'Official News',
            excerpt: 'This is from official source',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: [
              { taxonomy_uid: 'news', term_uid: 'official' }
            ]
          },
          {
            uid: 'news-2',
            slug: 'rumor-news',
            title: 'Rumor News',
            excerpt: 'This is a rumor',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: [
              { taxonomy_uid: 'news', term_uid: 'rumor' }
            ]
          }
        ],
        count: 2
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?source=official', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toHaveLength(1)
      expect(data.items[0].slug).toBe('official-news')
    })

    it('should handle company filtering', async () => {
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'apple-news',
            title: 'Apple News',
            excerpt: 'News about Apple',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: [
              { taxonomy_uid: 'company', term_uid: 'apple' }
            ]
          },
          {
            uid: 'news-2',
            slug: 'samsung-news',
            title: 'Samsung News',
            excerpt: 'News about Samsung',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: [
              { taxonomy_uid: 'company', term_uid: 'samsung' }
            ]
          }
        ],
        count: 2
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?company=apple', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toHaveLength(1)
      expect(data.items[0].slug).toBe('apple-news')
    })

    it('should handle sorting by popular', async () => {
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'low-views-news',
            title: 'Low Views News',
            excerpt: 'This has low views',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          },
          {
            uid: 'news-2',
            slug: 'high-views-news',
            title: 'High Views News',
            excerpt: 'This has high views',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          }
        ],
        count: 2
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?sort=popular', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // Popular sort uses viewCount, which defaults to 0, so order is maintained
      expect(data.items).toHaveLength(2)
    })

    it('should handle invalid page number (negative)', async () => {
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'test-news',
            title: 'Test News',
            excerpt: 'Test',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?page=-1', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.page).toBe(1) // Should default to 1
    })

    it('should handle invalid pageSize (zero)', async () => {
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'test-news',
            title: 'Test News',
            excerpt: 'Test',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?pageSize=0', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pageSize).toBe(1) // Should default to 1
    })

    it('should handle limit parameter with zero value', async () => {
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'test-news',
            title: 'Test News',
            excerpt: 'Test',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?limit=0', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toHaveLength(0) // Limit of 0 should return empty array
    })

    it('should handle multiple filter combinations', async () => {
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'filtered-news',
            title: 'Filtered News',
            excerpt: 'Matches all filters',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: [
              { taxonomy_uid: 'news', term_uid: 'launches' },
              { taxonomy_uid: 'company', term_uid: 'apple' }
            ]
          },
          {
            uid: 'news-2',
            slug: 'other-news',
            title: 'Other News',
            excerpt: 'Does not match',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: [
              { taxonomy_uid: 'news', term_uid: 'rumors' },
              { taxonomy_uid: 'company', term_uid: 'samsung' }
            ]
          }
        ],
        count: 2
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?category=launches&company=apple', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toHaveLength(1)
      expect(data.items[0].slug).toBe('filtered-news')
    })

    it('should handle news items without featured image', async () => {
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'no-image-news',
            title: 'News Without Image',
            excerpt: 'This has no image',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items[0].imageUrl).toBeNull()
      expect(data.items[0].imageAlt).toBe('News Without Image')
    })

    it('should handle news items without author', async () => {
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'no-author-news',
            title: 'News Without Author',
            excerpt: 'This has no author',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items[0].author).toBeUndefined()
      expect(data.items[0].authorData).toBeUndefined()
    })

    it('should handle news with empty taxonomies', async () => {
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'no-taxonomy-news',
            title: 'News Without Taxonomy',
            excerpt: 'This has no taxonomy',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news?category=launches', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toHaveLength(0) // Should be filtered out
    })

    it('should handle variant param with 0_null value', async () => {
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'test-news',
            title: 'Test News',
            excerpt: 'Test',
            publish_date: '2024-01-15T10:00:00Z',
            created_at: '2024-01-15T10:00:00Z',
            taxonomies: []
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const manifestValue = JSON.stringify({
        activeVariants: {
          'exp_123': 'var_456'
        }
      })

      const request = new Request('http://localhost/api/news?cs_personalize=0_null', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `cs-personalize-manifest=${encodeURIComponent(manifestValue)}`
        }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // Should extract variant from manifest cookie
      expect(data.items).toHaveLength(1)
    })

    it('should handle date formatting for different time ranges', async () => {
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const oneMonthAgo = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000)

      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'hour-ago-news',
            title: 'Hour Ago News',
            excerpt: 'Published an hour ago',
            publish_date: oneHourAgo.toISOString(),
            created_at: oneHourAgo.toISOString(),
            taxonomies: []
          },
          {
            uid: 'news-2',
            slug: 'day-ago-news',
            title: 'Day Ago News',
            excerpt: 'Published a day ago',
            publish_date: oneDayAgo.toISOString(),
            created_at: oneDayAgo.toISOString(),
            taxonomies: []
          },
          {
            uid: 'news-3',
            slug: 'month-ago-news',
            title: 'Month Ago News',
            excerpt: 'Published a month ago',
            publish_date: oneMonthAgo.toISOString(),
            created_at: oneMonthAgo.toISOString(),
            taxonomies: []
          }
        ],
        count: 3
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items[0].datePretty).toContain('hour')
      expect(data.items[1].datePretty).toContain('day')
      expect(data.items[2].datePretty).toMatch(/\w{3} \d{1,2}, \d{4}/) // Month format
    })

    it('should handle news data normalization and date formatting', async () => {
      // Mock Contentstack response with news data
      const mockNewsData = {
        entries: [
          {
            uid: 'news-1',
            slug: 'test-news',
            title: 'Test News Article',
            excerpt: 'This is a test article',
            body: 'Full article content',
            publish_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            featured_image: {
              url: '/test-image.jpg',
              title: 'Test Image'
            },
            author: [{
              title: 'Jane Doe',
              name: 'Jane Doe',
              email: 'jane@example.com',
              bio: 'Tech writer',
              avatar: {
                url: '/jane-avatar.jpg',
                title: 'Jane Avatar'
              }
            }],
            taxonomies: [
              { taxonomy_uid: 'news', term_uid: 'launches' },
              { taxonomy_uid: 'company', term_uid: 'apple' }
            ],
            breaking_news: true
          }
        ],
        count: 1
      }
      ;(getAllEntries as jest.Mock).mockResolvedValue(mockNewsData)

      const request = new Request('http://localhost/api/news', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items[0]).toMatchObject({
        id: 'news-1',
        slug: 'test-news',
        title: 'Test News Article',
        excerpt: 'This is a test article',
        body: 'Full article content',
        href: '/news/test-news',
        category: 'Launches',
        imageUrl: '/test-image.jpg',
        imageAlt: 'Test Image',
        badge: 'BREAKING',
        author: 'Jane Doe',
        authorData: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          bio: 'Tech writer',
          title: 'Jane Doe',
          avatar: {
            url: '/jane-avatar.jpg',
            title: 'Jane Avatar'
          }
        },
        taxonomies: {
          news: ['launches'],
          company: ['apple']
        }
      })
      expect(data.items[0].dateISO).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/) // ISO date format
      expect(data.items[0].datePretty).toMatch(/\d+ minute\(s\)? ago|0 minutes ago/) // Relative date format
    })
  })
})
