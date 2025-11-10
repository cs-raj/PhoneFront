import { render, screen } from '@testing-library/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../dropdown-menu'

describe('DropdownMenu', () => {
  it('should render without crashing', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    
    expect(screen.getByText('Open')).toBeInTheDocument()
  })
})
