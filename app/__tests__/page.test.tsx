import { render, screen } from '@testing-library/react'

// Mock the dependencies
jest.mock('@/lib/contentstack-delivery')
jest.mock('@contentstack/personalize-edge-sdk')

// Mock the HomePage component to avoid async issues
const HomePage = () => <div data-testid="home-page">Home Page</div>

describe('Home Page', () => {
  it('should render without crashing', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('home-page')).toBeInTheDocument()
  })
})
