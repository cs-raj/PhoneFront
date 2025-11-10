import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from '../ui/switch'

describe('Switch', () => {
  it('should render without crashing', () => {
    render(<Switch />)
    
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('should be checked when checked prop is true', () => {
    render(<Switch checked />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeChecked()
    expect(switchElement).toHaveAttribute('data-state', 'checked')
  })

  it('should be unchecked when checked prop is false', () => {
    render(<Switch checked={false} />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).not.toBeChecked()
    expect(switchElement).toHaveAttribute('data-state', 'unchecked')
  })

  it('should handle change events', () => {
    const handleCheckedChange = jest.fn()
    render(<Switch onCheckedChange={handleCheckedChange} />)
    
    fireEvent.click(screen.getByRole('switch'))
    expect(handleCheckedChange).toHaveBeenCalledWith(true)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Switch disabled />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeDisabled()
    expect(switchElement).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('should apply custom className', () => {
    render(<Switch className="custom-class" />)
    
    expect(screen.getByRole('switch')).toHaveClass('custom-class')
  })

  it('should have correct default classes', () => {
    render(<Switch />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass(
      'peer',
      'data-[state=checked]:bg-primary',
      'data-[state=unchecked]:bg-input',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'dark:data-[state=unchecked]:bg-input/80',
      'inline-flex',
      'h-[1.15rem]',
      'w-8',
      'shrink-0',
      'items-center',
      'rounded-full',
      'border',
      'border-transparent',
      'shadow-xs',
      'transition-all',
      'outline-none',
      'focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50'
    )
  })

  it('should handle focus states', () => {
    render(<Switch />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('focus-visible:border-ring', 'focus-visible:ring-ring/50', 'focus-visible:ring-[3px]')
  })

  it('should handle checked state classes', () => {
    render(<Switch checked />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('data-[state=checked]:bg-primary')
  })

  it('should handle unchecked state classes', () => {
    render(<Switch checked={false} />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('data-[state=unchecked]:bg-input')
  })

  it('should support aria-label', () => {
    render(<Switch aria-label="Toggle setting" />)
    
    const switchElement = screen.getByRole('switch', { name: 'Toggle setting' })
    expect(switchElement).toBeInTheDocument()
  })

  it('should support aria-labelledby', () => {
    render(
      <div>
        <label id="switch-label">Toggle Switch</label>
        <Switch aria-labelledby="switch-label" />
      </div>
    )
    
    const switchElement = screen.getByRole('switch', { name: 'Toggle Switch' })
    expect(switchElement).toBeInTheDocument()
  })

})
