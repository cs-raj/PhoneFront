import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse price string and extract numeric value
 * Handles various currency formats like "₹42,000", "$1,200", "€800"
 * @param priceString - The price string to parse
 * @returns The numeric value of the price
 */
export function parsePrice(priceString: string): number {
  if (!priceString) return 0;
  
  // Remove currency symbols, commas, and whitespace
  const cleanPrice = priceString.toString().replace(/[₹$€£,\s]/g, '').trim();
  return parseFloat(cleanPrice) || 0;
}
