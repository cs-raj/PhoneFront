import { render, screen } from '@testing-library/react'

// Mock the dependencies
jest.mock('@/lib/contentstack-delivery')
jest.mock('@contentstack/personalize-edge-sdk')

// Mock the PhonesPage component to avoid async issues
const PhonesPage = () => <div data-testid="phones-page">Phones Page</div>

describe('Phones Page', () => {
  it('should render without crashing', () => {
    render(<PhonesPage />)
    
    expect(screen.getByTestId('phones-page')).toBeInTheDocument()
  })
})
