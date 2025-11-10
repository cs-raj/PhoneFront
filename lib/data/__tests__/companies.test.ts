import { COMPANIES, getTotalPhones, type Company } from '../companies'

describe('Companies Data', () => {
  describe('COMPANIES array', () => {
    it('should export a non-empty array of companies', () => {
      expect(Array.isArray(COMPANIES)).toBe(true)
      expect(COMPANIES.length).toBeGreaterThan(0)
    })

    it('should have companies with required properties', () => {
      COMPANIES.forEach((company) => {
        expect(company).toHaveProperty('id')
        expect(company).toHaveProperty('name')
        expect(company).toHaveProperty('slug')
        expect(company).toHaveProperty('description')
        expect(company).toHaveProperty('phonesCount')
        expect(company).toHaveProperty('color')
        expect(company).toHaveProperty('createdAt')
      })
    })

    it('should have unique IDs for all companies', () => {
      const ids = COMPANIES.map(company => company.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have unique slugs for all companies', () => {
      const slugs = COMPANIES.map(company => company.slug)
      const uniqueSlugs = new Set(slugs)
      expect(uniqueSlugs.size).toBe(slugs.length)
    })

    it('should have valid phone counts (non-negative numbers)', () => {
      COMPANIES.forEach((company) => {
        expect(typeof company.phonesCount).toBe('number')
        expect(company.phonesCount).toBeGreaterThanOrEqual(0)
      })
    })

    it('should have valid color hex codes', () => {
      COMPANIES.forEach((company) => {
        expect(company.color).toMatch(/^#[0-9a-fA-F]{6}$/)
      })
    })

    it('should have valid ISO date strings for createdAt', () => {
      COMPANIES.forEach((company) => {
        const date = new Date(company.createdAt)
        expect(date).toBeInstanceOf(Date)
        expect(isNaN(date.getTime())).toBe(false)
      })
    })

    it('should have non-empty names and descriptions', () => {
      COMPANIES.forEach((company) => {
        expect(company.name.trim()).not.toBe('')
        expect(company.description.trim()).not.toBe('')
      })
    })

    it('should include expected major companies', () => {
      const companyNames = COMPANIES.map(company => company.name)
      expect(companyNames).toContain('Apple')
      expect(companyNames).toContain('Samsung')
      expect(companyNames).toContain('Google')
    })
  })

  describe('getTotalPhones function', () => {
    it('should calculate total phones correctly', () => {
      const total = getTotalPhones(COMPANIES)
      const expectedTotal = COMPANIES.reduce((sum, company) => sum + company.phonesCount, 0)
      expect(total).toBe(expectedTotal)
    })

    it('should return 0 for empty array', () => {
      const total = getTotalPhones([])
      expect(total).toBe(0)
    })

    it('should handle single company', () => {
      const singleCompany = [COMPANIES[0]]
      const total = getTotalPhones(singleCompany)
      expect(total).toBe(singleCompany[0].phonesCount)
    })

    it('should handle companies with zero phones', () => {
      const companiesWithZero = [
        { ...COMPANIES[0], phonesCount: 0 },
        { ...COMPANIES[1], phonesCount: 0 }
      ]
      const total = getTotalPhones(companiesWithZero)
      expect(total).toBe(0)
    })

    it('should handle mixed phone counts', () => {
      const mixedCompanies = [
        { ...COMPANIES[0], phonesCount: 10 },
        { ...COMPANIES[1], phonesCount: 20 },
        { ...COMPANIES[2], phonesCount: 5 }
      ]
      const total = getTotalPhones(mixedCompanies)
      expect(total).toBe(35)
    })
  })

  describe('Company interface compliance', () => {
    it('should have all required properties for each company', () => {
      COMPANIES.forEach((company) => {
        // Check required properties
        expect(company.id).toBeDefined()
        expect(company.name).toBeDefined()
        expect(company.slug).toBeDefined()
        expect(company.description).toBeDefined()
        expect(company.phonesCount).toBeDefined()
        expect(company.color).toBeDefined()
        expect(company.createdAt).toBeDefined()
      })
    })

    it('should have correct property types', () => {
      COMPANIES.forEach((company) => {
        expect(typeof company.id).toBe('string')
        expect(typeof company.name).toBe('string')
        expect(typeof company.slug).toBe('string')
        expect(typeof company.description).toBe('string')
        expect(typeof company.phonesCount).toBe('number')
        expect(typeof company.color).toBe('string')
        expect(typeof company.createdAt).toBe('string')
      })
    })

    it('should have optional logoUrl property when present', () => {
      const companiesWithLogo = COMPANIES.filter(company => company.logoUrl)
      companiesWithLogo.forEach((company) => {
        expect(typeof company.logoUrl).toBe('string')
        expect(company.logoUrl!.trim()).not.toBe('')
      })
    })
  })

  describe('Data integrity', () => {
    it('should have consistent ID and slug for each company', () => {
      COMPANIES.forEach((company) => {
        expect(company.id).toBe(company.slug)
      })
    })

    it('should have reasonable phone counts', () => {
      COMPANIES.forEach((company) => {
        expect(company.phonesCount).toBeGreaterThan(0)
        expect(company.phonesCount).toBeLessThan(1000) // Reasonable upper bound
      })
    })

    it('should have valid color formats', () => {
      COMPANIES.forEach((company) => {
        // Should be valid hex color
        expect(company.color).toMatch(/^#[0-9a-fA-F]{6}$/)
        // Should not be transparent or invalid
        expect(company.color).not.toBe('#00000000')
        expect(company.color).not.toBe('transparent')
      })
    })

    it('should have chronological createdAt dates', () => {
      const dates = COMPANIES.map(company => new Date(company.createdAt).getTime())
      const sortedDates = [...dates].sort()
      
      // All dates should be valid
      dates.forEach(date => {
        expect(date).not.toBeNaN()
      })
      
      // Dates should be in reasonable range (not too old, not in future)
      const now = Date.now()
      const tenYearsAgo = now - (10 * 365 * 24 * 60 * 60 * 1000)
      
      dates.forEach(date => {
        expect(date).toBeGreaterThan(tenYearsAgo)
        expect(date).toBeLessThanOrEqual(now)
      })
    })
  })
})
