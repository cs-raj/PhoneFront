import { POST, GET } from '../feedback/route';
import { createFeedbackEntry, getFeedbackEntries } from '@/lib/contentstack-management';
import { createMockNextRequest, mockFeedbackRequestData, mockContentstackManagementResponses } from '@/test-utils/api-route-mock-data';

// Mock the Contentstack Management SDK
jest.mock('@/lib/contentstack-management', () => ({
  createFeedbackEntry: jest.fn(),
  getFeedbackEntries: jest.fn()
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data: any, init?: ResponseInit) => {
      return new Response(JSON.stringify(data), {
        status: init?.status || 200,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers
        }
      });
    })
  }
}));

const mockCreateFeedbackEntry = createFeedbackEntry as jest.MockedFunction<typeof createFeedbackEntry>;
const mockGetFeedbackEntries = getFeedbackEntries as jest.MockedFunction<typeof getFeedbackEntries>;

describe('/api/feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/feedback', () => {
    it('should create feedback entry successfully', async () => {
      // Arrange
      const requestData = mockFeedbackRequestData.valid;
      const request = createMockNextRequest('http://localhost:3000/api/feedback', {
        method: 'POST',
        body: requestData
      });
      
      mockCreateFeedbackEntry.mockResolvedValue(mockContentstackManagementResponses.createFeedbackEntry.success);

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(mockCreateFeedbackEntry).toHaveBeenCalledWith({
        title: requestData.title,
        email: requestData.email,
        message: requestData.message,
        feedback_type: requestData.feedback_type,
        status: 'new',
        created_at: expect.any(String),
        source: 'contact_form'
      });
      
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        message: 'Feedback submitted successfully',
        data: {
          id: 'feedback_123',
          title: requestData.title,
          status: 'received'
        }
      });
    });

    it('should handle missing required fields', async () => {
      // Arrange
      const requestData = mockFeedbackRequestData.invalid;
      const request = createMockNextRequest('http://localhost:3000/api/feedback', {
        method: 'POST',
        body: requestData
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: 'Title and email are required'
      });
      expect(mockCreateFeedbackEntry).not.toHaveBeenCalled();
    });

    it('should handle minimal valid data', async () => {
      // Arrange
      const requestData = mockFeedbackRequestData.minimal;
      const request = createMockNextRequest('http://localhost:3000/api/feedback', {
        method: 'POST',
        body: requestData
      });
      
      mockCreateFeedbackEntry.mockResolvedValue(mockContentstackManagementResponses.createFeedbackEntry.success);

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(mockCreateFeedbackEntry).toHaveBeenCalledWith({
        title: requestData.title,
        email: requestData.email,
        message: '',
        feedback_type: '',
        status: 'new',
        created_at: expect.any(String),
        source: 'contact_form'
      });
      
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
    });

    it('should handle Contentstack management errors', async () => {
      // Arrange
      const requestData = mockFeedbackRequestData.valid;
      const request = createMockNextRequest('http://localhost:3000/api/feedback', {
        method: 'POST',
        body: requestData
      });
      
      mockCreateFeedbackEntry.mockRejectedValue(mockContentstackManagementResponses.createFeedbackEntry.error);

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: 'Failed to submit feedback',
        message: 'Failed to create feedback entry'
      });
    });

    it('should handle unexpected errors', async () => {
      // Arrange
      const requestData = mockFeedbackRequestData.valid;
      const request = createMockNextRequest('http://localhost:3000/api/feedback', {
        method: 'POST',
        body: requestData
      });
      
      mockCreateFeedbackEntry.mockRejectedValue('String error');

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: 'Failed to submit feedback',
        message: 'Unknown error'
      });
    });
  });

  describe('GET /api/feedback', () => {
    it('should fetch feedback entries successfully', async () => {
      // Arrange
      const request = createMockNextRequest('http://localhost:3000/api/feedback', {
        method: 'GET',
        searchParams: { limit: '5', skip: '0' }
      });
      
      mockGetFeedbackEntries.mockResolvedValue(mockContentstackManagementResponses.getFeedbackEntries.success);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(mockGetFeedbackEntries).toHaveBeenCalledWith(5, 0);
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        items: mockContentstackManagementResponses.getFeedbackEntries.success.entries,
        total: 2,
        count: 2
      });
    });

    it('should use default pagination parameters', async () => {
      // Arrange
      const request = createMockNextRequest('http://localhost:3000/api/feedback', {
        method: 'GET'
      });
      
      mockGetFeedbackEntries.mockResolvedValue(mockContentstackManagementResponses.getFeedbackEntries.success);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(mockGetFeedbackEntries).toHaveBeenCalledWith(10, 0);
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
    });

    it('should handle Contentstack management errors', async () => {
      // Arrange
      const request = createMockNextRequest('http://localhost:3000/api/feedback', {
        method: 'GET'
      });
      
      mockGetFeedbackEntries.mockRejectedValue(mockContentstackManagementResponses.getFeedbackEntries.error);

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: 'Failed to fetch feedback',
        message: 'Failed to fetch feedback entries'
      });
    });

    it('should handle unexpected errors', async () => {
      // Arrange
      const request = createMockNextRequest('http://localhost:3000/api/feedback', {
        method: 'GET'
      });
      
      mockGetFeedbackEntries.mockRejectedValue('String error');

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: 'Failed to fetch feedback',
        message: 'Unknown error'
      });
    });
  });
});




