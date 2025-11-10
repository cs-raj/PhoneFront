import { render, screen } from '@testing-library/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../dialog'

describe('Dialog', () => {
  it('should render without crashing', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByText('Open')).toBeInTheDocument()
  })
})
