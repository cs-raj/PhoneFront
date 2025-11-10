import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../ui/input'

describe('Input', () => {
  it('should render without crashing', () => {
    render(<Input placeholder="Enter text" />)
    
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('should render with different types', () => {
    const { rerender } = render(<Input type="text" placeholder="Text input" />)
    expect(screen.getByPlaceholderText('Text input')).toHaveAttribute('type', 'text')

    rerender(<Input type="email" placeholder="Email input" />)
    expect(screen.getByPlaceholderText('Email input')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" placeholder="Password input" />)
    expect(screen.getByPlaceholderText('Password input')).toHaveAttribute('type', 'password')

    rerender(<Input type="number" placeholder="Number input" />)
    expect(screen.getByPlaceholderText('Number input')).toHaveAttribute('type', 'number')
  })

  it('should handle value changes', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} placeholder="Test input" />)
    
    const input = screen.getByPlaceholderText('Test input')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('test value')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />)
    
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:pointer-events-none', 'disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('should apply custom className', () => {
    render(<Input className="custom-class" placeholder="Custom input" />)
    
    expect(screen.getByPlaceholderText('Custom input')).toHaveClass('custom-class')
  })

  it('should have correct default classes', () => {
    render(<Input placeholder="Default input" />)
    
    const input = screen.getByPlaceholderText('Default input')
    expect(input).toHaveClass(
      'flex',
      'h-9',
      'w-full',
      'min-w-0',
      'rounded-md',
      'border',
      'bg-transparent',
      'px-3',
      'py-1',
      'text-base',
      'shadow-xs',
      'transition-[color,box-shadow]',
      'outline-none'
    )
  })

  it('should handle focus states', () => {
    render(<Input placeholder="Focusable input" />)
    
    const input = screen.getByPlaceholderText('Focusable input')
    expect(input).toHaveClass('focus-visible:border-ring', 'focus-visible:ring-ring/50', 'focus-visible:ring-[3px]')
  })

  it('should handle aria-invalid states', () => {
    render(<Input aria-invalid placeholder="Invalid input" />)
    
    const input = screen.getByPlaceholderText('Invalid input')
    expect(input).toHaveClass('aria-invalid:ring-destructive/20', 'dark:aria-invalid:ring-destructive/40', 'aria-invalid:border-destructive')
  })


  it('should handle placeholder text', () => {
    render(<Input placeholder="Enter your name" />)
    
    const input = screen.getByPlaceholderText('Enter your name')
    expect(input).toHaveClass('placeholder:text-muted-foreground')
  })

  it('should handle selection states', () => {
    render(<Input placeholder="Selectable input" />)
    
    const input = screen.getByPlaceholderText('Selectable input')
    expect(input).toHaveClass('selection:bg-primary', 'selection:text-primary-foreground')
  })
})
