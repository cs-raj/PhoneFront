import { render } from '@testing-library/react'
import { Impressions } from '../impressions'

// Mock the PersonalizeContext
const mockPersonalizeSdk = {
  triggerImpression: jest.fn(),
  triggerImpressions: jest.fn(),
  getVariantAliases: jest.fn(() => ['variant1', 'variant2'])
}

jest.mock('../context/PersonalizeContext', () => ({
  usePersonalize: () => mockPersonalizeSdk
}))

// Mock console methods to avoid noise in tests
const originalConsoleLog = console.log
const originalConsoleError = console.error

beforeAll(() => {
  console.log = jest.fn()
  console.error = jest.fn()
})

afterAll(() => {
  console.log = originalConsoleLog
  console.error = originalConsoleError
})

describe('Impressions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crashing', () => {
    const { container } = render(<Impressions />)
    expect(container.firstChild).toBeNull() // Component returns empty fragment
  })

  it('should render with experience short UIDs', () => {
    const { container } = render(
      <Impressions experienceShortUids={['exp1', 'exp2']} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should render with aliases', () => {
    const { container } = render(
      <Impressions aliases={['alias1', 'alias2']} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should render with useBulkTrigger', () => {
    const { container } = render(
      <Impressions useBulkTrigger={true} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should render with autoDetectExperiences', () => {
    const { container } = render(
      <Impressions autoDetectExperiences={true} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should handle all props together', () => {
    const { container } = render(
      <Impressions 
        experienceShortUids={['exp1', 'exp2']}
        aliases={['alias1', 'alias2']}
        useBulkTrigger={true}
        autoDetectExperiences={true}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should handle empty props', () => {
    const { container } = render(
      <Impressions 
        experienceShortUids={[]}
        aliases={[]}
        useBulkTrigger={false}
        autoDetectExperiences={false}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should handle undefined props', () => {
    const { container } = render(
      <Impressions 
        experienceShortUids={undefined}
        aliases={undefined}
        useBulkTrigger={undefined}
        autoDetectExperiences={undefined}
      />
    )
    expect(container.firstChild).toBeNull()
  })
})
