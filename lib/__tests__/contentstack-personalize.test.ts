import { setLanguagePreference } from '../contentstack-personalize';

describe('contentstack-personalize', () => {
  describe('setLanguagePreference', () => {
    it('should handle English language preference', async () => {
      // Act
      const result = await setLanguagePreference('en');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle Hindi language preference', async () => {
      // Act
      const result = await setLanguagePreference('hi');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should be a backward compatibility function', async () => {
      // Act
      const result = await setLanguagePreference('en');

      // Assert
      expect(result).toBeUndefined();
      // This function is kept for backward compatibility
      // The actual SDK interaction should happen through usePersonalize hook
    });

    it('should accept valid language types', async () => {
      // Act & Assert - should not throw
      await expect(setLanguagePreference('en')).resolves.toBeUndefined();
      await expect(setLanguagePreference('hi')).resolves.toBeUndefined();
    });
  });
});
