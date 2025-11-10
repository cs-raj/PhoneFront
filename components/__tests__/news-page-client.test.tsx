import { render, screen } from '@testing-library/react'
import { NewsPageClient } from '../news/news-page-client'

describe('NewsPageClient', () => {
  it('should render without crashing', () => {
    render(<NewsPageClient><div>Test content</div></NewsPageClient>)
    
    expect(screen.getByText('Loading News Page...')).toBeInTheDocument()
  })

  it('should display loading state', () => {
    render(<NewsPageClient><div>Test content</div></NewsPageClient>)
    
    expect(screen.getByText('Loading News Page...')).toBeInTheDocument()
  })

  it('should have correct styling classes', () => {
    render(<NewsPageClient><div>Test content</div></NewsPageClient>)
    
    const loadingDiv = screen.getByText('Loading News Page...')
    expect(loadingDiv).toHaveClass('animate-pulse', 'text-xl')
  })
})
