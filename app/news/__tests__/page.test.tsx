import { render, screen } from '@testing-library/react'
import NewsPage from '../page'

// Mock Next.js components
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}))

// Mock the NewsClient component
jest.mock('@/components/news-client', () => ({
  __esModule: true,
  default: ({ initialUrl, initialData }: any) => (
    <div data-testid="news-client">
      <div>Initial URL: {initialUrl}</div>
      <div>Items: {initialData?.items?.length || 0}</div>
    </div>
  )
}))

// Mock the NewsPageClient component
jest.mock('@/components/news/news-page-client', () => ({
  NewsPageClient: ({ children }: any) => (
    <div data-testid="news-page-client">{children}</div>
  )
}))

// Mock other components
jest.mock('@/components/ticker-bar', () => ({
  TickerBar: () => <div data-testid="ticker-bar">Ticker Bar</div>
}))

jest.mock('@/components/language-toggle', () => ({
  LanguageToggle: () => <div data-testid="language-toggle">Language Toggle</div>
}))

jest.mock('@/components/impressions', () => ({
  Impressions: (props: any) => <div data-testid="impressions">Impressions</div>
}))

// Mock fetch
global.fetch = jest.fn()

describe('NewsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crashing', async () => {
    const mockResponse = {
      items: [
        { id: '1', title: 'News Article 1', slug: 'news-1' },
        { id: '2', title: 'News Article 2', slug: 'news-2' }
      ],
      total: 2,
      page: 1,
      pageSize: 4,
      personalized: false
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const page = await NewsPage()
    const { container } = render(page)

    expect(screen.getByTestId('news-client')).toBeInTheDocument()
  })

  it('should fetch data from API on server side', async () => {
    const mockResponse = {
      items: [{ id: '1', title: 'News Article', slug: 'news-1' }],
      total: 1,
      page: 1,
      pageSize: 4,
      personalized: false
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    await NewsPage()

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/news'),
      expect.objectContaining({
        next: { revalidate: 60 }
      })
    )
  })

  it('should fallback to empty data when API fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    const page = await NewsPage()
    const { container } = render(page)

    expect(screen.getByTestId('news-client')).toBeInTheDocument()
    expect(screen.getByText('Items: 0')).toBeInTheDocument()
  })

  it('should render ticker bar and language toggle', async () => {
    const mockResponse = {
      items: [],
      total: 0,
      page: 1,
      pageSize: 4,
      personalized: false
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const page = await NewsPage()
    const { container } = render(page)

    expect(screen.getByTestId('ticker-bar')).toBeInTheDocument()
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument()
  })

  it('should render impressions component', async () => {
    const mockResponse = {
      items: [],
      total: 0,
      page: 1,
      pageSize: 4,
      personalized: false
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const page = await NewsPage()
    const { container } = render(page)

    expect(screen.getByTestId('impressions')).toBeInTheDocument()
  })

  it('should handle fetch errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const page = await NewsPage()
    const { container } = render(page)

    expect(screen.getByTestId('news-client')).toBeInTheDocument()
  })

  it('should pass initial data to NewsClient', async () => {
    const mockResponse = {
      items: [
        { id: '1', title: 'News Article 1', slug: 'news-1' },
        { id: '2', title: 'News Article 2', slug: 'news-2' }
      ],
      total: 2,
      page: 1,
      pageSize: 4,
      personalized: false
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const page = await NewsPage()
    const { container } = render(page)

    expect(screen.getByText('Items: 2')).toBeInTheDocument()
  })
})
