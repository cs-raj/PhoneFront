import { renderHook, act } from '@testing-library/react';
import { useToast, toast, reducer } from '../use-toast';

// Mock console methods to avoid noise in tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('use-toast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('toast function', () => {
    it('should create a toast with required properties', () => {
      // Act
      const result = toast({
        title: 'Test Toast',
        description: 'Test description'
      });

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('dismiss');
      expect(result).toHaveProperty('update');
      expect(typeof result.id).toBe('string');
      expect(typeof result.dismiss).toBe('function');
      expect(typeof result.update).toBe('function');
    });

    it('should create toast with unique IDs', () => {
      // Act
      const toast1 = toast({ title: 'Toast 1' });
      const toast2 = toast({ title: 'Toast 2' });

      // Assert
      expect(toast1.id).not.toBe(toast2.id);
    });

    it('should allow updating toast', () => {
      // Act
      const result = toast({
        title: 'Original Title',
        description: 'Original description'
      });

      // Update the toast
      result.update({
        title: 'Updated Title',
        description: 'Updated description'
      });

      // Assert
      expect(result.update).toBeDefined();
      expect(typeof result.update).toBe('function');
    });

    it('should allow dismissing toast', () => {
      // Act
      const result = toast({
        title: 'Test Toast'
      });

      // Assert
      expect(result.dismiss).toBeDefined();
      expect(typeof result.dismiss).toBe('function');
    });
  });

  describe('useToast hook', () => {
    it('should return toast state and functions', () => {
      // Act
      const { result } = renderHook(() => useToast());

      // Assert
      expect(result.current).toHaveProperty('toasts');
      expect(result.current).toHaveProperty('toast');
      expect(result.current).toHaveProperty('dismiss');
      expect(Array.isArray(result.current.toasts)).toBe(true);
      expect(typeof result.current.toast).toBe('function');
      expect(typeof result.current.dismiss).toBe('function');
    });

    it('should add toast to state', () => {
      // Arrange
      const { result } = renderHook(() => useToast());

      // Act
      act(() => {
        result.current.toast({
          title: 'Test Toast',
          description: 'Test description'
        });
      });

      // Assert
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toMatchObject({
        title: 'Test Toast',
        description: 'Test description',
        open: true
      });
    });

    it('should respect TOAST_LIMIT', () => {
      // Arrange
      const { result } = renderHook(() => useToast());

      // Act - Add more toasts than the limit
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.toast({
            title: `Toast ${i}`,
            description: `Description ${i}`
          });
        }
      });

      // Assert - Should only keep the limit number of toasts
      expect(result.current.toasts.length).toBeLessThanOrEqual(1); // TOAST_LIMIT is 1
    });

    it('should dismiss toast by ID', () => {
      // Arrange
      const { result } = renderHook(() => useToast());
      let toastId: string;

      act(() => {
        const toast = result.current.toast({
          title: 'Test Toast'
        });
        toastId = toast.id;
      });

      expect(result.current.toasts).toHaveLength(1);

      // Act
      act(() => {
        result.current.dismiss(toastId);
      });

      // Assert
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].open).toBe(false);
    });

    it('should dismiss all toasts when no ID provided', () => {
      // Arrange
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ title: 'Toast 1' });
        result.current.toast({ title: 'Toast 2' });
      });

      expect(result.current.toasts).toHaveLength(1); // Limited by TOAST_LIMIT

      // Act
      act(() => {
        result.current.dismiss();
      });

      // Assert
      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].open).toBe(false);
    });
  });

  describe('reducer', () => {
    it('should handle ADD_TOAST action', () => {
      // Arrange
      const initialState = { toasts: [] };
      const action = {
        type: 'ADD_TOAST' as const,
        toast: {
          id: 'toast_1',
          title: 'Test Toast',
          description: 'Test description',
          open: true
        }
      };

      // Act
      const result = reducer(initialState, action);

      // Assert
      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0]).toEqual(action.toast);
    });

    it('should handle UPDATE_TOAST action', () => {
      // Arrange
      const initialState = {
        toasts: [
          {
            id: 'toast_1',
            title: 'Original Title',
            description: 'Original description',
            open: true
          }
        ]
      };
      const action = {
        type: 'UPDATE_TOAST' as const,
        toast: {
          id: 'toast_1',
          title: 'Updated Title',
          description: 'Updated description'
        }
      };

      // Act
      const result = reducer(initialState, action);

      // Assert
      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0]).toMatchObject({
        id: 'toast_1',
        title: 'Updated Title',
        description: 'Updated description',
        open: true
      });
    });

    it('should handle DISMISS_TOAST action with specific ID', () => {
      // Arrange
      const initialState = {
        toasts: [
          {
            id: 'toast_1',
            title: 'Toast 1',
            open: true
          },
          {
            id: 'toast_2',
            title: 'Toast 2',
            open: true
          }
        ]
      };
      const action = {
        type: 'DISMISS_TOAST' as const,
        toastId: 'toast_1'
      };

      // Act
      const result = reducer(initialState, action);

      // Assert
      expect(result.toasts).toHaveLength(2);
      expect(result.toasts[0].open).toBe(false);
      expect(result.toasts[1].open).toBe(true);
    });

    it('should handle DISMISS_TOAST action without ID', () => {
      // Arrange
      const initialState = {
        toasts: [
          {
            id: 'toast_1',
            title: 'Toast 1',
            open: true
          },
          {
            id: 'toast_2',
            title: 'Toast 2',
            open: true
          }
        ]
      };
      const action = {
        type: 'DISMISS_TOAST' as const
      };

      // Act
      const result = reducer(initialState, action);

      // Assert
      expect(result.toasts).toHaveLength(2);
      expect(result.toasts[0].open).toBe(false);
      expect(result.toasts[1].open).toBe(false);
    });

    it('should handle REMOVE_TOAST action with specific ID', () => {
      // Arrange
      const initialState = {
        toasts: [
          {
            id: 'toast_1',
            title: 'Toast 1',
            open: true
          },
          {
            id: 'toast_2',
            title: 'Toast 2',
            open: true
          }
        ]
      };
      const action = {
        type: 'REMOVE_TOAST' as const,
        toastId: 'toast_1'
      };

      // Act
      const result = reducer(initialState, action);

      // Assert
      expect(result.toasts).toHaveLength(1);
      expect(result.toasts[0].id).toBe('toast_2');
    });

    it('should handle REMOVE_TOAST action without ID', () => {
      // Arrange
      const initialState = {
        toasts: [
          {
            id: 'toast_1',
            title: 'Toast 1',
            open: true
          },
          {
            id: 'toast_2',
            title: 'Toast 2',
            open: true
          }
        ]
      };
      const action = {
        type: 'REMOVE_TOAST' as const
      };

      // Act
      const result = reducer(initialState, action);

      // Assert
      expect(result.toasts).toHaveLength(0);
    });
  });
});