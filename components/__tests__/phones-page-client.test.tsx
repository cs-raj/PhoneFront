import { render, screen } from '@testing-library/react'
import { PhonesPageClient } from '../phones/phones-page-client'

describe('PhonesPageClient', () => {
  it('should render without crashing', () => {
    render(<PhonesPageClient><div>Test content</div></PhonesPageClient>)
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should render children correctly', () => {
    render(<PhonesPageClient><div>Test content</div></PhonesPageClient>)
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should pass through children', () => {
    render(<PhonesPageClient><div>Test content</div></PhonesPageClient>)
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })
})
