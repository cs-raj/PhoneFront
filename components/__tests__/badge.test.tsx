import { render, screen } from '@testing-library/react'
import { Badge } from '../ui/badge'

describe('Badge', () => {
  it('should render without crashing', () => {
    render(<Badge>Badge content</Badge>)
    
    expect(screen.getByText('Badge content')).toBeInTheDocument()
  })

  it('should render with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    expect(screen.getByText('Default')).toHaveClass('bg-primary', 'text-primary-foreground')

    rerender(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary', 'text-secondary-foreground')

    rerender(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive', 'text-white')

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toHaveClass('text-foreground')
  })

  it('should apply custom className', () => {
    render(<Badge className="custom-class">Custom badge</Badge>)
    
    expect(screen.getByText('Custom badge')).toHaveClass('custom-class')
  })

  it('should have correct default classes', () => {
    render(<Badge>Default Badge</Badge>)
    
    const badge = screen.getByText('Default Badge')
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-md',
      'px-2',
      'py-0.5',
      'text-xs',
      'font-medium',
      'w-fit',
      'whitespace-nowrap',
      'shrink-0',
      '[&>svg]:size-3',
      'gap-1',
      '[&>svg]:pointer-events-none',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[3px]',
      'aria-invalid:ring-destructive/20',
      'dark:aria-invalid:ring-destructive/40',
      'aria-invalid:border-destructive',
      'transition-[color,box-shadow]',
      'overflow-hidden',
      'border-transparent',
      '[a&]:hover:bg-primary/90'
    )
  })

  it('should handle focus states', () => {
    render(<Badge>Focusable badge</Badge>)
    
    const badge = screen.getByText('Focusable badge')
    expect(badge).toHaveClass('focus-visible:border-ring', 'focus-visible:ring-ring/50', 'focus-visible:ring-[3px]')
  })

  it('should handle aria-invalid states', () => {
    render(<Badge aria-invalid>Invalid badge</Badge>)
    
    const badge = screen.getByText('Invalid badge')
    expect(badge).toHaveClass('aria-invalid:ring-destructive/20', 'dark:aria-invalid:ring-destructive/40', 'aria-invalid:border-destructive')
  })


  it('should render as link when wrapped in anchor', () => {
    render(
      <a href="/test">
        <Badge>Link badge</Badge>
      </a>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveTextContent('Link badge')
  })

  it('should handle SVG icons', () => {
    render(
      <Badge>
        <svg data-testid="icon" />
        Badge with icon
      </Badge>
    )
    
    const badge = screen.getByText('Badge with icon')
    const icon = screen.getByTestId('icon')
    
    expect(badge).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
  })

  it('should handle long text content', () => {
    render(<Badge>This is a very long badge text that should be handled properly</Badge>)
    
    const badge = screen.getByText('This is a very long badge text that should be handled properly')
    expect(badge).toHaveClass('whitespace-nowrap', 'shrink-0')
  })

  it('should support different sizes through className', () => {
    render(<Badge className="text-sm px-3 py-1">Large badge</Badge>)
    
    const badge = screen.getByText('Large badge')
    expect(badge).toHaveClass('text-sm', 'px-3', 'py-1')
  })
})
