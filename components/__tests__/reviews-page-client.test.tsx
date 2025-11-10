import { render, screen } from '@testing-library/react'
import { ReviewsPageClient } from '../reviews/reviews-page-client'

describe('ReviewsPageClient', () => {
  it('should render without crashing', () => {
    render(<ReviewsPageClient />)
    
    expect(screen.getByText('Loading Reviews Page...')).toBeInTheDocument()
  })

  it('should display loading state', () => {
    render(<ReviewsPageClient />)
    
    expect(screen.getByText('Loading Reviews Page...')).toBeInTheDocument()
  })

  it('should have correct styling classes', () => {
    render(<ReviewsPageClient />)
    
    const loadingDiv = screen.getByText('Loading Reviews Page...')
    expect(loadingDiv).toHaveClass('animate-pulse', 'text-xl')
  })
})
