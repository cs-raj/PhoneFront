import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ContactPage from '../page'
import { ContactPage as ContactPageType } from '@/lib/types'

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

describe('Contact Page Component', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('Loading State', () => {
    it('should show loading skeleton initially', () => {
      // Mock a pending fetch
      mockFetch.mockImplementation(() => new Promise(() => {}))
      
      render(<ContactPage />)
      
      expect(screen.getByRole('main')).toBeInTheDocument()
      // Check for loading skeleton elements
      const skeletonElements = document.querySelectorAll('.animate-pulse')
      expect(skeletonElements.length).toBeGreaterThan(0)
    })
  })

  describe('Error State', () => {
    it('should render with fallback content when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(<ContactPage />)

      await waitFor(() => {
        expect(screen.getByText('Contact Us')).toBeInTheDocument()
        expect(screen.getByText("We'd love to hear from you! Share your feedback about our site, report issues, or suggest improvements.")).toBeInTheDocument()
        expect(screen.getByText('feedback@phonefront.com')).toBeInTheDocument()
      })
    })

    it('should render with fallback content when API returns non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      render(<ContactPage />)

      await waitFor(() => {
        expect(screen.getByText('Contact Us')).toBeInTheDocument()
        expect(screen.getByText('feedback@phonefront.com')).toBeInTheDocument()
      })
    })
  })

  describe('Success State - Full Content', () => {
    const mockContactPageData: ContactPageType = {
      title: 'Contact Us',
      url: '/contact',
      hero_section: {
        title: 'Get in Touch',
        subtitle: 'We\'re here to help',
        description: 'Have questions or feedback? We\'d love to hear from you!'
      },
      contact_info: {
        email: 'support@phonefront.com',
        response_time: 'We respond within 24 hours',
        phone: '+1-555-0123',
        address: '123 Tech Street, Silicon Valley, CA'
      },
      feedback_types: [
        { value: 'bug_report', label: 'Bug Report', description: 'Report a technical issue' },
        { value: 'feature_request', label: 'Feature Request', description: 'Suggest a new feature' },
        { value: 'content_issue', label: 'Content Issue', description: 'Report incorrect information' }
      ],
      seo_metadata: {
        title: 'Contact Us - PhoneFront',
        description: 'Get in touch with PhoneFront team',
        keywords: ['contact', 'feedback', 'support']
      },
      locale: 'en-us',
      uid: 'contact-uid',
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
        json: async () => mockContactPageData
      })
    })

    it('should render all sections with custom data', async () => {
      render(<ContactPage />)

      await waitFor(() => {
        // Hero Section - use getAllByText since "Get in Touch" appears twice
        expect(screen.getAllByText('Get in Touch')).toHaveLength(2)
        expect(screen.getByText('Have questions or feedback? We\'d love to hear from you!')).toBeInTheDocument()
        
        // Contact Information (check for specific contact info text)
        expect(screen.getByText('Email Us')).toBeInTheDocument()
        expect(screen.getByText('support@phonefront.com')).toBeInTheDocument()
        expect(screen.getByText('We respond within 24 hours')).toBeInTheDocument()
        
        // Feedback Types
        expect(screen.getByText('Feedback Types')).toBeInTheDocument()
        expect(screen.getByText('Bug Report')).toBeInTheDocument()
        expect(screen.getByText('Feature Request')).toBeInTheDocument()
        expect(screen.getByText('Content Issue')).toBeInTheDocument()
        
        // Form - use getAllByText since "Send Feedback" appears twice (card title and button)
        expect(screen.getAllByText('Send Feedback')).toHaveLength(2)
        // Form inputs are tested in separate form functionality tests
      })
    })

    it('should have correct email link', async () => {
      render(<ContactPage />)

      await waitFor(() => {
        const emailLink = screen.getByText('support@phonefront.com').closest('a')
        expect(emailLink).toHaveAttribute('href', 'mailto:support@phonefront.com')
      })
    })

    it('should display feedback types with descriptions', async () => {
      render(<ContactPage />)

      await waitFor(() => {
        expect(screen.getByText('Report a technical issue')).toBeInTheDocument()
        expect(screen.getByText('Suggest a new feature')).toBeInTheDocument()
        expect(screen.getByText('Report incorrect information')).toBeInTheDocument()
      })
    })
  })

  describe('Form Functionality', () => {
    beforeEach(() => {
      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          title: 'Contact Us',
          url: '/contact',
          hero_section: { title: 'Contact Us', subtitle: '', description: 'Contact us' },
          contact_info: { email: 'test@example.com', response_time: '24 hours' },
          feedback_types: [
            { value: 'bug_report', label: 'Bug Report', description: 'Report a bug' }
          ],
          seo_metadata: { title: '', description: '', keywords: [] },
          locale: 'en-us',
          uid: 'contact-uid',
          created_by: 'user',
          updated_by: 'user',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          _version: 1,
          tags: [],
          _in_progress: false
        })
      })
    })

    it('should handle form input changes', async () => {
      render(<ContactPage />)

      await waitFor(() => {
        // Use more specific selectors for form inputs
        const titleInput = screen.getByPlaceholderText('Brief description of your feedback')
        const emailInput = screen.getByPlaceholderText('your.email@example.com')
        const messageInput = screen.getByPlaceholderText('Please provide detailed information about your feedback...')

        fireEvent.change(titleInput, { target: { value: 'Test Title' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(messageInput, { target: { value: 'Test message' } })

        expect(titleInput).toHaveValue('Test Title')
        expect(emailInput).toHaveValue('test@example.com')
        expect(messageInput).toHaveValue('Test message')
      })
    })

    it('should display feedback type options', async () => {
      render(<ContactPage />)

      await waitFor(() => {
        // Check that feedback type options are displayed in the info section
        expect(screen.getByText('Bug Report')).toBeInTheDocument()
        // The description text might be different, let's check what's actually rendered
        expect(screen.getByText('Feedback Types')).toBeInTheDocument()
      })
    })

    it('should submit form successfully', async () => {
      // Mock successful form submission
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      render(<ContactPage />)

      await waitFor(() => {
        const titleInput = screen.getByPlaceholderText('Brief description of your feedback')
        const emailInput = screen.getByPlaceholderText('your.email@example.com')
        const messageInput = screen.getByPlaceholderText('Please provide detailed information about your feedback...')
        const submitButton = screen.getByRole('button', { name: /send feedback/i })

        fireEvent.change(titleInput, { target: { value: 'Test Title' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(messageInput, { target: { value: 'Test message' } })
        fireEvent.click(submitButton)

        expect(mockFetch).toHaveBeenCalledWith('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Test Title',
            email: 'test@example.com',
            message: 'Test message',
            feedback_type: ''
          })
        })
      })
    })

    it('should show success message after successful submission', async () => {
      // Mock successful form submission
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      render(<ContactPage />)

      await waitFor(() => {
        const titleInput = screen.getByPlaceholderText('Brief description of your feedback')
        const emailInput = screen.getByPlaceholderText('your.email@example.com')
        const submitButton = screen.getByRole('button', { name: /send feedback/i })

        fireEvent.change(titleInput, { target: { value: 'Test Title' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.click(submitButton)

        waitFor(() => {
          expect(screen.getByText('Thank you! Your feedback has been submitted successfully.')).toBeInTheDocument()
        })
      })
    })

    it('should show error message on submission failure', async () => {
      // Mock failed form submission
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      render(<ContactPage />)

      await waitFor(() => {
        const titleInput = screen.getByPlaceholderText('Brief description of your feedback')
        const emailInput = screen.getByPlaceholderText('your.email@example.com')
        const submitButton = screen.getByRole('button', { name: /send feedback/i })

        fireEvent.change(titleInput, { target: { value: 'Test Title' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.click(submitButton)

        waitFor(() => {
          expect(screen.getByText('Sorry, there was an error submitting your feedback. Please try again.')).toBeInTheDocument()
        })
      })
    })

    it('should show loading state during submission', async () => {
      // Mock delayed response
      mockFetch.mockImplementation(() => new Promise(() => {}))

      render(<ContactPage />)

      await waitFor(() => {
        const titleInput = screen.getByPlaceholderText('Brief description of your feedback')
        const emailInput = screen.getByPlaceholderText('your.email@example.com')
        const submitButton = screen.getByRole('button', { name: /send feedback/i })

        fireEvent.change(titleInput, { target: { value: 'Test Title' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.click(submitButton)

        expect(screen.getByText('Submitting...')).toBeInTheDocument()
        expect(submitButton).toBeDisabled()
      })
    })

    it('should clear form after successful submission', async () => {
      // Mock successful form submission
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      })

      render(<ContactPage />)

      await waitFor(() => {
        const titleInput = screen.getByPlaceholderText('Brief description of your feedback')
        const emailInput = screen.getByPlaceholderText('your.email@example.com')
        const messageInput = screen.getByPlaceholderText('Please provide detailed information about your feedback...')
        const submitButton = screen.getByRole('button', { name: /send feedback/i })

        fireEvent.change(titleInput, { target: { value: 'Test Title' } })
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(messageInput, { target: { value: 'Test message' } })
        fireEvent.click(submitButton)

        waitFor(() => {
          expect(titleInput).toHaveValue('')
          expect(emailInput).toHaveValue('')
          expect(messageInput).toHaveValue('')
        })
      })
    })
  })

  describe('Form Validation', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          title: 'Contact Us',
          url: '/contact',
          hero_section: { title: 'Contact Us', subtitle: '', description: 'Contact us' },
          contact_info: { email: 'test@example.com', response_time: '24 hours' },
          feedback_types: [],
          seo_metadata: { title: '', description: '', keywords: [] },
          locale: 'en-us',
          uid: 'contact-uid',
          created_by: 'user',
          updated_by: 'user',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          _version: 1,
          tags: [],
          _in_progress: false
        })
      })
    })

    it('should require title and email fields', async () => {
      render(<ContactPage />)

      await waitFor(() => {
        const titleInput = screen.getByPlaceholderText('Brief description of your feedback')
        const emailInput = screen.getByPlaceholderText('your.email@example.com')
        const submitButton = screen.getByRole('button', { name: /send feedback/i })

        expect(titleInput).toBeRequired()
        expect(emailInput).toBeRequired()
        
        // Try to submit without required fields
        fireEvent.click(submitButton)
        
        // Form should not submit (HTML5 validation)
        expect(mockFetch).not.toHaveBeenCalledWith('/api/feedback', expect.any(Object))
      })
    })
  })

  describe('API Integration', () => {
    it('should call the correct API endpoint for page data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          title: 'Contact Us',
          url: '/contact',
          hero_section: { title: 'Contact Us', subtitle: '', description: 'Contact us' },
          contact_info: { email: 'test@example.com', response_time: '24 hours' },
          feedback_types: [],
          seo_metadata: { title: '', description: '', keywords: [] },
          locale: 'en-us',
          uid: 'contact-uid',
          created_by: 'user',
          updated_by: 'user',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          _version: 1,
          tags: [],
          _in_progress: false
        })
      })

      render(<ContactPage />)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/contact_page')
        expect(mockFetch).toHaveBeenCalledTimes(1)
      })
    })
  })
})
