import { getEntryBySlug, getAllEntries } from '../contentstack-delivery';

// Mock Contentstack SDK
jest.mock('@contentstack/delivery-sdk', () => ({
  stack: jest.fn(() => ({
    contentType: jest.fn(() => ({
      entry: jest.fn(() => ({
        includeReference: jest.fn(() => ({
          includeFallback: jest.fn(() => ({
            variants: jest.fn(() => ({
              find: jest.fn().mockRejectedValue(new Error('Contentstack API error'))
            })),
            find: jest.fn().mockRejectedValue(new Error('Contentstack API error'))
          }))
        }))
      }))
    }))
  }))
}));

// Mock Personalize SDK
jest.mock('@contentstack/personalize-edge-sdk', () => ({
  variantParamToVariantAliases: jest.fn(() => [])
}));

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_CONTENTSTACK_API_KEY: 'test_api_key',
    NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN: 'test_delivery_token',
    NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT: 'test_environment',
    NEXT_PUBLIC_CONTENTSTACK_REGION: 'us'
  };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('contentstack-delivery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEntryBySlug', () => {
    it('should handle SDK not available', async () => {
      // Act
      const result = await getEntryBySlug('test_content_type', 'test-slug');

      // Assert
      expect(result).toBeNull();
    });

    it('should handle SDK not available with variant', async () => {
      // Act
      const result = await getEntryBySlug('test_content_type', 'test-slug', 'exp_123_var_456');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('getAllEntries', () => {
    it('should handle SDK not available', async () => {
      // Act
      const result = await getAllEntries('test_content_type');

      // Assert
      expect(result).toEqual({ entries: [] });
    });

    it('should handle SDK not available with variant', async () => {
      // Act
      const result = await getAllEntries('test_content_type', 'exp_123_var_456');

      // Assert
      expect(result).toEqual({ entries: [] });
    });
  });
});
