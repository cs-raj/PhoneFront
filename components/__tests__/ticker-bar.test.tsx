import { render, screen } from '@testing-library/react'
import { TickerBar } from '../ticker-bar'

describe('TickerBar', () => {
  it('should render without crashing', () => {
    render(<TickerBar />)
    
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('should display ticker items', () => {
    render(<TickerBar />)
    
    expect(screen.getByText('Samsung Galaxy S25 Ultra leaked: specs reveal major upgrades')).toBeInTheDocument()
    expect(screen.getByText('Google Pixel 9 Pro review: AI photography reaches new heights')).toBeInTheDocument()
    expect(screen.getByText('OnePlus 13 confirmed for January 2025 global launch')).toBeInTheDocument()
  })

  it('should render all list items', () => {
    render(<TickerBar />)
    
    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(3)
  })

  it('should have proper structure with bullet points', () => {
    render(<TickerBar />)
    
    const bulletPoints = screen.getAllByRole('generic', { hidden: true })
    const bulletElements = bulletPoints.filter(el => 
      el.getAttribute('aria-hidden') === 'true' && 
      el.classList.contains('size-1.5') && 
      el.classList.contains('rounded-full') && 
      el.classList.contains('bg-primary')
    )
    expect(bulletElements).toHaveLength(3)
  })

  it('should have correct styling classes', () => {
    render(<TickerBar />)
    
    const container = screen.getByRole('list').parentElement?.parentElement
    expect(container).toHaveClass('bg-secondary', 'border-b')
    
    const list = screen.getByRole('list')
    expect(list).toHaveClass('flex', 'items-center', 'gap-6', 'text-xs', 'sm:text-sm', 'whitespace-nowrap')
  })

  it('should be accessible', () => {
    render(<TickerBar />)
    
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
    
    const listItems = screen.getAllByRole('listitem')
    listItems.forEach(item => {
      expect(item).toBeInTheDocument()
    })
  })
})
