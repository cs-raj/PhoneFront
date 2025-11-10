import { render, screen, waitFor } from '@testing-library/react'
import { HeroSection } from '../home/hero-section'
import { mockHomePage } from '../../test-utils/mock-data'

// Mock fetch for API calls
global.fetch = jest.fn()

describe('HeroSection Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockHomePage),
    });
  });

  it('should render hero section with mock data', async () => {
    render(<HeroSection />);

    await waitFor(() => {
      expect(screen.getByText('Discover the Latest')).toBeInTheDocument();
      expect(screen.getByText('Smartphones')).toBeInTheDocument();
    });
  });

  it('should display hero headline and highlight text', async () => {
    render(<HeroSection />);

    await waitFor(() => {
      expect(screen.getByText('Discover the Latest')).toBeInTheDocument();
      expect(screen.getByText('Smartphones')).toBeInTheDocument();
    });
  });

  it('should display hero subheadline', async () => {
    render(<HeroSection />);

    await waitFor(() => {
      expect(screen.getByText('Find the perfect smartphone for your needs with our comprehensive reviews and comparisons')).toBeInTheDocument();
    });
  });

  it('should display badge text', async () => {
    render(<HeroSection />);

    await waitFor(() => {
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });
  });

  it('should display CTA buttons', async () => {
    render(<HeroSection />);

    await waitFor(() => {
      expect(screen.getByText('Browse Phones')).toBeInTheDocument();
      expect(screen.getByText('Read Reviews')).toBeInTheDocument();
    });
  });

  it('should display stats', async () => {
    render(<HeroSection />);

    await waitFor(() => {
      expect(screen.getByText('500+')).toBeInTheDocument();
      expect(screen.getByText('50+')).toBeInTheDocument();
      expect(screen.getByText('1000+')).toBeInTheDocument();
      expect(screen.getByText('Phones Reviewed')).toBeInTheDocument();
      expect(screen.getByText('Expert Reviews')).toBeInTheDocument();
      expect(screen.getByText('Happy Users')).toBeInTheDocument();
    });
  });

  it('should handle loading state', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<HeroSection />);
    
    // Should show loading skeleton - check for animate-pulse class directly
    const skeletonContainer = document.querySelector('.animate-pulse');
    expect(skeletonContainer).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<HeroSection />);

    // Should show loading state when API fails
    const skeletonContainer = document.querySelector('.animate-pulse');
    expect(skeletonContainer).toBeInTheDocument();
  });

  it('should handle missing API data with loading state', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<HeroSection />);

    // Should show loading state when no hero data
    const skeletonContainer = document.querySelector('.animate-pulse');
    expect(skeletonContainer).toBeInTheDocument();
  });

  it('should have correct section styling', async () => {
    render(<HeroSection />);

    await waitFor(() => {
      const section = screen.getByText('Discover the Latest').closest('section');
      expect(section).toHaveClass('relative', 'overflow-hidden', 'bg-gradient-to-br', 'from-primary/5', 'via-background', 'to-accent/5');
    });
  });

  it('should display proper button links', async () => {
    render(<HeroSection />);

    await waitFor(() => {
      const browsePhonesLink = screen.getByText('Browse Phones').closest('a');
      const readReviewsLink = screen.getByText('Read Reviews').closest('a');
      
      expect(browsePhonesLink).toHaveAttribute('href', '/phones');
      expect(readReviewsLink).toHaveAttribute('href', '/reviews');
    });
  });

  it('should display button icons', async () => {
    render(<HeroSection />);

    await waitFor(() => {
      // Check for arrow icons in buttons - look for SVG elements with arrow-right class
      const arrowIcons = screen.getAllByText('Browse Phones')[0].closest('a')?.querySelectorAll('svg.lucide-arrow-right');
      expect(arrowIcons?.length).toBeGreaterThan(0);
    });
  });

  it('should display star icon in badge', async () => {
    render(<HeroSection />);

    await waitFor(() => {
      // Check for star icon in badge - look for SVG with star class
      const badgeElement = screen.getByText('Featured').closest('div');
      const starIcon = badgeElement?.querySelector('svg.lucide-star');
      expect(starIcon).toBeInTheDocument();
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });
  });

  it('should have proper grid layout for stats', async () => {
    render(<HeroSection />);

    await waitFor(() => {
      const statsGrid = screen.getByText('500+').closest('div[class*="grid"]');
      expect(statsGrid).toHaveClass('grid', 'grid-cols-3', 'gap-4', 'pt-8', 'md:pt-12');
    });
  });

  it('should display gradient text for highlight', async () => {
    render(<HeroSection />);

    await waitFor(() => {
      const highlightText = screen.getByText('Smartphones');
      expect(highlightText).toHaveClass('bg-gradient-to-r', 'from-primary', 'to-accent', 'bg-clip-text', 'text-transparent');
    });
  });

  it('should handle custom hero data', async () => {
    const customHomePage = {
      ...mockHomePage,
      hero_section: {
        ...mockHomePage.hero_section,
        headline: 'Custom Headline',
        highlight_text: 'Custom Highlight',
        subheadline: 'Custom subheadline text',
        badge_text: 'Custom Badge',
        cta_buttons: [
          {
            button_text: 'Custom Button',
            button_link: { href: '/custom' },
            button_style: 'outline',
            icon_name: 'Star',
            _metadata: { uid: 'custom-button' }
          }
        ],
        stats: [
          {
            number: '999',
            label: 'Custom Stat',
            color: 'primary',
            _metadata: { uid: 'custom-stat' }
          }
        ]
      }
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(customHomePage),
    });

    render(<HeroSection />);

    await waitFor(() => {
      expect(screen.getByText('Custom Headline')).toBeInTheDocument();
      expect(screen.getByText('Custom Highlight')).toBeInTheDocument();
      expect(screen.getByText('Custom subheadline text')).toBeInTheDocument();
      expect(screen.getByText('Custom Badge')).toBeInTheDocument();
      expect(screen.getByText('Custom Button')).toBeInTheDocument();
      expect(screen.getByText('999')).toBeInTheDocument();
      expect(screen.getByText('Custom Stat')).toBeInTheDocument();
    });
  });
});
