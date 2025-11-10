import { render, screen } from '@testing-library/react'
import { CompaniesPageClient } from '../companies/companies-page-client'

describe('CompaniesPageClient', () => {
  it('should render without crashing', () => {
    render(<CompaniesPageClient />)
    
    expect(screen.getByText('Loading Companies Page...')).toBeInTheDocument()
  })

  it('should display loading state', () => {
    render(<CompaniesPageClient />)
    
    expect(screen.getByText('Loading Companies Page...')).toBeInTheDocument()
  })

  it('should have correct styling classes', () => {
    render(<CompaniesPageClient />)
    
    const loadingDiv = screen.getByText('Loading Companies Page...')
    expect(loadingDiv).toHaveClass('animate-pulse', 'text-xl')
  })
})
