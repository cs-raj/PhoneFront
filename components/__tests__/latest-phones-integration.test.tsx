import { render, screen, waitFor } from '@testing-library/react'
import { LatestPhones } from '../home/latest-phones'
import { mockPhones } from '../../test-utils/mock-data'

// Mock useSWR as it's used by LatestPhones
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const mockUseSWR = require('swr').default

describe('LatestPhones Integration Tests', () => {
  const mockPhonesResponse = {
    items: mockPhones,
    total: mockPhones.length,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSWR.mockReturnValue({
      data: mockPhonesResponse,
      isLoading: false,
      error: undefined,
    });
  });

  it('should render phones with mock data', async () => {
    render(<LatestPhones />);

    await waitFor(() => {
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      expect(screen.getByText('Samsung Galaxy S24 Ultra')).toBeInTheDocument();
    });
  });

  it('should display phone information correctly', () => {
    render(<LatestPhones />);
    
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy S24 Ultra')).toBeInTheDocument();
    expect(screen.getByText('$999')).toBeInTheDocument();
    expect(screen.getByText('$1199')).toBeInTheDocument();
  });

  it('should display phone specifications', () => {
    render(<LatestPhones />);
    
    expect(screen.getByText('6.1" Super Retina XDR')).toBeInTheDocument();
    expect(screen.getByText('6.8" Dynamic AMOLED 2X')).toBeInTheDocument();
    expect(screen.getByText('Up to 23 hours video playback')).toBeInTheDocument();
    expect(screen.getByText('Up to 24 hours video playback')).toBeInTheDocument();
    expect(screen.getByText('48MP Main, 12MP Ultra Wide, 12MP Telephoto')).toBeInTheDocument();
    expect(screen.getByText('200MP Main, 12MP Ultra Wide, 10MP Telephoto')).toBeInTheDocument();
  });

  it('should display phone brands', () => {
    render(<LatestPhones />);
    
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Samsung')).toBeInTheDocument();
  });

  it('should display taxonomies as badges', () => {
    render(<LatestPhones />);
    
    expect(screen.getAllByText('Flagship')).toHaveLength(2); // Multiple phones have Flagship taxonomy
    expect(screen.getByText('iOS')).toBeInTheDocument();
    expect(screen.getByText('Android')).toBeInTheDocument();
  });

  it('should display view details buttons', () => {
    render(<LatestPhones />);
    
    const viewDetailsButtons = screen.getAllByText('View Details');
    expect(viewDetailsButtons).toHaveLength(2);
  });

  it('should handle loading state', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
    });

    render(<LatestPhones />);
    
    // Should show skeleton loading cards - look for animate-pulse class instead of testid
    const skeletonCards = document.querySelectorAll('.animate-pulse');
    expect(skeletonCards.length).toBeGreaterThan(0);
  });

  it('should handle error state', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('API Error'),
    });

    render(<LatestPhones />);
    
    expect(screen.getByText('No phones available at the moment.')).toBeInTheDocument();
  });

  it('should handle empty data', () => {
    mockUseSWR.mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
      error: undefined,
    });

    render(<LatestPhones />);
    
    expect(screen.getByText('No phones available at the moment.')).toBeInTheDocument();
  });

  it('should have correct grid layout', () => {
    render(<LatestPhones />);
    
    // Find the main grid container by looking for the grid with multiple columns
    const grid = document.querySelector('div[class*="grid-cols-1"][class*="sm:grid-cols-2"]');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid');
  });

  it('should display phone images', () => {
    render(<LatestPhones />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    
    expect(images[0]).toHaveAttribute('alt', 'iPhone 15 Pro');
    expect(images[1]).toHaveAttribute('alt', 'Samsung Galaxy S24 Ultra');
  });

  it('should have proper links to phone details', () => {
    render(<LatestPhones />);
    
    const phoneLinks = screen.getAllByLabelText(/View details for/);
    expect(phoneLinks).toHaveLength(2);
    
    expect(phoneLinks[0]).toHaveAttribute('href', '/phone/iphone-15-pro');
    expect(phoneLinks[1]).toHaveAttribute('href', '/phone/samsung-galaxy-s24-ultra');
  });

  it('should display phone cards with proper styling', () => {
    render(<LatestPhones />);
    
    // Find the main card container by looking for the card with proper styling
    const card = document.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('h-full', 'flex', 'flex-col');
  });

  it('should display taxonomy badges with proper styling', () => {
    render(<LatestPhones />);
    
    const taxonomyButtons = screen.getAllByText('Flagship');
    expect(taxonomyButtons.length).toBeGreaterThan(0);
    
    taxonomyButtons.forEach(button => {
      expect(button).toHaveClass('inline-flex', 'items-center', 'px-2.5', 'py-1', 'rounded-full', 'text-xs', 'font-medium', 'border', 'transition-all', 'duration-200', 'hover:scale-105', 'hover:shadow-sm', 'cursor-pointer');
    });
  });
});
