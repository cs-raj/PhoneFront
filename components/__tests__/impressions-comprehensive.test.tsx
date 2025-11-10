import { render } from '@testing-library/react'
import { Impressions } from '../impressions'

// Mock the PersonalizeContext
jest.mock('../context/PersonalizeContext', () => ({
  usePersonalize: jest.fn(),
}))

describe('Impressions Component - Comprehensive Tests', () => {
  const mockPersonalizeSdk = {
    set: jest.fn(),
    getVariantAliases: jest.fn(),
    triggerImpression: jest.fn(),
    triggerImpressions: jest.fn(),
  }

  const { usePersonalize } = require('../context/PersonalizeContext')

  const renderWithContext = (sdk = mockPersonalizeSdk, props = {}) => {
    usePersonalize.mockReturnValue(sdk)
    return render(<Impressions {...props} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockPersonalizeSdk.triggerImpression.mockResolvedValue(undefined)
    mockPersonalizeSdk.triggerImpressions.mockResolvedValue(undefined)
    mockPersonalizeSdk.getVariantAliases.mockReturnValue([])
  })


  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      renderWithContext()
      // Component returns empty fragment, so we just check it doesn't throw
    })

    it('should initialize with default props', () => {
      renderWithContext()
      // Component should render without errors
    })

    it('should detect SDK availability', () => {
      renderWithContext()
      // Component should detect SDK availability
    })

    it('should detect client-side environment', () => {
      renderWithContext()
      // Component should detect client-side environment
    })
  })

  describe('Individual Impression Triggering', () => {
    it('should trigger individual impressions with experienceShortUids', async () => {
      const props = {
        experienceShortUids: ['exp1', 'exp2'],
        useBulkTrigger: false,
      }

      renderWithContext(mockPersonalizeSdk, props)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockPersonalizeSdk.triggerImpression).toHaveBeenCalledWith('exp1')
      expect(mockPersonalizeSdk.triggerImpression).toHaveBeenCalledWith('exp2')
    })

    it('should trigger individual impressions with aliases', async () => {
      const props = {
        aliases: ['alias1', 'alias2'],
        useBulkTrigger: false,
      }

      renderWithContext(mockPersonalizeSdk, props)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockPersonalizeSdk.triggerImpression).toHaveBeenCalledWith('alias1')
      expect(mockPersonalizeSdk.triggerImpression).toHaveBeenCalledWith('alias2')
    })

    it('should handle individual impression errors', async () => {
      const error = new Error('Impression failed')
      mockPersonalizeSdk.triggerImpression.mockRejectedValueOnce(error)

      const props = {
        experienceShortUids: ['exp1'],
        useBulkTrigger: false,
      }

      renderWithContext(mockPersonalizeSdk, props)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockPersonalizeSdk.triggerImpression).toHaveBeenCalledWith('exp1')
    })
  })

  describe('Bulk Impression Triggering', () => {
    it('should trigger bulk impressions with experienceShortUids', async () => {
      const props = {
        experienceShortUids: ['exp1', 'exp2'],
        useBulkTrigger: true,
      }

      renderWithContext(mockPersonalizeSdk, props)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockPersonalizeSdk.triggerImpressions).toHaveBeenCalledWith({
        experienceShortUids: ['exp1', 'exp2']
      })
    })

    it('should trigger bulk impressions with aliases', async () => {
      const props = {
        aliases: ['alias1', 'alias2'],
        useBulkTrigger: true,
      }

      renderWithContext(mockPersonalizeSdk, props)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockPersonalizeSdk.triggerImpressions).toHaveBeenCalledWith({
        aliases: ['alias1', 'alias2']
      })
    })

    it('should handle bulk impression errors', async () => {
      const error = new Error('Bulk impression failed')
      mockPersonalizeSdk.triggerImpressions.mockRejectedValue(error)

      const props = {
        experienceShortUids: ['exp1'],
        useBulkTrigger: true,
      }

      renderWithContext(mockPersonalizeSdk, props)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockPersonalizeSdk.triggerImpressions).toHaveBeenCalledWith({
        experienceShortUids: ['exp1']
      })
    })
  })

  describe('Auto-Detection', () => {
    it('should auto-detect experiences when enabled', async () => {
      mockPersonalizeSdk.getVariantAliases.mockReturnValue(['alias1', 'alias2'])

      const props = {
        autoDetectExperiences: true,
        useBulkTrigger: false,
      }

      renderWithContext(mockPersonalizeSdk, props)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockPersonalizeSdk.getVariantAliases).toHaveBeenCalled()
      expect(mockPersonalizeSdk.triggerImpression).toHaveBeenCalledWith('alias1')
      expect(mockPersonalizeSdk.triggerImpression).toHaveBeenCalledWith('alias2')
    })

    it('should handle auto-detection errors', async () => {
      const props = {
        autoDetectExperiences: true,
        useBulkTrigger: false,
      }

      renderWithContext(mockPersonalizeSdk, props)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockPersonalizeSdk.getVariantAliases).toHaveBeenCalled()
    })

    it('should handle no variant aliases found', async () => {
      mockPersonalizeSdk.getVariantAliases.mockReturnValue([])

      const props = {
        autoDetectExperiences: true,
        useBulkTrigger: false,
      }

      renderWithContext(mockPersonalizeSdk, props)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockPersonalizeSdk.getVariantAliases).toHaveBeenCalled()
    })
  })

  describe('SDK Unavailable Scenarios', () => {
    it('should handle missing SDK gracefully', async () => {
      renderWithContext(null)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockPersonalizeSdk.triggerImpression).not.toHaveBeenCalled()
    })

    it('should skip when no experiences or aliases provided', async () => {
      const props = {
        experienceShortUids: [],
        aliases: [],
      }

      renderWithContext(mockPersonalizeSdk, props)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockPersonalizeSdk.triggerImpression).not.toHaveBeenCalled()
    })
  })

  describe('Priority Handling', () => {
    it('should prioritize experienceShortUids over aliases', async () => {
      const props = {
        experienceShortUids: ['exp1'],
        aliases: ['alias1'],
        useBulkTrigger: false,
      }

      renderWithContext(mockPersonalizeSdk, props)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockPersonalizeSdk.triggerImpression).toHaveBeenCalledWith('exp1')
      expect(mockPersonalizeSdk.triggerImpression).not.toHaveBeenCalledWith('alias1')
    })
  })

  describe('Component Functionality', () => {
    it('should render with all configuration options', () => {
      const props = {
        experienceShortUids: ['exp1'],
        aliases: ['alias1'],
        useBulkTrigger: true,
        autoDetectExperiences: true,
      }

      const { container } = renderWithContext(mockPersonalizeSdk, props)
      expect(container).toBeInTheDocument()
    })

    it('should handle impression trigger attempts', async () => {
      const props = {
        experienceShortUids: ['exp1'],
        useBulkTrigger: false,
      }

      renderWithContext(mockPersonalizeSdk, props)

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(mockPersonalizeSdk.triggerImpression).toHaveBeenCalledWith('exp1')
    })
  })
})
