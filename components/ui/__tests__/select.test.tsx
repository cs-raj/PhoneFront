import { render, screen } from '@testing-library/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select'

describe('Select', () => {
  it('should render without crashing', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    )
    
    expect(screen.getByText('Select a fruit')).toBeInTheDocument()
  })
})
