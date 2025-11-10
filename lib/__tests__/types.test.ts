import type { Phone, NewsItem, Review, Company } from '../types'

describe('Types', () => {
  it('should have proper type definitions', () => {
    // This test ensures types are properly exported
    const phone: Phone = {} as Phone
    const newsItem: NewsItem = {} as NewsItem
    const review: Review = {} as Review
    const company: Company = {} as Company
    
    expect(phone).toBeDefined()
    expect(newsItem).toBeDefined()
    expect(review).toBeDefined()
    expect(company).toBeDefined()
  })
})
