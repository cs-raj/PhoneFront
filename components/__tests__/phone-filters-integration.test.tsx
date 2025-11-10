import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PhoneFilters, DEFAULT_FILTERS } from '../phone-filters'
import { getAllEntries } from '@/lib/contentstack-delivery'

// Mock Contentstack SDK
jest.mock('@/lib/contentstack-delivery', () => ({
  getAllEntries: jest.fn(),
}))

// Mock useSWR as it's used by PhoneFilters
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// Mock PersonalizeContext
jest.mock('@/components/context/PersonalizeContext', () => ({
  usePersonalize: jest.fn(),
}))

const mockUseSWR = require('swr').default
const mockUsePersonalize = require('@/components/context/PersonalizeContext').usePersonalize

describe('PhoneFilters Integration Tests', () => {
  const mockPriceFiltersData = {
    items: [
      { id: '1', title: 'Budget', minPrice: 0, maxPrice: 500, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', title: 'Mid-range', minPrice: 500, maxPrice: 1000, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '3', title: 'Premium', minPrice: 1000, maxPrice: 2000, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    ],
    total: 3,
    personalized: false,
    variantParam: null,
  };

  const mockPersonalizeSdk = {
    set: jest.fn().mockResolvedValue({}),
    get: jest.fn().mockReturnValue({}),
    track: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getAllEntries as jest.Mock).mockResolvedValue({
      entries: [],
      count: 0,
    });
    
    mockUseSWR.mockReturnValue({
      data: mockPriceFiltersData,
      isLoading: false,
      error: undefined,
    });
    
    mockUsePersonalize.mockReturnValue(mockPersonalizeSdk);
    
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  it('should render all filter sections', () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    expect(screen.getByText('Filter Phones')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Operating System')).toBeInTheDocument();
    expect(screen.getByText('Phone Type')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Screen Type')).toBeInTheDocument();
    expect(screen.getByText('Release Status')).toBeInTheDocument();
    expect(screen.getByText('Price Range ($)')).toBeInTheDocument();
  });

  it('should display company options', () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Samsung')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('OnePlus')).toBeInTheDocument();
  });

  it('should display OS options', () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    expect(screen.getByText('iOS')).toBeInTheDocument();
    expect(screen.getByText('Android')).toBeInTheDocument();
  });

  it('should display phone type options', () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    expect(screen.getByText('Compact')).toBeInTheDocument();
    expect(screen.getByText('Rugged')).toBeInTheDocument();
    expect(screen.getByText('Camera')).toBeInTheDocument();
    expect(screen.getByText('Gaming')).toBeInTheDocument();
    expect(screen.getByText('Flagship')).toBeInTheDocument();
    expect(screen.getByText('Mid-level')).toBeInTheDocument();
    expect(screen.getByText('Budget')).toBeInTheDocument();
  });

  it('should display feature options', () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    expect(screen.getByText('Water Resistant')).toBeInTheDocument();
    expect(screen.getByText('Stylus Support')).toBeInTheDocument();
    expect(screen.getByText('Wireless Charging')).toBeInTheDocument();
    expect(screen.getByText('Foldable')).toBeInTheDocument();
    expect(screen.getByText('5G')).toBeInTheDocument();
  });

  it('should display screen type options', () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    expect(screen.getByText('Mini LED')).toBeInTheDocument();
    expect(screen.getByText('Micro LED')).toBeInTheDocument();
    expect(screen.getByText('OLED')).toBeInTheDocument();
    expect(screen.getByText('LCD')).toBeInTheDocument();
    expect(screen.getByText('LED')).toBeInTheDocument();
  });

  it('should display release status options', () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    expect(screen.getByText('Discontinued')).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Announced')).toBeInTheDocument();
  });

  it('should display price range slider and inputs', () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
  });

  it('should display apply and clear buttons', () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    expect(screen.getByText('Apply Filters')).toBeInTheDocument();
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('should handle checkbox toggles', () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    const appleCheckbox = screen.getByLabelText('Apple');
    fireEvent.click(appleCheckbox);
    
    expect(appleCheckbox).toBeChecked();
  });

  it('should handle price range slider changes', () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    const minInput = screen.getByDisplayValue('0');
    const maxInput = screen.getByDisplayValue('2000');
    
    fireEvent.change(minInput, { target: { value: '100' } });
    fireEvent.change(maxInput, { target: { value: '1500' } });
    
    expect(minInput).toHaveValue('100');
    expect(maxInput).toHaveValue('1500');
  });

  it('should call onApply when apply button is clicked', async () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);
    
    await waitFor(() => {
      expect(mockOnApply).toHaveBeenCalledWith({
        companies: [],
        os: [],
        priceRange: [],
        features: [],
        screenType: [],
        phoneType: [],
        releaseStatus: [],
        priceMin: 0,
        priceMax: 2000,
      });
    });
  });

  it('should call onApply with cleared filters when clear button is clicked', async () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);
    
    await waitFor(() => {
      expect(mockOnApply).toHaveBeenCalledWith({
        companies: [],
        os: [],
        priceRange: [],
        features: [],
        screenType: [],
        phoneType: [],
        releaseStatus: [],
        priceMin: 0,
        priceMax: 2000,
      });
    });
  });

  it('should handle multiple filter selections', () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    // Select multiple companies
    fireEvent.click(screen.getByLabelText('Apple'));
    fireEvent.click(screen.getByLabelText('Samsung'));
    
    // Select OS
    fireEvent.click(screen.getByLabelText('iOS'));
    
    // Select phone type
    fireEvent.click(screen.getByLabelText('Flagship'));
    
    expect(screen.getByLabelText('Apple')).toBeChecked();
    expect(screen.getByLabelText('Samsung')).toBeChecked();
    expect(screen.getByLabelText('iOS')).toBeChecked();
    expect(screen.getByLabelText('Flagship')).toBeChecked();
  });

  it('should set budget cookie when personalization SDK is available', async () => {
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={DEFAULT_FILTERS} onApply={mockOnApply} />);
    
    const applyButton = screen.getByText('Apply Filters');
    fireEvent.click(applyButton);
    
    await waitFor(() => {
      expect(mockPersonalizeSdk.set).toHaveBeenCalledWith({ budget: expect.any(String) });
    });
  });

  it('should handle initial filters with pre-selected values', () => {
    const initialFilters = {
      ...DEFAULT_FILTERS,
      companies: ['apple', 'samsung'],
      os: ['ios'],
      phoneType: ['flagship'],
      priceMin: 500,
      priceMax: 1500,
    };
    
    const mockOnApply = jest.fn();
    render(<PhoneFilters initial={initialFilters} onApply={mockOnApply} />);
    
    expect(screen.getByLabelText('Apple')).toBeChecked();
    expect(screen.getByLabelText('Samsung')).toBeChecked();
    expect(screen.getByLabelText('iOS')).toBeChecked();
    expect(screen.getByLabelText('Flagship')).toBeChecked();
    // The component resets range to API min/max (0, 2000) when API data loads
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
  });
});
