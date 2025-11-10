import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('should render with different variants', () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary', 'text-primary-foreground')

    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive', 'text-white')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary', 'text-secondary-foreground')

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')

    rerender(<Button variant="link">Link</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-primary', 'underline-offset-4')
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9', 'px-4', 'py-2')

    rerender(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-8', 'px-3', 'rounded-md')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10', 'px-6', 'rounded-md')

    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole('button')).toHaveClass('size-9')
  })

  it('should handle click events', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
  })

  it('should not trigger click when disabled', async () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render as different HTML elements', () => {
    const { rerender } = render(<Button asChild><a href="/test">Link</a></Button>)
    expect(screen.getByRole('link')).toBeInTheDocument()

    rerender(<Button asChild><span>Span</span></Button>)
    expect(screen.getByText('Span')).toBeInTheDocument()
  })

  it('should accept custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should handle keyboard events', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Keyboard</Button>)
    
    const button = screen.getByRole('button')
    button.focus()
    await userEvent.keyboard('{Enter}')
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should handle focus and blur events', () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    render(<Button onFocus={handleFocus} onBlur={handleBlur}>Focus</Button>)
    
    const button = screen.getByRole('button')
    button.focus()
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    button.blur()
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('should render with loading state', () => {
    render(<Button disabled>Loading...</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Loading...')
  })

  it('should handle multiple clicks', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Multi Click</Button>)
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    await userEvent.click(button)
    await userEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(3)
  })

  it('should render with icon and text', () => {
    render(
      <Button>
        <span data-testid="icon">🚀</span>
        Launch
      </Button>
    )
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Launch')).toBeInTheDocument()
  })

  it('should handle form submission', () => {
    const handleSubmit = jest.fn((e) => e.preventDefault())
    render(
      <form onSubmit={handleSubmit}>
        <Button type="submit">Submit</Button>
      </form>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('should handle form reset', () => {
    render(
      <form>
        <Button type="reset">Reset</Button>
      </form>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'reset')
  })
})
