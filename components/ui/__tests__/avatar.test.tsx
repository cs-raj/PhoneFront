import { render, screen } from '@testing-library/react'
import { Avatar, AvatarFallback, AvatarImage } from '../avatar'

describe('Avatar', () => {
  it('should render without crashing', () => {
    render(
      <Avatar>
        <AvatarImage src="/placeholder.jpg" alt="User" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    )
    
    expect(screen.getByText('CN')).toBeInTheDocument()
  })
})
