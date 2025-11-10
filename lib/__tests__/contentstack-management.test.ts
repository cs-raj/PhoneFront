import { createFeedbackEntry, getFeedbackEntries, updateFeedbackEntry, deleteFeedbackEntry } from '../contentstack-management';

// Mock the Contentstack Management SDK to simulate SDK not available
jest.mock('@contentstack/management', () => ({
  client: jest.fn(() => {
    throw new Error('Contentstack Management SDK not available');
  })
}));

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    CONTENTSTACK_MANAGEMENT_TOKEN: 'test_management_token',
    NEXT_PUBLIC_CONTENTSTACK_API_KEY: 'test_api_key'
  };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('contentstack-management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createFeedbackEntry', () => {
    it('should handle SDK not available', async () => {
      // Arrange
      const feedbackData = {
        title: 'Test Feedback',
        email: 'test@example.com',
        message: 'Test message',
        feedback_type: 'general'
      };

      // Act & Assert
      await expect(createFeedbackEntry(feedbackData)).rejects.toThrow('Failed to create feedback entry: Cannot read properties of null (reading \'contentType\')');
    });
  });

  describe('getFeedbackEntries', () => {
    it('should handle SDK not available', async () => {
      // Act & Assert
      await expect(getFeedbackEntries(10, 0)).rejects.toThrow('Failed to fetch feedback entries: Cannot read properties of null (reading \'contentType\')');
    });
  });

  describe('updateFeedbackEntry', () => {
    it('should handle SDK not available', async () => {
      // Arrange
      const uid = 'feedback_123';
      const updateData = { status: 'resolved' };

      // Act & Assert
      await expect(updateFeedbackEntry(uid, updateData)).rejects.toThrow('Failed to update feedback entry: Cannot read properties of null (reading \'contentType\')');
    });
  });

  describe('deleteFeedbackEntry', () => {
    it('should handle SDK not available', async () => {
      // Arrange
      const uid = 'feedback_123';

      // Act & Assert
      await expect(deleteFeedbackEntry(uid)).rejects.toThrow('Failed to delete feedback entry: Cannot read properties of null (reading \'contentType\')');
    });
  });
});
