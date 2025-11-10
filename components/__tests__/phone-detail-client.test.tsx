import { render, screen, waitFor } from '@testing-library/react'
import { PhoneDetailClient } from '../phone-detail-client'
import { mockPhone } from '../../test-utils/mock-data'

// Mock fetch
global.fetch = jest.fn()

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

describe('PhoneDetailClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading state initially', () => {
    render(<PhoneDetailClient slug="iphone-15-pro" />)
    
    // The component shows loading skeleton, not text
    expect(screen.getByText('Back to Phones')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should render phone details when data is loaded', async () => {
    const mockApiResponse = {
      items: [mockPhone],
      personalized: true,
      variantParam: 'test-variant'
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    render(<PhoneDetailClient slug="iphone-15-pro" />)
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument()
      expect(screen.getAllByText('Apple')).toHaveLength(2) // Multiple Apple elements
      expect(screen.getAllByText('$999')).toHaveLength(2) // Multiple price elements
    })
  })

  it('should display phone specifications', async () => {
    const mockApiResponse = {
      items: [mockPhone],
      personalized: true,
      variantParam: 'test-variant'
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    render(<PhoneDetailClient slug="iphone-15-pro" />)
    
    await waitFor(() => {
      expect(screen.getByText('6.1" Super Retina XDR')).toBeInTheDocument()
      expect(screen.getByText('Up to 23 hours video playback')).toBeInTheDocument()
      expect(screen.getByText('48MP Main, 12MP Ultra Wide, 12MP Telephoto')).toBeInTheDocument()
    })
  })

  it('should display phone features', async () => {
    const mockApiResponse = {
      items: [mockPhone],
      personalized: true,
      variantParam: 'test-variant'
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    render(<PhoneDetailClient slug="iphone-15-pro" />)
    
    await waitFor(() => {
      expect(screen.getByText('Titanium Design')).toBeInTheDocument()
      expect(screen.getByText('A17 Pro Chip')).toBeInTheDocument()
      expect(screen.getByText('Action Button')).toBeInTheDocument()
      expect(screen.getAllByText('USB-C')).toHaveLength(2) // Multiple USB-C elements
    })
  })

  it('should display phone highlights', async () => {
    const mockApiResponse = {
      items: [mockPhone],
      personalized: true,
      variantParam: 'test-variant'
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    render(<PhoneDetailClient slug="iphone-15-pro" />)
    
    await waitFor(() => {
      expect(screen.getByText('Pro camera system')).toBeInTheDocument()
      expect(screen.getByText('Advanced computational photography')).toBeInTheDocument()
      expect(screen.getByText('Titanium construction')).toBeInTheDocument()
    })
  })

  it('should handle phone not found error', async () => {
    const mockApiResponse = {
      items: [],
      personalized: true,
      variantParam: 'test-variant'
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    render(<PhoneDetailClient slug="non-existent-phone" />)
    
    await waitFor(() => {
      expect(screen.getByText('Phone Not Found')).toBeInTheDocument()
    })
  })

  it('should handle API errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    render(<PhoneDetailClient slug="iphone-15-pro" />)
    
    await waitFor(() => {
      expect(screen.getByText('Phone Not Found')).toBeInTheDocument()
      expect(screen.getByText('API Error')).toBeInTheDocument()
    })
  })

  it('should handle API response errors', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({})
    })

    render(<PhoneDetailClient slug="iphone-15-pro" />)
    
    await waitFor(() => {
      expect(screen.getByText('Phone Not Found')).toBeInTheDocument()
      expect(screen.getByText('Failed to fetch phones: undefined')).toBeInTheDocument()
    })
  })

  it('should display back button', async () => {
    const mockApiResponse = {
      items: [mockPhone],
      personalized: true,
      variantParam: 'test-variant'
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    render(<PhoneDetailClient slug="iphone-15-pro" />)
    
    await waitFor(() => {
      expect(screen.getByText('Back to Phones')).toBeInTheDocument()
    })
  })

  it('should display phone image when available', async () => {
    const mockApiResponse = {
      items: [mockPhone],
      personalized: true,
      variantParam: 'test-variant'
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    render(<PhoneDetailClient slug="iphone-15-pro" />)
    
    await waitFor(() => {
      const image = screen.getByAltText('iPhone 15 Pro')
      expect(image).toBeInTheDocument()
    })
  })

  it('should display taxonomies as badges', async () => {
    const mockApiResponse = {
      items: [mockPhone],
      personalized: true,
      variantParam: 'test-variant'
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    })

    render(<PhoneDetailClient slug="iphone-15-pro" />)
    
    await waitFor(() => {
      expect(screen.getAllByText('Flagship')).toHaveLength(2)
      expect(screen.getAllByText('iOS')).toHaveLength(3) // Multiple iOS elements
    })
  })
})
