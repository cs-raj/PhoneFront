import { render, screen } from '@testing-library/react'
import { PersonalizeProvider, usePersonalize } from '../PersonalizeContext'

// Mock the dependencies
jest.mock('@contentstack/personalize-edge-sdk')

const TestComponent = () => {
  const personalize = usePersonalize()
  return <div data-testid="personalize-context">{personalize ? 'Loaded' : 'Loading'}</div>
}

describe('PersonalizeContext', () => {
  it('should render without crashing', () => {
    render(
      <PersonalizeProvider>
        <TestComponent />
      </PersonalizeProvider>
    )
    
    expect(screen.getByTestId('personalize-context')).toBeInTheDocument()
  })
})
