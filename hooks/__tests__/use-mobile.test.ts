import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '../use-mobile'

// Mock window.matchMedia
const mockMatchMedia = jest.fn()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
})

// Mock window.innerWidth
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
})

describe('useIsMobile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  it('should return false for desktop width', () => {
    const mockMediaQuery = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }
    mockMatchMedia.mockReturnValue(mockMediaQuery)

    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
    expect(mockMatchMedia).toHaveBeenCalledWith('(max-width: 767px)')
  })

  it('should return true for mobile width', () => {
    // Set mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })

    const mockMediaQuery = {
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }
    mockMatchMedia.mockReturnValue(mockMediaQuery)

    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('should add event listener on mount', () => {
    const mockAddEventListener = jest.fn()
    const mockMediaQuery = {
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: jest.fn(),
    }
    mockMatchMedia.mockReturnValue(mockMediaQuery)

    renderHook(() => useIsMobile())
    
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should remove event listener on unmount', () => {
    const mockRemoveEventListener = jest.fn()
    const mockMediaQuery = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: mockRemoveEventListener,
    }
    mockMatchMedia.mockReturnValue(mockMediaQuery)

    const { unmount } = renderHook(() => useIsMobile())
    unmount()
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should update when media query changes', () => {
    let changeHandler: (() => void) | null = null
    const mockAddEventListener = jest.fn((event, handler) => {
      if (event === 'change') {
        changeHandler = handler
      }
    })
    const mockMediaQuery = {
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: jest.fn(),
    }
    mockMatchMedia.mockReturnValue(mockMediaQuery)

    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
    
    // Simulate media query change to mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })
    
    act(() => {
      if (changeHandler) {
        changeHandler()
      }
    })
    
    expect(result.current).toBe(true)
  })

  it('should handle window resize events', () => {
    const mockMediaQuery = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }
    mockMatchMedia.mockReturnValue(mockMediaQuery)

    const { result } = renderHook(() => useIsMobile())
    
    // Initially desktop
    expect(result.current).toBe(false)
    
    // Simulate resize to mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })
    
    // Trigger the change handler
    act(() => {
      const changeHandler = mockMediaQuery.addEventListener.mock.calls[0][1]
      changeHandler()
    })
    
    expect(result.current).toBe(true)
  })

  it('should handle edge case at breakpoint', () => {
    // Set width exactly at breakpoint (767px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767,
    })

    const mockMediaQuery = {
      matches: true, // 767px is considered mobile
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }
    mockMatchMedia.mockReturnValue(mockMediaQuery)

    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('should handle width just above breakpoint', () => {
    // Set width just above breakpoint (768px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })

    const mockMediaQuery = {
      matches: false, // 768px is considered desktop
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }
    mockMatchMedia.mockReturnValue(mockMediaQuery)

    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
  })

  it('should handle very small screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320,
    })

    const mockMediaQuery = {
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }
    mockMatchMedia.mockReturnValue(mockMediaQuery)

    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('should handle very large screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    })

    const mockMediaQuery = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }
    mockMatchMedia.mockReturnValue(mockMediaQuery)

    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
  })
})
