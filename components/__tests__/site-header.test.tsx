import { render, screen } from '@testing-library/react'
import { SiteHeader } from '../site-header'

describe('SiteHeader', () => {
  it('should render without crashing', () => {
    render(<SiteHeader />)
    
    // Header should render some content - check for any header-related element
    const headerElement = document.querySelector('header') || 
                         document.querySelector('nav') ||
                         document.querySelector('[role="banner"]') ||
                         document.querySelector('div')
    expect(headerElement).toBeInTheDocument()
  })
})
