import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CareersPageComponent from '../page'
import { CareersPage } from '@/lib/types'

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

describe('Careers Page Component', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('Loading State', () => {
    it('should show loading spinner initially', () => {
      mockFetch.mockImplementation(() => new Promise(() => {}))
      render(<CareersPageComponent />)
      expect(screen.getByText('Loading Careers Page...')).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should show error message when no sections data', async () => {
      const mockData: CareersPage = {
        title: 'Careers',
        description: 'Join our team',
        url: '/careers',
        sections: null, // Use null instead of empty array to trigger error
        locale: 'en-us',
        uid: 'careers-uid',
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

      render(<CareersPageComponent />)

      await waitFor(() => {
        expect(screen.getByText('Unable to load careers page content.')).toBeInTheDocument()
      })
    })
  })

  describe('Success State', () => {
    const mockCareersData: CareersPage = {
      title: 'Join Our Team',
      description: 'Explore career opportunities',
      url: '/careers',
      sections: [
        {
          hero_section: {
            heading: 'Join Our Team',
            subheading: 'Build the future of smartphone reviews',
            _metadata: { uid: 'hero-uid' }
          },
          _metadata: { uid: 'section-1' }
        }
      ],
      locale: 'en-us',
      uid: 'careers-uid',
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
        json: async () => mockCareersData
      })
    })

    it('should render all sections successfully', async () => {
      render(<CareersPageComponent />)

      await waitFor(() => {
        // Check for individual words since the heading is split
        expect(screen.getByText('Join')).toBeInTheDocument()
        expect(screen.getByText('Our')).toBeInTheDocument()
        expect(screen.getByText('Team')).toBeInTheDocument()
        expect(screen.getByText('Build the future of smartphone reviews')).toBeInTheDocument()
      })
    })
  })
})
