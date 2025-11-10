import { render, screen } from '@testing-library/react'
import { PhoneCard } from '../phone-card'
import { mockPhone } from '../../test-utils/mock-data'

describe('PhoneCard', () => {
  it('should render without crashing', () => {
    render(<PhoneCard phone={mockPhone} />)
    
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
  })
})
