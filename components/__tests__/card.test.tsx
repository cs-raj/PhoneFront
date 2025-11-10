import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../ui/card'

describe('Card', () => {
  it('should render without crashing', () => {
    render(<Card>Card content</Card>)
    
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('should have correct default classes', () => {
    render(<Card>Test card</Card>)
    
    const card = screen.getByText('Test card').closest('[data-slot="card"]')
    expect(card).toHaveClass(
      'bg-card',
      'text-card-foreground',
      'flex',
      'flex-col',
      'gap-6',
      'rounded-xl',
      'border',
      'py-6',
      'shadow-sm'
    )
  })

  it('should apply custom className', () => {
    render(<Card className="custom-class">Custom card</Card>)
    
    const card = screen.getByText('Custom card').closest('[data-slot="card"]')
    expect(card).toHaveClass('custom-class')
  })

  it('should render with all card subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter>
          <p>Card footer</p>
        </CardFooter>
      </Card>
    )
    
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card Description')).toBeInTheDocument()
    expect(screen.getByText('Card content goes here')).toBeInTheDocument()
    expect(screen.getByText('Card footer')).toBeInTheDocument()
  })

  it('should have correct data-slot attribute', () => {
    render(<Card>Test card</Card>)
    
    const card = screen.getByText('Test card').closest('[data-slot="card"]')
    expect(card).toHaveAttribute('data-slot', 'card')
  })
})

describe('CardHeader', () => {
  it('should render without crashing', () => {
    render(
      <Card>
        <CardHeader>Header content</CardHeader>
      </Card>
    )
    
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  it('should have correct default classes', () => {
    render(
      <Card>
        <CardHeader>Test header</CardHeader>
      </Card>
    )
    
    const header = screen.getByText('Test header').closest('[data-slot="card-header"]')
    expect(header).toHaveClass(
      '@container/card-header',
      'auto-rows-min',
      'grid-rows-[auto_auto]',
      'px-6',
      'has-data-[slot=card-action]:grid-cols-[1fr_auto]',
      '[.border-b]:pb-6'
    )
  })

  it('should apply custom className', () => {
    render(
      <Card>
        <CardHeader className="custom-header">Custom header</CardHeader>
      </Card>
    )
    
    const header = screen.getByText('Custom header').closest('[data-slot="card-header"]')
    expect(header).toHaveClass('custom-header')
  })
})

describe('CardContent', () => {
  it('should render without crashing', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    )
    
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should have correct default classes', () => {
    render(
      <Card>
        <CardContent>Test content</CardContent>
      </Card>
    )
    
    const content = screen.getByText('Test content').closest('[data-slot="card-content"]')
    expect(content).toHaveClass('px-6')
  })

  it('should apply custom className', () => {
    render(
      <Card>
        <CardContent className="custom-content">Custom content</CardContent>
      </Card>
    )
    
    const content = screen.getByText('Custom content').closest('[data-slot="card-content"]')
    expect(content).toHaveClass('custom-content')
  })
})

describe('CardFooter', () => {
  it('should render without crashing', () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    )
    
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('should have correct default classes', () => {
    render(
      <Card>
        <CardFooter>Test footer</CardFooter>
      </Card>
    )
    
    const footer = screen.getByText('Test footer').closest('[data-slot="card-footer"]')
    expect(footer).toHaveClass('px-6', '[.border-t]:pt-6')
  })

  it('should apply custom className', () => {
    render(
      <Card>
        <CardFooter className="custom-footer">Custom footer</CardFooter>
      </Card>
    )
    
    const footer = screen.getByText('Custom footer').closest('[data-slot="card-footer"]')
    expect(footer).toHaveClass('custom-footer')
  })
})

describe('CardTitle', () => {
  it('should render without crashing', () => {
    render(
      <Card>
        <CardTitle>Title</CardTitle>
      </Card>
    )
    
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('should have correct default classes', () => {
    render(
      <Card>
        <CardTitle>Test title</CardTitle>
      </Card>
    )
    
    const title = screen.getByText('Test title').closest('[data-slot="card-title"]')
    expect(title).toHaveClass('font-semibold', 'leading-none')
  })

  it('should apply custom className', () => {
    render(
      <Card>
        <CardTitle className="custom-title">Custom title</CardTitle>
      </Card>
    )
    
    const title = screen.getByText('Custom title').closest('[data-slot="card-title"]')
    expect(title).toHaveClass('custom-title')
  })
})

describe('CardDescription', () => {
  it('should render without crashing', () => {
    render(
      <Card>
        <CardDescription>Description</CardDescription>
      </Card>
    )
    
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('should have correct default classes', () => {
    render(
      <Card>
        <CardDescription>Test description</CardDescription>
      </Card>
    )
    
    const description = screen.getByText('Test description').closest('[data-slot="card-description"]')
    expect(description).toHaveClass('text-sm', 'text-muted-foreground')
  })

  it('should apply custom className', () => {
    render(
      <Card>
        <CardDescription className="custom-description">Custom description</CardDescription>
      </Card>
    )
    
    const description = screen.getByText('Custom description').closest('[data-slot="card-description"]')
    expect(description).toHaveClass('custom-description')
  })
})
