import { fetcher, buildQuery } from '../fetcher'

// Mock fetch
global.fetch = jest.fn()

describe('fetcher utility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetcher function', () => {
    it('should fetch data successfully', async () => {
      const mockData = { id: 1, name: 'Test' }
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await fetcher('/api/test')

      expect(global.fetch).toHaveBeenCalledWith('/api/test', { cache: 'no-store' })
      expect(result).toEqual(mockData)
    })

    it('should handle fetch errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
      })

      await expect(fetcher('/api/not-found')).rejects.toThrow('Request failed: 404')
    })

    it('should handle network errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      await expect(fetcher('/api/test')).rejects.toThrow('Network error')
    })

    it('should handle JSON parsing errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      await expect(fetcher('/api/test')).rejects.toThrow('Invalid JSON')
    })

    it('should use no-store cache policy', async () => {
      const mockData = { id: 1 }
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      await fetcher('/api/test')

      expect(global.fetch).toHaveBeenCalledWith('/api/test', { cache: 'no-store' })
    })
  })

  describe('buildQuery function', () => {
    it('should build query string with parameters', () => {
      const base = '/api/phones'
      const params = {
        page: 1,
        limit: 10,
        search: 'iPhone',
        sort: 'price-asc',
      }

      const result = buildQuery(base, params)

      expect(result).toBe('/api/phones?page=1&limit=10&search=iPhone&sort=price-asc')
    })

    it('should handle empty parameters', () => {
      const base = '/api/phones'
      const result = buildQuery(base, {})

      expect(result).toBe('/api/phones?')
    })

    it('should handle undefined parameters', () => {
      const base = '/api/phones'
      const result = buildQuery(base)

      expect(result).toBe('/api/phones')
    })

    it('should URL encode parameters', () => {
      const base = '/api/search'
      const params = {
        q: 'iPhone 15 Pro Max',
        category: 'smartphones',
      }

      const result = buildQuery(base, params)

      expect(result).toBe('/api/search?q=iPhone+15+Pro+Max&category=smartphones')
    })

    it('should handle special characters in parameters', () => {
      const base = '/api/filter'
      const params = {
        price: '100-500',
        brand: 'Samsung & Apple',
        features: '5G,WiFi,Bluetooth',
      }

      const result = buildQuery(base, params)

      expect(result).toBe('/api/filter?price=100-500&brand=Samsung+%26+Apple&features=5G%2CWiFi%2CBluetooth')
    })

    it('should handle boolean parameters', () => {
      const base = '/api/phones'
      const params = {
        inStock: true,
        featured: false,
        onSale: true,
      }

      const result = buildQuery(base, params)

      expect(result).toBe('/api/phones?inStock=true&featured=false&onSale=true')
    })

    it('should handle array parameters', () => {
      const base = '/api/phones'
      const params = {
        brands: ['Apple', 'Samsung', 'Google'],
        features: ['5G', 'Wireless Charging'],
      }

      const result = buildQuery(base, params)

      expect(result).toBe('/api/phones?brands=Apple%2CSamsung%2CGoogle&features=5G%2CWireless+Charging')
    })

    it('should handle null and undefined values', () => {
      const base = '/api/phones'
      const params = {
        search: 'iPhone',
        category: null,
        brand: undefined,
        limit: 10,
      }

      const result = buildQuery(base, params)

      expect(result).toBe('/api/phones?search=iPhone&limit=10')
    })

    it('should handle empty string values', () => {
      const base = '/api/phones'
      const params = {
        search: '',
        category: 'smartphones',
        brand: '',
      }

      const result = buildQuery(base, params)

      expect(result).toBe('/api/phones?category=smartphones')
    })

    it('should handle numeric parameters', () => {
      const base = '/api/phones'
      const params = {
        page: 1,
        limit: 20,
        minPrice: 100,
        maxPrice: 1000,
        rating: 4.5,
      }

      const result = buildQuery(base, params)

      expect(result).toBe('/api/phones?page=1&limit=20&minPrice=100&maxPrice=1000&rating=4.5')
    })
  })

  describe('Integration tests', () => {
    it('should work with fetcher and buildQuery together', async () => {
      const mockData = { phones: [] }
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const url = buildQuery('/api/phones', { page: 1, limit: 10 })
      const result = await fetcher(url)

      expect(global.fetch).toHaveBeenCalledWith('/api/phones?page=1&limit=10', { cache: 'no-store' })
      expect(result).toEqual(mockData)
    })

    it('should handle complex query parameters', async () => {
      const mockData = { results: [] }
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const params = {
        search: 'iPhone 15',
        brands: ['Apple', 'Samsung'],
        priceRange: '500-1000',
        features: ['5G', 'Wireless Charging'],
        sort: 'price-asc',
        page: 1,
        limit: 20,
        inStock: true,
      }

      const url = buildQuery('/api/phones/search', params)
      const result = await fetcher(url)

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/phones/search?search=iPhone+15&brands=Apple%2CSamsung&priceRange=500-1000&features=5G%2CWireless+Charging&sort=price-asc&page=1&limit=20&inStock=true',
        { cache: 'no-store' }
      )
      expect(result).toEqual(mockData)
    })
  })
})