import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import FAQsPageComponent from '../page'
import { FAQsPage } from '@/lib/types'

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

describe('FAQs Page Component', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('Loading State', () => {
    it('should show loading spinner initially', () => {
      mockFetch.mockImplementation(() => new Promise(() => {}))
      render(<FAQsPageComponent />)
      expect(screen.getByText('Loading FAQs Page...')).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should show error message when no sections data', async () => {
      const mockData: FAQsPage = {
        title: 'FAQs',
        description: 'Frequently Asked Questions',
        url: '/faqs',
        sections: null, // Use null instead of empty array to trigger error
        locale: 'en-us',
        uid: 'faqs-uid',
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

      render(<FAQsPageComponent />)

      await waitFor(() => {
        expect(screen.getByText('Unable to load FAQs page content.')).toBeInTheDocument()
      })
    })
  })

  describe('Success State', () => {
    const mockFAQsData: FAQsPage = {
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions',
      url: '/faqs',
      sections: [
        {
          hero_section: {
            heading: 'Frequently Asked Questions',
            subheading: 'Find answers to your questions',
            _metadata: { uid: 'hero-uid' }
          },
          _metadata: { uid: 'section-1' }
        },
        {
          search_section: {
            placeholder_text: 'Search FAQs...',
            _metadata: { uid: 'search-uid' }
          },
          _metadata: { uid: 'section-2' }
        },
        {
          faq_categories_section: {
            categories: [
              {
                category_name: 'General',
                questions: [
                  {
                    question: 'What is PhoneFront?',
                    answer: 'PhoneFront is a comprehensive smartphone review platform.',
                    _metadata: { uid: 'faq-1' }
                  }
                ],
                _metadata: { uid: 'category-1' }
              }
            ],
            _metadata: { uid: 'faqs-uid' }
          },
          _metadata: { uid: 'section-3' }
        }
      ],
      locale: 'en-us',
      uid: 'faqs-uid',
      created_by: 'user',
      updated_by: 'user',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      _version: 1,
      tags: [],
      _in_progress: false
    }

    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFAQsData
      })
    })

    it('should render all sections successfully', async () => {
      render(<FAQsPageComponent />)

      await waitFor(() => {
        expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
        expect(screen.getByText('Find answers to your questions')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Search FAQs...')).toBeInTheDocument()
        expect(screen.getByText('General')).toBeInTheDocument()
        expect(screen.getByText('What is PhoneFront?')).toBeInTheDocument()
      })
    })

    it('should handle FAQ item toggle', async () => {
      render(<FAQsPageComponent />)

      await waitFor(() => {
        const faqButton = screen.getByText('What is PhoneFront?')
        fireEvent.click(faqButton)
        
        expect(screen.getByText('PhoneFront is a comprehensive smartphone review platform.')).toBeInTheDocument()
      })
    })
  })
})
