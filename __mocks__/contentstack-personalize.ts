// Mock Contentstack Personalize SDK
export const mockPersonalize = {
  init: jest.fn().mockResolvedValue({
    getVariants: jest.fn(),
    getPersonalizedContent: jest.fn()
  }),
  getInitializationStatus: jest.fn().mockReturnValue(false),
  variantParamToVariantAliases: jest.fn().mockReturnValue(['default']),
  VARIANT_QUERY_PARAM: 'cs_personalize'
}

// Mock the actual module
jest.mock('@contentstack/personalize-edge-sdk', () => mockPersonalize)
