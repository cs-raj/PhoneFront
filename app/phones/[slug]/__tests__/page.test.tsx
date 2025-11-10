import { redirect } from 'next/navigation'
import PhoneDetailPage from '../page'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

describe('PhoneDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset environment variable
    delete process.env.NEXT_PUBLIC_BASE_URL
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should redirect to correct phone detail page', async () => {
    const mockRedirect = redirect as jest.MockedFunction<typeof redirect>
    process.env.NEXT_PUBLIC_BASE_URL = 'https://phonefront.com'

    await PhoneDetailPage({ params: { slug: 'iphone-15-pro' } })

    expect(mockRedirect).toHaveBeenCalledWith('https://phonefront.com/phone/iphone-15-pro')
  })

  it('should use localhost as default base URL when env var is not set', async () => {
    const mockRedirect = redirect as jest.MockedFunction<typeof redirect>
    delete process.env.NEXT_PUBLIC_BASE_URL

    await PhoneDetailPage({ params: { slug: 'galaxy-s24' } })

    expect(mockRedirect).toHaveBeenCalledWith('http://localhost:3000/phone/galaxy-s24')
  })

  it('should handle different phone slugs', async () => {
    const mockRedirect = redirect as jest.MockedFunction<typeof redirect>
    process.env.NEXT_PUBLIC_BASE_URL = 'https://phonefront.com'

    await PhoneDetailPage({ params: { slug: 'pixel-9-pro' } })

    expect(mockRedirect).toHaveBeenCalledWith('https://phonefront.com/phone/pixel-9-pro')
  })

  it('should preserve slug in redirect URL', async () => {
    const mockRedirect = redirect as jest.MockedFunction<typeof redirect>
    process.env.NEXT_PUBLIC_BASE_URL = 'https://phonefront.com'

    const testSlug = 'oneplus-13-ultra'
    await PhoneDetailPage({ params: { slug: testSlug } })

    expect(mockRedirect).toHaveBeenCalledWith(`https://phonefront.com/phone/${testSlug}`)
  })
})



