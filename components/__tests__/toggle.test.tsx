import { render, screen, fireEvent } from '@testing-library/react'
import { Toggle } from '../ui/toggle'

describe('Toggle', () => {
  it('should render without crashing', () => {
    render(<Toggle>Toggle me</Toggle>)
    
    expect(screen.getByRole('button', { name: 'Toggle me' })).toBeInTheDocument()
  })

  it('should render with different variants', () => {
    const { rerender } = render(<Toggle variant="default">Default</Toggle>)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')

    rerender(<Toggle variant="outline">Outline</Toggle>)
    expect(screen.getByRole('button')).toHaveClass('border', 'border-input', 'bg-transparent', 'shadow-xs')
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<Toggle size="default">Default</Toggle>)
    expect(screen.getByRole('button')).toHaveClass('h-9', 'px-2', 'min-w-9')

    rerender(<Toggle size="sm">Small</Toggle>)
    expect(screen.getByRole('button')).toHaveClass('h-8', 'px-1.5', 'min-w-8')

    rerender(<Toggle size="lg">Large</Toggle>)
    expect(screen.getByRole('button')).toHaveClass('h-10', 'px-2.5', 'min-w-10')
  })

  it('should handle press events', () => {
    const handlePress = jest.fn()
    render(<Toggle onPressedChange={handlePress}>Toggle me</Toggle>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handlePress).toHaveBeenCalledWith(true)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Toggle disabled>Disabled</Toggle>)
    
    const toggle = screen.getByRole('button')
    expect(toggle).toBeDisabled()
    expect(toggle).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
  })

  it('should show pressed state when pressed prop is true', () => {
    render(<Toggle pressed>Pressed</Toggle>)
    
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveAttribute('data-state', 'on')
    expect(toggle).toHaveClass('data-[state=on]:bg-accent', 'data-[state=on]:text-accent-foreground')
  })

  it('should apply custom className', () => {
    render(<Toggle className="custom-class">Custom</Toggle>)
    
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('should have correct default classes', () => {
    render(<Toggle>Default Toggle</Toggle>)
    
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'gap-2',
      'rounded-md',
      'text-sm',
      'font-medium',
      'hover:bg-muted',
      'hover:text-muted-foreground',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      'data-[state=on]:bg-accent',
      'data-[state=on]:text-accent-foreground'
    )
  })

  it('should handle focus states', () => {
    render(<Toggle>Focusable</Toggle>)
    
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveClass('focus-visible:border-ring', 'focus-visible:ring-ring/50', 'focus-visible:ring-[3px]')
  })

  it('should handle aria-invalid states', () => {
    render(<Toggle aria-invalid>Invalid</Toggle>)
    
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveClass('aria-invalid:ring-destructive/20', 'dark:aria-invalid:ring-destructive/40', 'aria-invalid:border-destructive')
  })

  it('should support asChild prop', () => {
    render(
      <Toggle asChild>
        <a href="/test">Link Toggle</a>
      </Toggle>
    )
    
    const link = screen.getByRole('link', { name: 'Link Toggle' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('should handle hover states', () => {
    render(<Toggle>Hoverable</Toggle>)
    
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveClass('hover:bg-muted', 'hover:text-muted-foreground')
  })

  it('should handle outline variant hover states', () => {
    render(<Toggle variant="outline">Outline Toggle</Toggle>)
    
    const toggle = screen.getByRole('button')
    expect(toggle).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')
  })
})
