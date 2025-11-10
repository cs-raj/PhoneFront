// Mock data for API route tests

// Mock Contentstack Management SDK responses
export const mockContentstackManagementResponses = {
  createFeedbackEntry: {
    success: {
      success: true,
      uid: 'feedback_123',
      entry: {
        uid: 'feedback_123',
        title: 'Test Feedback',
        email: 'test@example.com',
        message: 'This is a test feedback message',
        feedback_type: 'general',
        status: 'new',
        created_at: '2024-01-15T10:30:00Z',
        source: 'contact_form'
      }
    },
    error: new Error('Failed to create feedback entry')
  },
  
  getFeedbackEntries: {
    success: {
      success: true,
      entries: [
        {
          uid: 'feedback_123',
          title: 'Test Feedback 1',
          email: 'test1@example.com',
          message: 'First feedback message',
          feedback_type: 'general',
          status: 'new',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          uid: 'feedback_456',
          title: 'Test Feedback 2',
          email: 'test2@example.com',
          message: 'Second feedback message',
          feedback_type: 'bug_report',
          status: 'new',
          created_at: '2024-01-15T11:30:00Z'
        }
      ],
      count: 2,
      total: 2
    },
    error: new Error('Failed to fetch feedback entries')
  }
};

// Mock Contentstack Delivery SDK responses
export const mockContentstackDeliveryResponses = {
  footer: {
    success: {
      entries: [
        {
          uid: 'footer_123',
          title: 'Main Footer',
          navigation_links: [
            { title: 'Home', url: '/', target: '_self' },
            { title: 'About', url: '/about', target: '_self' },
            { title: 'Contact', url: '/contact', target: '_self' }
          ],
          social_media_links: [
            { platform: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
            { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' }
          ],
          contact_information: {
            email: 'contact@phonefront.com',
            phone: '+1-555-0123',
            address: '123 Tech Street, City, State 12345'
          },
          copyright_text: '© 2024 PhoneFront. All rights reserved.',
          locale: 'en-us',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        }
      ],
      count: 1
    },
    empty: {
      entries: [],
      count: 0
    },
    error: new Error('Contentstack API error')
  },
  
  header: {
    success: {
      entries: [
        {
          uid: 'header_123',
          title: 'Main Header',
          logo: {
            title: 'PhoneFront Logo',
            url: 'https://example.com/logo.png',
            alt: 'PhoneFront Logo'
          },
          group: [
            {
              title: 'Navigation',
              links: [
                { title: 'Home', url: '/', target: '_self' },
                { title: 'Phones', url: '/phones', target: '_self' },
                { title: 'Reviews', url: '/reviews', target: '_self' }
              ]
            }
          ],
          tags: ['main', 'navigation'],
          locale: 'en-us',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        }
      ],
      count: 1
    },
    empty: {
      entries: [],
      count: 0
    },
    error: new Error('Contentstack API error')
  },
  
  priceFilter: {
    success: {
      entries: [
        {
          uid: 'price_filter_1',
          title: 'Budget',
          min_price: 0,
          max_price: 500,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          uid: 'price_filter_2',
          title: 'Mid-range',
          min_price: 500,
          max_price: 1000,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          uid: 'price_filter_3',
          title: 'Premium',
          min_price: 1000,
          max_price: 2000,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        }
      ],
      count: 3
    },
    empty: {
      entries: [],
      count: 0
    },
    error: new Error('Contentstack API error')
  }
};

// Mock request data for API routes
export const mockFeedbackRequestData = {
  valid: {
    title: 'Test Feedback',
    email: 'test@example.com',
    message: 'This is a test feedback message',
    feedback_type: 'general'
  },
  invalid: {
    title: '',
    email: '',
    message: 'Missing required fields'
  },
  minimal: {
    title: 'Minimal Feedback',
    email: 'minimal@example.com'
  }
};

// Mock manifest cookie data
export const mockManifestCookie = {
  valid: 'cs-personalize-manifest=%7B%22activeVariants%22%3A%7B%22exp_123%22%3A%22var_456%22%7D%7D',
  invalid: 'cs-personalize-manifest=invalid-json',
  empty: 'cs-personalize-manifest=%7B%22activeVariants%22%3A%7B%7D%7D'
};

// Mock Personalize SDK responses
export const mockPersonalizeResponses = {
  variantParamToVariantAliases: {
    'exp_123_var_456': ['exp_123_var_456'],
    'exp_789_var_012': ['exp_789_var_012'],
    '0_null': []
  },
  triggerImpression: {
    success: Promise.resolve(),
    error: new Error('Failed to trigger impression')
  },
  triggerImpressions: {
    success: Promise.resolve(),
    error: new Error('Failed to trigger impressions')
  }
};

// Mock NextRequest objects for testing
export const createMockNextRequest = (url: string, options: {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  searchParams?: Record<string, string>;
} = {}) => {
  const { method = 'GET', body, headers = {}, searchParams = {} } = options;
  
  // Build URL with search params
  const urlObj = new URL(url);
  Object.entries(searchParams).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });
  
  const request = new Request(urlObj.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  // Add NextRequest properties including json method
  return Object.assign(request, {
    json: async () => {
      if (body) {
        return body;
      }
      throw new Error('No body provided');
    },
    cookies: {
      getAll: () => [],
      get: () => undefined,
      has: () => false,
      set: () => {},
      delete: () => {},
      toString: () => ''
    },
    geo: {
      city: '',
      country: '',
      region: '',
      latitude: '',
      longitude: ''
    },
    ip: '',
    nextUrl: urlObj,
    headers: request.headers
  });
};

// Mock NextResponse for testing
export const mockNextResponse = {
  json: jest.fn((data: any, init?: ResponseInit) => {
    return new Response(JSON.stringify(data), {
      status: init?.status || 200,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers
      }
    });
  })
};

// Mock environment variables
export const mockEnvVars = {
  contentstack: {
    apiKey: 'test_api_key',
    deliveryToken: 'test_delivery_token',
    environment: 'test_environment',
    region: 'us',
    managementToken: 'test_management_token'
  }
};
