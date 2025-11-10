import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../theme-provider'

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children, ...props }: any) => (
    <div 
      data-testid="theme-provider" 
      attribute={props.attribute}
      defaultTheme={props.defaultTheme}
      enableSystem={props.enableSystem?.toString()}
      disableTransitionOnChange={props.disableTransitionOnChange?.toString()}
    >
      {children}
    </div>
  ),
}))

describe('ThemeProvider', () => {
  it('should render without crashing', () => {
    render(
      <ThemeProvider>
        <div>Test content</div>
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should pass through props to NextThemesProvider', () => {
    const testProps = {
      attribute: 'class',
      defaultTheme: 'system',
      enableSystem: true,
      disableTransitionOnChange: false
    }

    render(
      <ThemeProvider {...testProps}>
        <div>Test content</div>
      </ThemeProvider>
    )
    
    const themeProvider = screen.getByTestId('theme-provider')
    expect(themeProvider).toHaveAttribute('attribute', 'class')
    expect(themeProvider).toHaveAttribute('defaultTheme', 'system')
    expect(themeProvider).toHaveAttribute('enableSystem', 'true')
    expect(themeProvider).toHaveAttribute('disableTransitionOnChange', 'false')
  })

  it('should render children correctly', () => {
    const TestComponent = () => <div data-testid="child">Child component</div>
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Child component')).toBeInTheDocument()
  })
})
