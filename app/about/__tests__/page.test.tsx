import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AboutPageComponent from '../page'
import { AboutPage } from '@/lib/types'

// Mock fetch globally
const mockFetch = jest.fn()
globalThis.fetch = mockFetch

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

describe('About Page Component', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('Loading State', () => {
    it('should show loading spinner initially', () => {
      // Mock a pending fetch
      mockFetch.mockImplementation(() => new Promise(() => {}))
      
      render(<AboutPageComponent />)
      
      expect(screen.getByText('Loading About Page...')).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should render empty container when sections array is empty', async () => {
      const mockData: AboutPage = {
        title: 'About',
        description: 'About page',
        sections: [],
        locale: 'en-us',
        uid: 'about-uid',
        created_by: 'user',
        updated_by: 'user',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        _version: 1,
        tags: [],
        _in_progress: false
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      })

      render(<AboutPageComponent />)

      await waitFor(() => {
        // Empty sections array doesn't trigger error state, just renders empty container
        expect(screen.getByRole('main')).toBeInTheDocument()
        // Should not show any content since no sections are available
        expect(screen.queryByText('About')).not.toBeInTheDocument()
      })
    })

    it('should show error message when sections is null', async () => {
      const mockData = {
        title: 'About',
        description: 'About page',
        sections: null
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      })

      render(<AboutPageComponent />)

      await waitFor(() => {
        expect(screen.getByText('Unable to load about page content.')).toBeInTheDocument()
      })
    })

    it('should handle API fetch errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(<AboutPageComponent />)

      await waitFor(() => {
        expect(screen.getByText('Unable to load about page content.')).toBeInTheDocument()
      })
    })

    it('should handle non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      render(<AboutPageComponent />)

      await waitFor(() => {
        expect(screen.getByText('Unable to load about page content.')).toBeInTheDocument()
      })
    })
  })

  // Test data for full content
  const mockAboutPageData: AboutPage = {
      title: 'About PhoneFront',
      description: 'Learn about our mission and values',
      sections: [
        {
          hero_section: {
            heading: 'About PhoneFront',
            subheading: 'Your trusted source for smartphone reviews and insights',
            _metadata: { uid: 'hero-uid' }
          },
          _metadata: { uid: 'section-1' }
        },
        {
          mission_section: {
            heading: 'Our Mission',
            description: 'To provide honest, comprehensive smartphone reviews that help users make informed decisions.',
            _metadata: { uid: 'mission-uid' }
          },
          _metadata: { uid: 'section-2' }
        },
        {
          what_we_do_section: {
            heading: 'What We Do',
            items: [
              {
                title: 'Phone Reviews',
                description: 'In-depth reviews of the latest smartphones',
                icon_svg: '<svg><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
                _metadata: { uid: 'item-1' }
              },
              {
                title: 'Price Comparisons',
                description: 'Compare prices across different retailers',
                icon_svg: '<svg><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>',
                _metadata: { uid: 'item-2' }
              },
              {
                title: 'News & Updates',
                description: 'Latest smartphone news and industry updates',
                icon_svg: '<svg><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>',
                _metadata: { uid: 'item-3' }
              }
            ],
            _metadata: { uid: 'what-we-do-uid' }
          },
          _metadata: { uid: 'section-3' }
        },
        {
          values_section: {
            heading: 'Our Values',
            values: [
              {
                number: 1,
                title: 'Transparency',
                description: 'We provide honest, unbiased reviews',
                _metadata: { uid: 'value-1' }
              },
              {
                number: 2,
                title: 'Accuracy',
                description: 'We ensure all information is accurate and up-to-date',
                _metadata: { uid: 'value-2' }
              }
            ],
            _metadata: { uid: 'values-uid' }
          },
          _metadata: { uid: 'section-4' }
        },
        {
          cta_section: {
            heading: 'Get Started',
            description: 'Start exploring the best smartphones today',
            buttons: [
              {
                button_text: 'Browse Phones',
                button_url: '/phones',
                _metadata: { uid: '82eb-primary-button' }
              },
              {
                button_text: 'Read Reviews',
                button_url: '/reviews',
                _metadata: { uid: 'secondary-button' }
              }
            ],
            _metadata: { uid: 'cta-uid' }
          },
          _metadata: { uid: 'section-5' }
        }
      ],
      locale: 'en-us',
      uid: 'about-uid',
      created_by: 'user',
      updated_by: 'user',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      _version: 1,
      tags: [],
      _in_progress: false
    }

  describe('Success State - Full Content', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAboutPageData
      })
    })

    it('should render all sections successfully', async () => {
      render(<AboutPageComponent />)

      await waitFor(() => {
        // Hero Section - text is split across spans, so we check for parts
        expect(screen.getByText('About')).toBeInTheDocument()
        expect(screen.getByText('PhoneFront')).toBeInTheDocument()
        expect(screen.getByText('Your trusted source for smartphone reviews and insights')).toBeInTheDocument()
        
        // Mission Section
        expect(screen.getByText('Our Mission')).toBeInTheDocument()
        expect(screen.getByText('To provide honest, comprehensive smartphone reviews that help users make informed decisions.')).toBeInTheDocument()
        
        // What We Do Section
        expect(screen.getByText('What We Do')).toBeInTheDocument()
        expect(screen.getByText('Phone Reviews')).toBeInTheDocument()
        expect(screen.getByText('Price Comparisons')).toBeInTheDocument()
        expect(screen.getByText('News & Updates')).toBeInTheDocument()
        
        // Values Section
        expect(screen.getByText('Our Values')).toBeInTheDocument()
        expect(screen.getByText('Transparency')).toBeInTheDocument()
        expect(screen.getByText('Accuracy')).toBeInTheDocument()
        
        // CTA Section
        expect(screen.getByText('Get Started')).toBeInTheDocument()
        expect(screen.getByText('Start exploring the best smartphones today')).toBeInTheDocument()
        expect(screen.getByText('Browse Phones')).toBeInTheDocument()
        expect(screen.getByText('Read Reviews')).toBeInTheDocument()
      })
    })

    it('should highlight PhoneFront in hero heading', async () => {
      render(<AboutPageComponent />)

      await waitFor(() => {
        const phoneFrontSpan = screen.getByText('PhoneFront')
        expect(phoneFrontSpan).toHaveClass('text-primary')
      })
    })

    it('should render SVG icons safely in what we do section', async () => {
      render(<AboutPageComponent />)

      await waitFor(() => {
        // Check that SVG content is rendered (we can't easily test the actual SVG, but we can test the container)
        const iconContainers = screen.getAllByRole('generic').filter(el => 
          el.className.includes('w-12 h-12 rounded-lg bg-primary/10')
        )
        expect(iconContainers).toHaveLength(3)
      })
    })

    it('should render numbered values correctly', async () => {
      render(<AboutPageComponent />)

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
      })
    })

    it('should apply correct button styles based on UID', async () => {
      render(<AboutPageComponent />)

      await waitFor(() => {
        const browseButton = screen.getByText('Browse Phones')
        const readButton = screen.getByText('Read Reviews')
        
        // Primary button (UID contains '82eb')
        expect(browseButton).toHaveClass('bg-primary', 'text-primary-foreground')
        
        // Secondary button
        expect(readButton).toHaveClass('bg-card', 'text-foreground', 'border', 'border-border')
      })
    })

    it('should have correct links for CTA buttons', async () => {
      render(<AboutPageComponent />)

      await waitFor(() => {
        const browseLink = screen.getByText('Browse Phones').closest('a')
        const readLink = screen.getByText('Read Reviews').closest('a')
        
        expect(browseLink).toHaveAttribute('href', '/phones')
        expect(readLink).toHaveAttribute('href', '/reviews')
      })
    })
  })

  describe('Success State - Partial Content', () => {
    it('should render only available sections', async () => {
      const partialData: AboutPage = {
        title: 'About',
        description: 'About page',
        sections: [
          {
            hero_section: {
              heading: 'About Us',
              subheading: 'Learn more about our company',
              _metadata: { uid: 'hero-uid' }
            },
            _metadata: { uid: 'section-1' }
          },
          {
            mission_section: {
              heading: 'Our Mission',
              description: 'To help users find the best phones',
              _metadata: { uid: 'mission-uid' }
            },
            _metadata: { uid: 'section-2' }
          }
        ],
        locale: 'en-us',
        uid: 'about-uid',
        created_by: 'user',
        updated_by: 'user',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        _version: 1,
        tags: [],
        _in_progress: false
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => partialData
      })

      render(<AboutPageComponent />)

      await waitFor(() => {
        // Should render available sections - text is split across spans
        expect(screen.getByText('About')).toBeInTheDocument()
        expect(screen.getByText('Us')).toBeInTheDocument()
        expect(screen.getByText('Our Mission')).toBeInTheDocument()
        
        // Should not render missing sections
        expect(screen.queryByText('What We Do')).not.toBeInTheDocument()
        expect(screen.queryByText('Our Values')).not.toBeInTheDocument()
        expect(screen.queryByText('Get Started')).not.toBeInTheDocument()
      })
    })
  })

  describe('Component Structure', () => {
    it('should have proper semantic structure', async () => {
      const mockData: AboutPage = {
        title: 'About',
        description: 'About page',
        sections: [
          {
            hero_section: {
              heading: 'About Us',
              subheading: 'Learn more',
              _metadata: { uid: 'hero-uid' }
            },
            _metadata: { uid: 'section-1' }
          }
        ],
        locale: 'en-us',
        uid: 'about-uid',
        created_by: 'user',
        updated_by: 'user',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        _version: 1,
        tags: [],
        _in_progress: false
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      })

      render(<AboutPageComponent />)

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument()
        expect(screen.getByText('About')).toBeInTheDocument()
        expect(screen.getByText('Us')).toBeInTheDocument()
      })
    })
  })

  describe('API Integration', () => {
    it('should call the correct API endpoint', async () => {
      const mockData: AboutPage = {
        title: 'About',
        description: 'About page',
        sections: [],
        locale: 'en-us',
        uid: 'about-uid',
        created_by: 'user',
        updated_by: 'user',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        _version: 1,
        tags: [],
        _in_progress: false
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      })

      render(<AboutPageComponent />)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/about_page')
        expect(mockFetch).toHaveBeenCalledTimes(1)
      })
    })
  })
})
