import { render, screen } from '@testing-library/react'
import { Alert, AlertDescription, AlertTitle } from '../alert'

describe('Alert', () => {
  it('should render without crashing', () => {
    render(
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
    )
    
    expect(screen.getByText('Heads up!')).toBeInTheDocument()
    expect(screen.getByText('You can add components to your app using the cli.')).toBeInTheDocument()
  })
})
