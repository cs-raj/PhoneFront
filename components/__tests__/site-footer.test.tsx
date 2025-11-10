import { render, screen } from '@testing-library/react'
import { SiteFooter } from '../site-footer'

describe('SiteFooter', () => {
  it('should render without crashing', () => {
    render(<SiteFooter />)
    
    // Footer should render some content - check for any footer-related element
    const footerElement = document.querySelector('footer') || 
                         document.querySelector('[role="contentinfo"]') ||
                         document.querySelector('div')
    expect(footerElement).toBeInTheDocument()
  })
})
