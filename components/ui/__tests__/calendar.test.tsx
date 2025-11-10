import { render, screen } from '@testing-library/react'
import { Calendar } from '../calendar'

describe('Calendar', () => {
  it('should render without crashing', () => {
    render(<Calendar />)
    
    // Calendar should render some content - check for any calendar-related element
    const calendarElement = document.querySelector('[data-testid="calendar"]') || 
                          document.querySelector('.rdp') || 
                          document.querySelector('[role="grid"]') ||
                          document.querySelector('table')
    expect(calendarElement).toBeInTheDocument()
  })
})
