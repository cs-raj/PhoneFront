import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Badge } from '../badge'

describe('Badge', () => {
  it('should render with default props', () => {
    render(<Badge>Default Badge</Badge>)
    
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('inline-flex', 'items-center')
  })

  it('should render with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    expect(screen.getByText('Default')).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground')

    rerender(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toHaveClass('border-transparent', 'bg-secondary', 'text-secondary-foreground')

    rerender(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive')

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toHaveClass('text-foreground')
  })

  it('should accept custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>)
    
    const badge = screen.getByText('Custom')
    expect(badge).toHaveClass('custom-badge')
  })

  it('should render with different content types', () => {
    render(
      <div>
        <Badge>Text Badge</Badge>
        <Badge>123</Badge>
        <Badge>⭐ Star</Badge>
      </div>
    )
    
    expect(screen.getByText('Text Badge')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('⭐ Star')).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = jest.fn()
    render(<Badge onClick={handleClick}>Clickable Badge</Badge>)
    
    const badge = screen.getByText('Clickable Badge')
    await userEvent.click(badge)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should render as different HTML elements', () => {
    render(
      <div>
        <Badge asChild>
          <span data-testid="span-badge">Span Badge</span>
        </Badge>
        <Badge asChild>
          <div data-testid="div-badge">Div Badge</div>
        </Badge>
      </div>
    )
    
    expect(screen.getByTestId('span-badge')).toBeInTheDocument()
    expect(screen.getByTestId('div-badge')).toBeInTheDocument()
  })

  it('should handle multiple badges', () => {
    render(
      <div>
        <Badge variant="default">Badge 1</Badge>
        <Badge variant="secondary">Badge 2</Badge>
        <Badge variant="destructive">Badge 3</Badge>
      </div>
    )
    
    expect(screen.getByText('Badge 1')).toBeInTheDocument()
    expect(screen.getByText('Badge 2')).toBeInTheDocument()
    expect(screen.getByText('Badge 3')).toBeInTheDocument()
  })

  it('should handle long text content', () => {
    const longText = 'This is a very long badge text that should still be displayed correctly'
    render(<Badge>{longText}</Badge>)
    
    const badge = screen.getByText(longText)
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent(longText)
  })

  it('should handle special characters', () => {
    render(
      <div>
        <Badge>@username</Badge>
        <Badge>#hashtag</Badge>
        <Badge>$100</Badge>
        <Badge>100%</Badge>
      </div>
    )
    
    expect(screen.getByText('@username')).toBeInTheDocument()
    expect(screen.getByText('#hashtag')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('should handle empty content', () => {
    render(<Badge data-testid="empty-badge"></Badge>)
    
    const badge = screen.getByTestId('empty-badge')
    expect(badge).toBeInTheDocument()
  })

  it('should handle numeric content', () => {
    render(
      <div>
        <Badge>0</Badge>
        <Badge>42</Badge>
        <Badge>999</Badge>
      </div>
    )
    
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('999')).toBeInTheDocument()
  })

  it('should handle boolean content', () => {
    render(
      <div>
        <Badge data-testid="true-badge">{true}</Badge>
        <Badge data-testid="false-badge">{false}</Badge>
      </div>
    )
    
    expect(screen.getByTestId('true-badge')).toBeInTheDocument()
    expect(screen.getByTestId('false-badge')).toBeInTheDocument()
  })

  it('should handle null and undefined content', () => {
    render(
      <div>
        <Badge data-testid="null-badge">{null}</Badge>
        <Badge data-testid="undefined-badge">{undefined}</Badge>
      </div>
    )
    
    expect(screen.getByTestId('null-badge')).toBeInTheDocument()
    expect(screen.getByTestId('undefined-badge')).toBeInTheDocument()
  })

  it('should maintain consistent styling across variants', () => {
    const { rerender } = render(<Badge variant="default">Test</Badge>)
    const defaultClasses = screen.getByText('Test').className

    rerender(<Badge variant="secondary">Test</Badge>)
    const secondaryClasses = screen.getByText('Test').className

    // Both should have the base classes
    expect(defaultClasses).toContain('inline-flex')
    expect(secondaryClasses).toContain('inline-flex')
    expect(defaultClasses).toContain('items-center')
    expect(secondaryClasses).toContain('items-center')
  })
})
