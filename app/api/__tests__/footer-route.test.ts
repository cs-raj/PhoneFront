import { GET } from '../footer/route';
import { getAllEntries } from '@/lib/contentstack-delivery';
import { createMockNextRequest, mockContentstackDeliveryResponses } from '@/test-utils/api-route-mock-data';

// Mock the Contentstack Delivery SDK
jest.mock('@/lib/contentstack-delivery', () => ({
  getAllEntries: jest.fn()
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

// Mock Personalize SDK
jest.mock('@contentstack/personalize-edge-sdk', () => ({
  VARIANT_QUERY_PARAM: 'cs_personalize'
}));

const mockGetAllEntries = getAllEntries as jest.MockedFunction<typeof getAllEntries>;

describe('/api/footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch footer data successfully', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/footer');
    mockGetAllEntries.mockResolvedValue(mockContentstackDeliveryResponses.footer.success);

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(mockGetAllEntries).toHaveBeenCalledWith('footer', undefined);
    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      ...mockContentstackDeliveryResponses.footer.success.entries[0],
      personalized: false,
      variantParam: null
    });
  });

  it('should handle personalized requests', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/footer', {
      searchParams: { cs_personalize: 'exp_123_var_456' }
    });
    mockGetAllEntries.mockResolvedValue(mockContentstackDeliveryResponses.footer.success);

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(mockGetAllEntries).toHaveBeenCalledWith('footer', 'exp_123_var_456');
    expect(response.status).toBe(200);
    expect(responseData.personalized).toBe(true);
    expect(responseData.variantParam).toBe('exp_123_var_456');
  });

  it('should handle empty Contentstack response', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/footer');
    mockGetAllEntries.mockResolvedValue(mockContentstackDeliveryResponses.footer.empty);

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      message: 'No footer data found',
      personalized: false,
      variantParam: null,
      timestamp: expect.any(String)
    });
  });

  it('should handle Contentstack API errors', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/footer');
    mockGetAllEntries.mockRejectedValue(mockContentstackDeliveryResponses.footer.error);

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      message: 'No footer data found',
      personalized: false,
      variantParam: null,
      timestamp: expect.any(String)
    });
  });

  it('should handle unexpected errors', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/footer');
    mockGetAllEntries.mockRejectedValue('String error');

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      message: 'No footer data found',
      personalized: false,
      variantParam: null,
      timestamp: expect.any(String)
    });
  });

  it('should handle Error objects in unexpected errors', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/footer');
    const error = new Error('Test error message');
    mockGetAllEntries.mockRejectedValue(error);

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      message: 'No footer data found',
      personalized: false,
      variantParam: null,
      timestamp: expect.any(String)
    });
  });
});
