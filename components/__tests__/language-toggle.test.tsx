import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LanguageToggle } from '../language-toggle'

// Mock the PersonalizeContext
jest.mock('../context/PersonalizeContext', () => ({
  usePersonalize: jest.fn(),
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

// Mock window.location.reload
const mockReload = jest.fn()
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
})


describe('LanguageToggle', () => {
  const mockPersonalizeSdk = {
    set: jest.fn(),
    getVariantAliases: jest.fn(),
    triggerImpression: jest.fn(),
    triggerImpressions: jest.fn(),
  }

  const { usePersonalize } = require('../context/PersonalizeContext')

  const renderWithContext = (sdk = mockPersonalizeSdk) => {
    usePersonalize.mockReturnValue(sdk)
    return render(<LanguageToggle />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
    mockPersonalizeSdk.set.mockResolvedValue(undefined)
  })


  describe('Initial Render', () => {
    it('should render language toggle with default English selection', () => {
      renderWithContext()

      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
      expect(select).toHaveValue('en')
      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('Hindi')).toBeInTheDocument()
    })

    it('should have correct accessibility attributes', () => {
      renderWithContext()

      const select = screen.getByRole('combobox')
      expect(select).toHaveAttribute('id', 'language-select')
      
      const label = screen.getByLabelText('Select Language')
      expect(label).toBeInTheDocument()
    })

    it('should have correct styling classes', () => {
      renderWithContext()

      const select = screen.getByRole('combobox')
      expect(select).toHaveClass(
        'rounded-md',
        'border',
        'border-input',
        'bg-card',
        'px-3',
        'py-1',
        'text-sm',
        'shadow-sm',
        'focus:border-primary',
        'focus:ring-primary',
        'text-foreground'
      )
    })
  })

  describe('Language Selection', () => {
    it('should handle language change to Hindi', async () => {
      renderWithContext()

      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'hi' } })

      expect(select).toHaveValue('hi')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user-language', 'hi')
    })

    it('should handle language change to English', async () => {
      renderWithContext()

      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'en' } })

      expect(select).toHaveValue('en')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user-language', 'en')
    })
  })

  describe('Personalization SDK Integration', () => {
    it('should call personalize SDK when language changes', async () => {
      renderWithContext()

      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'hi' } })

      await waitFor(() => {
        expect(mockPersonalizeSdk.set).toHaveBeenCalledWith({ language: 'hi' })
      })
    })

    it('should reload page after successful SDK call', async () => {
      renderWithContext()

      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'hi' } })

      await waitFor(() => {
        expect(mockPersonalizeSdk.set).toHaveBeenCalledWith({ language: 'hi' })
        expect(mockReload).toHaveBeenCalled()
      })
    })

    it('should handle SDK errors gracefully', async () => {
      const error = new Error('SDK Error')
      mockPersonalizeSdk.set.mockRejectedValue(error)

      renderWithContext()

      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'hi' } })

      await waitFor(() => {
        expect(mockPersonalizeSdk.set).toHaveBeenCalledWith({ language: 'hi' })
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user-language', 'hi')
        expect(mockReload).not.toHaveBeenCalled()
      })
    })

    it('should handle missing SDK gracefully', async () => {
      renderWithContext(null)

      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'hi' } })

      await waitFor(() => {
        expect(mockPersonalizeSdk.set).not.toHaveBeenCalled()
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user-language', 'hi')
        expect(mockReload).not.toHaveBeenCalled()
      })
    })
  })

  describe('Local Storage Integration', () => {
    it('should load stored language on mount', async () => {
      mockLocalStorage.getItem.mockReturnValue('hi')

      renderWithContext()

      await waitFor(() => {
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('user-language')
        expect(screen.getByRole('combobox')).toHaveValue('hi')
      })
    })

    it('should set language in SDK when loading from localStorage', async () => {
      mockLocalStorage.getItem.mockReturnValue('hi')

      renderWithContext()

      await waitFor(() => {
        expect(mockPersonalizeSdk.set).toHaveBeenCalledWith({ language: 'hi' })
      })
    })

    it('should handle missing localStorage gracefully', async () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      renderWithContext()

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveValue('en')
      })
    })
  })


  describe('Edge Cases', () => {
    it('should handle invalid language values', async () => {
      renderWithContext()

      const select = screen.getByRole('combobox')
      // @ts-ignore - Testing invalid value
      fireEvent.change(select, { target: { value: 'invalid' } })

      // The select element will revert to the default value since 'invalid' is not a valid option
      expect(select).toHaveValue('en')
      // The component actually calls setItem with an empty string when the value is invalid
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user-language', '')
    })

    it('should handle SDK unavailable during initialization', async () => {
      mockLocalStorage.getItem.mockReturnValue('hi')

      renderWithContext(null)

      await waitFor(() => {
        expect(mockPersonalizeSdk.set).not.toHaveBeenCalled()
        expect(screen.getByRole('combobox')).toHaveValue('hi')
      })
    })
  })
})
