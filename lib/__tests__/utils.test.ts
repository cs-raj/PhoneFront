import { cn, parsePrice } from '../utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', { 'active': true, 'disabled': false })).toBe('base active')
    })

    it('should handle arrays of classes', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
    })

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'class1')).toBe('base class1')
    })

    it('should handle empty strings', () => {
      expect(cn('base', '', 'class1')).toBe('base class1')
    })

    it('should merge Tailwind classes correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })

    it('should handle complex combinations', () => {
      expect(cn(
        'base-class',
        { 'conditional': true },
        ['array-class1', 'array-class2'],
        'final-class'
      )).toBe('base-class conditional array-class1 array-class2 final-class')
    })
  })

  describe('parsePrice', () => {
    it('should parse Indian Rupee format', () => {
      expect(parsePrice('₹42,000')).toBe(42000)
      expect(parsePrice('₹1,50,000')).toBe(150000)
    })

    it('should parse US Dollar format', () => {
      expect(parsePrice('$1,200')).toBe(1200)
      expect(parsePrice('$999')).toBe(999)
    })

    it('should parse Euro format', () => {
      expect(parsePrice('€800')).toBe(800)
      expect(parsePrice('€1,200')).toBe(1200)
    })

    it('should parse Pound Sterling format', () => {
      expect(parsePrice('£600')).toBe(600)
      expect(parsePrice('£1,000')).toBe(1000)
    })

    it('should handle prices without currency symbols', () => {
      expect(parsePrice('1200')).toBe(1200)
      expect(parsePrice('1,500')).toBe(1500)
    })

    it('should handle decimal prices', () => {
      expect(parsePrice('$99.99')).toBe(99.99)
      expect(parsePrice('₹1,999.50')).toBe(1999.50)
    })

    it('should handle empty string', () => {
      expect(parsePrice('')).toBe(0)
    })

    it('should handle null and undefined', () => {
      expect(parsePrice(null as any)).toBe(0)
      expect(parsePrice(undefined as any)).toBe(0)
    })

    it('should handle invalid strings', () => {
      expect(parsePrice('invalid')).toBe(0)
      expect(parsePrice('abc123')).toBe(0)
    })

    it('should handle special characters', () => {
      expect(parsePrice('$1,200.50')).toBe(1200.50)
      expect(parsePrice('₹42,000.00')).toBe(42000)
    })

    it('should handle whitespace', () => {
      expect(parsePrice(' $1,200 ')).toBe(1200)
      expect(parsePrice('₹ 42,000 ')).toBe(42000)
    })

    it('should handle multiple currency symbols', () => {
      expect(parsePrice('$$1,200')).toBe(1200)
      expect(parsePrice('₹₹42,000')).toBe(42000)
    })

    it('should handle mixed formats', () => {
      expect(parsePrice('$1,200.50')).toBe(1200.50)
      expect(parsePrice('₹42,000.00')).toBe(42000)
    })

    it('should handle very large numbers', () => {
      expect(parsePrice('₹10,00,000')).toBe(1000000)
      expect(parsePrice('$1,000,000')).toBe(1000000)
    })

    it('should handle zero', () => {
      expect(parsePrice('$0')).toBe(0)
      expect(parsePrice('₹0')).toBe(0)
    })

    it('should handle negative numbers', () => {
      expect(parsePrice('-$100')).toBe(-100)
      expect(parsePrice('-₹1,000')).toBe(-1000)
    })
  })
})
