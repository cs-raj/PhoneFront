import { render, screen } from '@testing-library/react'
import { Skeleton } from '../ui/skeleton'

describe('Skeleton', () => {
  it('should render without crashing', () => {
    render(<Skeleton />)
    
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<Skeleton className="custom-class" />)
    
    expect(screen.getByTestId('skeleton')).toHaveClass('custom-class')
  })

  it('should have correct default classes', () => {
    render(<Skeleton />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass(
      'animate-pulse',
      'rounded-md',
      'bg-accent'
    )
  })

  it('should render with custom dimensions', () => {
    render(<Skeleton className="h-4 w-[250px]" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('h-4', 'w-[250px]')
  })

  it('should render with different shapes', () => {
    const { rerender } = render(<Skeleton className="rounded-full" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('rounded-full')

    rerender(<Skeleton className="rounded-lg" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('rounded-lg')

    rerender(<Skeleton className="rounded-none" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('rounded-none')
  })

  it('should handle different sizes', () => {
    const { rerender } = render(<Skeleton className="h-4" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('h-4')

    rerender(<Skeleton className="h-8" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('h-8')

    rerender(<Skeleton className="h-12" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('h-12')
  })

  it('should handle different widths', () => {
    const { rerender } = render(<Skeleton className="w-4" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('w-4')

    rerender(<Skeleton className="w-1/2" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('w-1/2')

    rerender(<Skeleton className="w-full" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('w-full')
  })

  it('should handle circular skeleton', () => {
    render(<Skeleton className="h-10 w-10 rounded-full" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('h-10', 'w-10', 'rounded-full')
  })

  it('should handle rectangular skeleton', () => {
    render(<Skeleton className="h-4 w-full" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('h-4', 'w-full')
  })

  it('should handle square skeleton', () => {
    render(<Skeleton className="h-8 w-8" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('h-8', 'w-8')
  })

  it('should support custom animation', () => {
    render(<Skeleton className="animate-bounce" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('animate-bounce')
  })

  it('should handle multiple skeleton elements', () => {
    render(
      <div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
    
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(3)
    expect(skeletons[0]).toHaveClass('h-4', 'w-full')
    expect(skeletons[1]).toHaveClass('h-4', 'w-3/4')
    expect(skeletons[2]).toHaveClass('h-4', 'w-1/2')
  })

  it('should handle skeleton with custom background', () => {
    render(<Skeleton className="bg-gray-200" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('bg-gray-200')
  })

  it('should handle skeleton with custom opacity', () => {
    render(<Skeleton className="opacity-50" />)
    
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('opacity-50')
  })
})
