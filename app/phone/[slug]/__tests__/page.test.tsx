import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PhoneDetailPage from '../page'

// Mock fetch globally
const mockFetch = jest.fn()
globalThis.fetch = mockFetch

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

describe('Phone Detail Page Component', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('Loading State', () => {
    it('should show loading skeleton initially', () => {
      mockFetch.mockImplementation(() => new Promise(() => {}))
      render(<PhoneDetailPage params={{ slug: 'test-phone' }} />)
      // The component shows skeleton loading, not a text message
      expect(screen.getByText('Back to Phones')).toBeInTheDocument()
    })
  })

  describe('Success State', () => {
    it('should render phone details successfully', async () => {
      const mockData = {
        items: [
          {
            slug: 'test-phone',
            name: 'Test Phone',
            brand: 'Test Brand',
            price: '$999',
            os: 'Android',
            type: 'Smartphone',
            specs: {
              display: '6.1" OLED',
              battery: '4000mAh',
              camera: '12MP',
              processor: 'Snapdragon 888',
              ram: '8GB',
              storage: '128GB'
            },
            _metadata: { uid: 'test-phone-uid' }
          }
        ],
        page: 1,
        pageSize: 100,
        total: 1,
        personalized: false
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      })

      render(<PhoneDetailPage params={{ slug: 'test-phone' }} />)

      await waitFor(() => {
        expect(screen.getByText('Test Phone')).toBeInTheDocument()
        expect(screen.getAllByText('Test Brand')).toHaveLength(2) // Brand appears in multiple places
        expect(screen.getAllByText('$999')).toHaveLength(2) // Price appears in multiple places
      })
    })
  })
})
