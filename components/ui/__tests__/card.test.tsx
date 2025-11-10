import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render with default props', () => {
      render(<Card>Card content</Card>)
      
      const card = screen.getByText('Card content')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('bg-card', 'text-card-foreground')
    })

    it('should accept custom className', () => {
      render(<Card className="custom-card">Custom Card</Card>)
      
      const card = screen.getByText('Custom Card')
      expect(card).toHaveClass('custom-card')
    })

    it('should handle click events', async () => {
      const handleClick = jest.fn()
      render(<Card onClick={handleClick}>Clickable Card</Card>)
      
      const card = screen.getByText('Clickable Card')
      await userEvent.click(card)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('CardHeader', () => {
    it('should render with default props', () => {
      render(
        <Card>
          <CardHeader>Header content</CardHeader>
        </Card>
      )
      
      const header = screen.getByText('Header content')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('grid')
    })

    it('should accept custom className', () => {
      render(
        <Card>
          <CardHeader className="custom-header">Custom Header</CardHeader>
        </Card>
      )
      
      const header = screen.getByText('Custom Header')
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('CardTitle', () => {
    it('should render with default props', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
        </Card>
      )
      
      const title = screen.getByText('Card Title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('font-semibold', 'leading-none')
    })

    it('should accept custom className', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle className="custom-title">Custom Title</CardTitle>
          </CardHeader>
        </Card>
      )
      
      const title = screen.getByText('Custom Title')
      expect(title).toHaveClass('custom-title')
    })

    it('should render as different HTML elements', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle asChild>
              <h1>H1 Title</h1>
            </CardTitle>
          </CardHeader>
        </Card>
      )
      
      const title = screen.getByRole('heading', { level: 1 })
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('H1 Title')
    })
  })

  describe('CardDescription', () => {
    it('should render with default props', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
        </Card>
      )
      
      const description = screen.getByText('Card description text')
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })

    it('should accept custom className', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription className="custom-description">Custom Description</CardDescription>
          </CardHeader>
        </Card>
      )
      
      const description = screen.getByText('Custom Description')
      expect(description).toHaveClass('custom-description')
    })
  })

  describe('CardContent', () => {
    it('should render with default props', () => {
      render(
        <Card>
          <CardContent>Card content text</CardContent>
        </Card>
      )
      
      const content = screen.getByText('Card content text')
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('px-6')
    })

    it('should accept custom className', () => {
      render(
        <Card>
          <CardContent className="custom-content">Custom Content</CardContent>
        </Card>
      )
      
      const content = screen.getByText('Custom Content')
      expect(content).toHaveClass('custom-content')
    })
  })

  describe('CardFooter', () => {
    it('should render with default props', () => {
      render(
        <Card>
          <CardFooter>Footer content</CardFooter>
        </Card>
      )
      
      const footer = screen.getByText('Footer content')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('flex', 'items-center')
    })

    it('should accept custom className', () => {
      render(
        <Card>
          <CardFooter className="custom-footer">Custom Footer</CardFooter>
        </Card>
      )
      
      const footer = screen.getByText('Custom Footer')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('Complete Card Structure', () => {
    it('should render a complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Product Name</CardTitle>
            <CardDescription>Product description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Product details and specifications</p>
          </CardContent>
          <CardFooter>
            <button>Add to Cart</button>
          </CardFooter>
        </Card>
      )
      
      expect(screen.getByText('Product Name')).toBeInTheDocument()
      expect(screen.getByText('Product description')).toBeInTheDocument()
      expect(screen.getByText('Product details and specifications')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
    })

    it('should handle nested content', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Nested Card</CardTitle>
          </CardHeader>
          <CardContent>
            <Card>
              <CardContent>Nested card content</CardContent>
            </Card>
          </CardContent>
        </Card>
      )
      
      expect(screen.getByText('Nested Card')).toBeInTheDocument()
      expect(screen.getByText('Nested card content')).toBeInTheDocument()
    })

    it('should handle multiple cards', () => {
      render(
        <div>
          <Card>
            <CardContent>Card 1</CardContent>
          </Card>
          <Card>
            <CardContent>Card 2</CardContent>
          </Card>
        </div>
      )
      
      expect(screen.getByText('Card 1')).toBeInTheDocument()
      expect(screen.getByText('Card 2')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should be accessible with proper ARIA attributes', () => {
      render(
        <Card role="article">
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
          </CardHeader>
          <CardContent>Card content</CardContent>
        </Card>
      )
      
      const card = screen.getByRole('article')
      expect(card).toBeInTheDocument()
    })

    it('should support keyboard navigation', () => {
      render(
        <Card tabIndex={0}>
          <CardContent>Focusable card</CardContent>
        </Card>
      )
      
      const card = screen.getByText('Focusable card')
      expect(card.closest('[tabindex="0"]')).toBeInTheDocument()
    })
  })
})
