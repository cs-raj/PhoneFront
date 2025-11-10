import { render, screen } from '@testing-library/react'
import { HomePageClient } from '../home/home-page-client'

describe('HomePageClient', () => {
  it('should render without crashing', () => {
    render(<HomePageClient />)
    
    expect(screen.getByText('Loading Homepage...')).toBeInTheDocument()
  })

  it('should display loading state', () => {
    render(<HomePageClient />)
    
    expect(screen.getByText('Loading Homepage...')).toBeInTheDocument()
  })

  it('should have correct styling classes', () => {
    render(<HomePageClient />)
    
    const loadingDiv = screen.getByText('Loading Homepage...')
    expect(loadingDiv).toHaveClass('animate-pulse', 'text-xl')
  })
})
