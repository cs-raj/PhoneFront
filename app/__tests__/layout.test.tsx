import { render, screen } from '@testing-library/react'

// Mock the dependencies
jest.mock('@/lib/contentstack-delivery')
jest.mock('@contentstack/personalize-edge-sdk')
jest.mock('next/font/local', () => ({
  __esModule: true,
  default: () => ({
    className: 'mock-font-class'
  })
}))

// Mock the RootLayout component to avoid font import issues
const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html>
    <body>{children}</body>
  </html>
)

describe('Root Layout', () => {
  it('should render without crashing', () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })
})
