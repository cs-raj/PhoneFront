import { render, screen, waitFor } from '@testing-library/react'
import { PhonesClient } from '../phones-client'
import { mockPhones } from '../../test-utils/mock-data'

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn()
}))

const mockUseSWR = require('swr').default

describe('PhonesClient Integration Tests', () => {
  const mockApiResponse = {
    items: mockPhones,
    total: 2,
    page: 1,
    pageSize: 12,
    personalized: true,
    variantParam: 'test-variant'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSWR.mockReturnValue({
      data: mockApiResponse,
      isLoading: false,
      error: undefined
    })
  })

  it('should render phones with mock data', () => {
    render(<PhonesClient initialUrl="/api/phones" initialData={mockApiResponse} />)
    
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument()
    expect(screen.getByText('Samsung Galaxy S24 Ultra')).toBeInTheDocument()
  })

  it('should display phone information correctly', () => {
    render(<PhonesClient initialUrl="/api/phones" initialData={mockApiResponse} />)
    
    // Use more specific selectors to avoid conflicts with filter labels
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument()
    expect(screen.getByText('Samsung Galaxy S24 Ultra')).toBeInTheDocument()
    expect(screen.getByText('$999')).toBeInTheDocument()
    expect(screen.getByText('$1199')).toBeInTheDocument()
  })

  it('should display phone specifications', () => {
    render(<PhonesClient initialUrl="/api/phones" initialData={mockApiResponse} />)
    
    expect(screen.getByText('6.1" Super Retina XDR')).toBeInTheDocument()
    expect(screen.getByText('6.8" Dynamic AMOLED 2X')).toBeInTheDocument()
  })

  it('should display taxonomies as badges', () => {
    render(<PhonesClient initialUrl="/api/phones" initialData={mockApiResponse} />)
    
    // Use getAllByText to handle multiple instances
    expect(screen.getAllByText('Flagship')).toHaveLength(3) // One in phone card, one in filter label, one in filter button
    expect(screen.getAllByText('iOS')).toHaveLength(2) // One in phone card, one in filter
    expect(screen.getAllByText('Android')).toHaveLength(2) // One in phone card, one in filter
  })

  it('should handle loading state', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined
    })

    render(<PhonesClient initialUrl="/api/phones" initialData={{ items: [], total: 0, page: 1, pageSize: 12, personalized: false }} />)
    
    expect(screen.getByText('Loading phones...')).toBeInTheDocument()
  })

  it('should handle error state', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('API Error')
    })

    render(<PhonesClient initialUrl="/api/phones" initialData={{ items: [], total: 0, page: 1, pageSize: 12, personalized: false }} />)
    
    expect(screen.getByText('Error loading phones: API Error')).toBeInTheDocument()
  })

  it('should handle empty data', () => {
    mockUseSWR.mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
      error: undefined
    })

    render(<PhonesClient initialUrl="/api/phones" initialData={{ items: [], total: 0, page: 1, pageSize: 12, personalized: false }} />)
    
    // When there's no data, the component just shows an empty grid - no specific "No phones found" message
    expect(screen.getByText('All Phones')).toBeInTheDocument()
    expect(screen.getByText('Discover the latest smartphones from top brands with detailed specifications')).toBeInTheDocument()
  })

  it('should display view details buttons', () => {
    render(<PhonesClient initialUrl="/api/phones" initialData={mockApiResponse} />)
    
    const viewDetailsButtons = screen.getAllByText('View Details')
    expect(viewDetailsButtons).toHaveLength(2)
  })

  it('should have correct grid layout', () => {
    render(<PhonesClient initialUrl="/api/phones" initialData={mockApiResponse} />)
    
    // Find the main phones grid container
    const phonesGrid = screen.getByText('iPhone 15 Pro').closest('div[class*="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"]')
    expect(phonesGrid).toBeInTheDocument()
  })
})