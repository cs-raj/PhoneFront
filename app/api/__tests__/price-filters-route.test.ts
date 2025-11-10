import { GET } from '../price-filters/route';
import { getAllEntries } from '@/lib/contentstack-delivery';
import { createMockNextRequest, mockContentstackDeliveryResponses, mockManifestCookie } from '@/test-utils/api-route-mock-data';

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

describe('/api/price-filters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch price filters successfully', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/price-filters');
    mockGetAllEntries.mockResolvedValue(mockContentstackDeliveryResponses.priceFilter.success);

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(mockGetAllEntries).toHaveBeenCalledWith('price_filter', undefined);
    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      items: [
        {
          id: 'price_filter_1',
          title: 'Budget',
          minPrice: 0,
          maxPrice: 500,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'price_filter_2',
          title: 'Mid-range',
          minPrice: 500,
          maxPrice: 1000,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'price_filter_3',
          title: 'Premium',
          minPrice: 1000,
          maxPrice: 2000,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        }
      ],
      total: 3,
      personalized: false,
      variantParam: null
    });
  });

  it('should handle personalized requests', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/price-filters', {
      searchParams: { cs_personalize: 'exp_123_var_456' }
    });
    mockGetAllEntries.mockResolvedValue(mockContentstackDeliveryResponses.priceFilter.success);

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(mockGetAllEntries).toHaveBeenCalledWith('price_filter', 'exp_123_var_456');
    expect(response.status).toBe(200);
    expect(responseData.personalized).toBe(true);
    expect(responseData.variantParam).toBe('exp_123_var_456');
  });

  it('should handle manifest cookie fallback when variant param is 0_null', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/price-filters', {
      searchParams: { cs_personalize: '0_null' },
      headers: { cookie: mockManifestCookie.valid }
    });
    mockGetAllEntries.mockResolvedValue(mockContentstackDeliveryResponses.priceFilter.success);

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(mockGetAllEntries).toHaveBeenCalledWith('price_filter', 'exp_123_var_456');
    expect(response.status).toBe(200);
    expect(responseData.personalized).toBe(true);
    expect(responseData.variantParam).toBe('exp_123_var_456');
  });

  it('should handle invalid manifest cookie gracefully', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/price-filters', {
      searchParams: { cs_personalize: '0_null' },
      headers: { cookie: mockManifestCookie.invalid }
    });
    mockGetAllEntries.mockResolvedValue(mockContentstackDeliveryResponses.priceFilter.success);

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(mockGetAllEntries).toHaveBeenCalledWith('price_filter', '0_null');
    expect(response.status).toBe(200);
    expect(responseData.personalized).toBe(true);
    expect(responseData.variantParam).toBe('0_null');
  });

  it('should handle empty manifest cookie', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/price-filters', {
      searchParams: { cs_personalize: '0_null' },
      headers: { cookie: mockManifestCookie.empty }
    });
    mockGetAllEntries.mockResolvedValue(mockContentstackDeliveryResponses.priceFilter.success);

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(mockGetAllEntries).toHaveBeenCalledWith('price_filter', '0_null');
    expect(response.status).toBe(200);
    expect(responseData.personalized).toBe(true);
    expect(responseData.variantParam).toBe('0_null');
  });

  it('should handle empty Contentstack response', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/price-filters');
    mockGetAllEntries.mockResolvedValue(mockContentstackDeliveryResponses.priceFilter.empty);

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      items: [],
      total: 0,
      personalized: false,
      variantParam: null,
      message: 'No price filter data found',
      timestamp: expect.any(String)
    });
  });

  it('should handle Contentstack API errors', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/price-filters');
    mockGetAllEntries.mockRejectedValue(mockContentstackDeliveryResponses.priceFilter.error);

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      items: [],
      total: 0,
      personalized: false,
      variantParam: null,
      message: 'No price filter data found',
      timestamp: expect.any(String)
    });
  });

  it('should handle unexpected errors', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/price-filters');
    mockGetAllEntries.mockRejectedValue('String error');

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      items: [],
      total: 0,
      personalized: false,
      variantParam: null,
      message: 'No price filter data found',
      timestamp: expect.any(String)
    });
  });

  it('should handle Error objects in unexpected errors', async () => {
    // Arrange
    const request = createMockNextRequest('http://localhost:3000/api/price-filters');
    const error = new Error('Test error message');
    mockGetAllEntries.mockRejectedValue(error);

    // Act
    const response = await GET(request);
    const responseData = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      items: [],
      total: 0,
      personalized: false,
      variantParam: null,
      message: 'No price filter data found',
      timestamp: expect.any(String)
    });
  });
});
