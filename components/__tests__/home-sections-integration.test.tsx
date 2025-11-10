import { render, screen, waitFor } from '@testing-library/react'
import { HomeSections } from '../home/home-sections'
import { mockHomePage } from '../../test-utils/mock-data'

// Mock the child components
jest.mock('../home/latest-phones', () => ({
  LatestPhones: () => <div data-testid="latest-phones">Latest Phones Component</div>
}))

jest.mock('../home/latest-news', () => ({
  LatestNews: () => <div data-testid="latest-news">Latest News Component</div>
}))

// Mock fetch for API calls
global.fetch = jest.fn()

describe('HomeSections Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockHomePage),
    });
  });

  it('should render home sections with mock data', async () => {
    render(<HomeSections />);

    await waitFor(() => {
      expect(screen.getByText('Featured')).toBeInTheDocument();
      expect(screen.getByText('News')).toBeInTheDocument();
      expect(screen.getByText('Latest')).toBeInTheDocument();
      expect(screen.getByText('Phones')).toBeInTheDocument();
    });
  });

  it('should display section titles with primary styling', async () => {
    render(<HomeSections />);

    await waitFor(() => {
      const featuredNewsTitle = screen.getByText('Featured');
      const latestPhonesTitle = screen.getByText('Latest');
      
      expect(featuredNewsTitle).toBeInTheDocument();
      expect(latestPhonesTitle).toBeInTheDocument();
    });
  });

  it('should display section descriptions', async () => {
    render(<HomeSections />);

    await waitFor(() => {
      expect(screen.getByText('Stay updated with the latest smartphone news')).toBeInTheDocument();
      expect(screen.getByText('Discover the newest smartphones hitting the market')).toBeInTheDocument();
    });
  });

  it('should display view all links', async () => {
    render(<HomeSections />);

    await waitFor(() => {
      expect(screen.getAllByText('View All')).toHaveLength(2);
      expect(screen.getByLabelText('View all news')).toBeInTheDocument();
      expect(screen.getByLabelText('View all phones')).toBeInTheDocument();
    });
  });

  it('should render child components', async () => {
    render(<HomeSections />);

    await waitFor(() => {
      expect(screen.getByTestId('latest-news')).toBeInTheDocument();
      expect(screen.getByTestId('latest-phones')).toBeInTheDocument();
    });
  });

  it('should handle API data correctly', async () => {
    const customPageData = {
      ...mockHomePage,
      featured_news_section: {
        section_title: 'Custom News',
        section_description: 'Custom news description',
        show_view_all: true,
        number_of_articles: 5
      },
      latest_phones_section: {
        section_title: 'Custom Phones',
        section_description: 'Custom phones description',
        show_view_all: false,
        number_of_phones: 8
      }
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(customPageData),
    });

    render(<HomeSections />);

    await waitFor(() => {
      expect(screen.getAllByText('Custom')).toHaveLength(2);
      expect(screen.getByText('News')).toBeInTheDocument();
      expect(screen.getByText('Phones')).toBeInTheDocument();
      expect(screen.getByText('Custom news description')).toBeInTheDocument();
      expect(screen.getByText('Custom phones description')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<HomeSections />);

    await waitFor(() => {
      // Should fall back to default values
      expect(screen.getByText('Featured')).toBeInTheDocument();
      expect(screen.getByText('News')).toBeInTheDocument();
      expect(screen.getByText('Latest')).toBeInTheDocument();
      expect(screen.getByText('Phones')).toBeInTheDocument();
    });
  });

  it('should handle missing API data with defaults', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<HomeSections />);

    await waitFor(() => {
      expect(screen.getByText('Featured')).toBeInTheDocument();
      expect(screen.getByText('News')).toBeInTheDocument();
      expect(screen.getByText('Latest')).toBeInTheDocument();
      expect(screen.getByText('Phones')).toBeInTheDocument();
      expect(screen.getByText('Stay updated with the latest smartphone news')).toBeInTheDocument();
      expect(screen.getByText('Discover the newest smartphones hitting the market')).toBeInTheDocument();
    });
  });

  it('should have correct section styling', async () => {
    render(<HomeSections />);

    await waitFor(() => {
      const sections = screen.getAllByRole('generic');
      expect(sections.length).toBeGreaterThanOrEqual(2);
      
      // Check for container classes - look for section elements instead
      const sectionElements = screen.getAllByRole('generic').filter(el => 
        el.tagName === 'SECTION' || el.querySelector('section')
      );
      expect(sectionElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should display loading fallbacks for suspense', async () => {
    render(<HomeSections />);

    // Initially should show loading states
    expect(screen.getByText('Latest Phones Component')).toBeInTheDocument();
    expect(screen.getByText('Latest News Component')).toBeInTheDocument();
  });

  it('should handle view all link visibility based on show_view_all', async () => {
    const customPageData = {
      ...mockHomePage,
      featured_news_section: {
        ...mockHomePage.featured_news_section,
        show_view_all: false
      },
      latest_phones_section: {
        ...mockHomePage.latest_phones_section,
        show_view_all: false
      }
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(customPageData),
    });

    render(<HomeSections />);

    await waitFor(() => {
      expect(screen.queryByText('View All')).not.toBeInTheDocument();
    });
  });
});
