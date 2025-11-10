import { render, screen } from '@testing-library/react'
import CompaniesPage from '../page'

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: any) => <img src={src} alt={alt} />
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}))

// Mock the CompaniesClient component
jest.mock('@/components/companies-client', () => ({
  CompaniesClient: ({ initialUrl, initialData }: any) => (
    <div data-testid="companies-client">
      <div>Initial URL: {initialUrl}</div>
      <div>Items: {initialData?.items?.length || 0}</div>
    </div>
  )
}))

// Mock the CompaniesPageClient component
jest.mock('@/components/companies/companies-page-client', () => ({
  CompaniesPageClient: ({ children }: any) => (
    <div data-testid="companies-page-client">{children}</div>
  )
}))

// Mock fetch
global.fetch = jest.fn()

describe('CompaniesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crashing', async () => {
    const mockResponse = {
      items: [
        { id: '1', name: 'Apple', slug: 'apple' },
        { id: '2', name: 'Samsung', slug: 'samsung' }
      ],
      total: 2,
      page: 1,
      pageSize: 12,
      personalized: false
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const page = await CompaniesPage()
    const { container } = render(page)

    expect(screen.getByText('Discover Leading Mobile Brands')).toBeInTheDocument()
  })

  it('should fetch data from API on server side', async () => {
    const mockResponse = {
      items: [
        { id: '1', name: 'Apple', slug: 'apple' }
      ],
      total: 1,
      page: 1,
      pageSize: 12,
      personalized: false
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    await CompaniesPage()

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/companies'),
      expect.objectContaining({
        next: { revalidate: 60 }
      })
    )
  })

  it('should fallback to static data when API fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    const page = await CompaniesPage()
    const { container } = render(page)

    expect(screen.getByText('Discover Leading Mobile Brands')).toBeInTheDocument()
    expect(screen.getByTestId('companies-client')).toBeInTheDocument()
  })

  it('should display page header correctly', async () => {
    const mockResponse = {
      items: [],
      total: 0,
      page: 1,
      pageSize: 12,
      personalized: false
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const page = await CompaniesPage()
    const { container } = render(page)

    expect(screen.getByText('Mobile Companies')).toBeInTheDocument()
    expect(screen.getByText('Discover Leading Mobile Brands')).toBeInTheDocument()
    expect(screen.getByText(/Explore phones from the world/i)).toBeInTheDocument()
  })

  it('should handle fetch errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const page = await CompaniesPage()
    const { container } = render(page)

    expect(screen.getByText('Discover Leading Mobile Brands')).toBeInTheDocument()
  })

  it('should pass initial data to CompaniesClient', async () => {
    const mockResponse = {
      items: [
        { id: '1', name: 'Apple', slug: 'apple' },
        { id: '2', name: 'Samsung', slug: 'samsung' }
      ],
      total: 2,
      page: 1,
      pageSize: 12,
      personalized: false
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const page = await CompaniesPage()
    const { container } = render(page)

    expect(screen.getByText('Items: 2')).toBeInTheDocument()
  })
})
