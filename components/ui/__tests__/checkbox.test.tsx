import { render, screen } from '@testing-library/react'
import { Checkbox } from '../checkbox'

describe('Checkbox', () => {
  it('should render without crashing', () => {
    render(<Checkbox />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })
})
