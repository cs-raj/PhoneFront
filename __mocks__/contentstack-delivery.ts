// Mock Contentstack Delivery SDK
export const mockStack = {
  contentType: jest.fn(() => ({
    entry: jest.fn(() => ({
      includeReference: jest.fn().mockReturnThis(),
      includeFallback: jest.fn().mockReturnThis(),
      variants: jest.fn().mockReturnThis(),
      find: jest.fn().mockResolvedValue({
        entries: [],
        count: 0
      })
    }))
  }))
}

export const mockGetEntryBySlug = jest.fn()
export const mockGetAllEntries = jest.fn()

// Mock the actual module
jest.mock('@/lib/contentstack-delivery', () => ({
  Stack: mockStack,
  getEntryBySlug: mockGetEntryBySlug,
  getAllEntries: mockGetAllEntries
}))

// Mock Contentstack SDK
jest.mock('@contentstack/delivery-sdk', () => ({
  stack: jest.fn(() => mockStack)
}))
