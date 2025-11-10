import { render, screen } from '@testing-library/react'
import { CompanyCard } from '../company-card'

describe('CompanyCard', () => {
  it('should render without crashing', () => {
    const mockCompany = {
      id: '1',
      name: 'Apple',
      slug: 'apple',
      description: 'Apple Inc.',
      phonesCount: 5,
      color: '#000000',
      logoUrl: null
    }
    
    render(<CompanyCard {...mockCompany} />)
    
    expect(screen.getByText('Apple')).toBeInTheDocument()
  })
})
