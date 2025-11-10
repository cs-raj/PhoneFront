import { renderHook, act } from '@testing-library/react';
import { useImpressions } from '../use-impressions';
import { usePersonalize } from '@/components/context/PersonalizeContext';

// Mock the PersonalizeContext
jest.mock('@/components/context/PersonalizeContext', () => ({
  usePersonalize: jest.fn()
}));

const mockUsePersonalize = usePersonalize as jest.MockedFunction<typeof usePersonalize>;

describe('useImpressions', () => {
  const mockPersonalizeSdk = {
    triggerImpression: jest.fn(),
    triggerImpressions: jest.fn(),
    getVariantAliases: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePersonalize.mockReturnValue(mockPersonalizeSdk);
  });

  describe('triggerImpression', () => {
    it('should trigger impression successfully', async () => {
      // Arrange
      const { result } = renderHook(() => useImpressions());
      mockPersonalizeSdk.triggerImpression.mockResolvedValue(undefined);

      // Act
      await act(async () => {
        await result.current.triggerImpression('exp_123');
      });

      // Assert
      expect(mockPersonalizeSdk.triggerImpression).toHaveBeenCalledWith('exp_123');
    });

    it('should handle SDK not available', async () => {
      // Arrange
      mockUsePersonalize.mockReturnValue(null);
      const { result } = renderHook(() => useImpressions());

      // Act
      await act(async () => {
        await result.current.triggerImpression('exp_123');
      });

      // Assert
      expect(mockPersonalizeSdk.triggerImpression).not.toHaveBeenCalled();
    });

    it('should handle trigger impression errors', async () => {
      // Arrange
      const { result } = renderHook(() => useImpressions());
      const error = new Error('Trigger impression failed');
      mockPersonalizeSdk.triggerImpression.mockRejectedValue(error);

      // Act & Assert
      await expect(act(async () => {
        await result.current.triggerImpression('exp_123');
      })).rejects.toThrow('Trigger impression failed');
    });
  });

  describe('triggerImpressions', () => {
    it('should trigger impressions successfully with experienceShortUids', async () => {
      // Arrange
      const { result } = renderHook(() => useImpressions());
      const options = { experienceShortUids: ['exp_123', 'exp_456'] };
      mockPersonalizeSdk.triggerImpressions.mockResolvedValue(undefined);

      // Act
      await act(async () => {
        await result.current.triggerImpressions(options);
      });

      // Assert
      expect(mockPersonalizeSdk.triggerImpressions).toHaveBeenCalledWith(options);
    });

    it('should trigger impressions successfully with aliases', async () => {
      // Arrange
      const { result } = renderHook(() => useImpressions());
      const options = { aliases: ['alias_123', 'alias_456'] };
      mockPersonalizeSdk.triggerImpressions.mockResolvedValue(undefined);

      // Act
      await act(async () => {
        await result.current.triggerImpressions(options);
      });

      // Assert
      expect(mockPersonalizeSdk.triggerImpressions).toHaveBeenCalledWith(options);
    });

    it('should handle SDK not available', async () => {
      // Arrange
      mockUsePersonalize.mockReturnValue(null);
      const { result } = renderHook(() => useImpressions());
      const options = { experienceShortUids: ['exp_123'] };

      // Act
      await act(async () => {
        await result.current.triggerImpressions(options);
      });

      // Assert
      expect(mockPersonalizeSdk.triggerImpressions).not.toHaveBeenCalled();
    });

    it('should handle no options provided', async () => {
      // Arrange
      const { result } = renderHook(() => useImpressions());

      // Act
      await act(async () => {
        await result.current.triggerImpressions({});
      });

      // Assert
      expect(mockPersonalizeSdk.triggerImpressions).not.toHaveBeenCalled();
    });

    it('should handle trigger impressions errors', async () => {
      // Arrange
      const { result } = renderHook(() => useImpressions());
      const options = { experienceShortUids: ['exp_123'] };
      const error = new Error('Trigger impressions failed');
      mockPersonalizeSdk.triggerImpressions.mockRejectedValue(error);

      // Act & Assert
      await expect(act(async () => {
        await result.current.triggerImpressions(options);
      })).rejects.toThrow('Trigger impressions failed');
    });
  });

  describe('triggerPageImpression', () => {
    it('should trigger page impression with experienceShortUids', async () => {
      // Arrange
      const { result } = renderHook(() => useImpressions());
      const pageName = 'home';
      const experienceShortUids = ['exp_123', 'exp_456'];
      mockPersonalizeSdk.triggerImpressions.mockResolvedValue(undefined);

      // Act
      await act(async () => {
        await result.current.triggerPageImpression(pageName, experienceShortUids);
      });

      // Assert
      expect(mockPersonalizeSdk.triggerImpressions).toHaveBeenCalledWith({ experienceShortUids });
    });

    it('should auto-detect variant aliases when no experienceShortUids provided', async () => {
      // Arrange
      const { result } = renderHook(() => useImpressions());
      const pageName = 'home';
      const variantAliases = ['alias_123', 'alias_456'];
      mockPersonalizeSdk.getVariantAliases.mockReturnValue(variantAliases);
      mockPersonalizeSdk.triggerImpressions.mockResolvedValue(undefined);

      // Act
      await act(async () => {
        await result.current.triggerPageImpression(pageName);
      });

      // Assert
      expect(mockPersonalizeSdk.getVariantAliases).toHaveBeenCalled();
      expect(mockPersonalizeSdk.triggerImpressions).toHaveBeenCalledWith({ aliases: variantAliases });
    });

    it('should handle no active experiences found', async () => {
      // Arrange
      const { result } = renderHook(() => useImpressions());
      const pageName = 'home';
      mockPersonalizeSdk.getVariantAliases.mockReturnValue([]);

      // Act
      await act(async () => {
        await result.current.triggerPageImpression(pageName);
      });

      // Assert
      expect(mockPersonalizeSdk.getVariantAliases).toHaveBeenCalled();
      expect(mockPersonalizeSdk.triggerImpressions).not.toHaveBeenCalled();
    });

    it('should handle SDK not available', async () => {
      // Arrange
      mockUsePersonalize.mockReturnValue(null);
      const { result } = renderHook(() => useImpressions());

      // Act
      await act(async () => {
        await result.current.triggerPageImpression('home');
      });

      // Assert
      expect(mockPersonalizeSdk.triggerImpressions).not.toHaveBeenCalled();
    });

    it('should handle getVariantAliases errors', async () => {
      // Arrange
      const { result } = renderHook(() => useImpressions());
      const pageName = 'home';
      mockPersonalizeSdk.getVariantAliases.mockImplementation(() => {
        throw new Error('Get variant aliases failed');
      });

      // Act
      await act(async () => {
        await result.current.triggerPageImpression(pageName);
      });

      // Assert
      expect(mockPersonalizeSdk.getVariantAliases).toHaveBeenCalled();
      expect(mockPersonalizeSdk.triggerImpressions).not.toHaveBeenCalled();
    });

    it('should handle trigger page impression errors', async () => {
      // Arrange
      const { result } = renderHook(() => useImpressions());
      const pageName = 'home';
      const experienceShortUids = ['exp_123'];
      const error = new Error('Trigger page impression failed');
      mockPersonalizeSdk.triggerImpressions.mockRejectedValue(error);

      // Act & Assert
      await expect(act(async () => {
        await result.current.triggerPageImpression(pageName, experienceShortUids);
      })).rejects.toThrow('Trigger page impression failed');
    });
  });

  describe('isReady', () => {
    it('should return true when SDK is available', () => {
      // Arrange
      mockUsePersonalize.mockReturnValue(mockPersonalizeSdk);

      // Act
      const { result } = renderHook(() => useImpressions());

      // Assert
      expect(result.current.isReady).toBe(true);
    });

    it('should return false when SDK is not available', () => {
      // Arrange
      mockUsePersonalize.mockReturnValue(null);

      // Act
      const { result } = renderHook(() => useImpressions());

      // Assert
      expect(result.current.isReady).toBe(false);
    });
  });
});




