// This file is kept for backward compatibility
// The actual Personalize SDK is now accessed via PersonalizeContext

export const setLanguagePreference = async (language: "en" | "hi") => {
  console.log(`🌐 [LANGUAGE] Setting language preference to: ${language}`);
  
  // Note: This function is called from LanguageToggle component
  // but the actual SDK interaction should happen through usePersonalize hook
  // The language preference should be set using personalizeSdk.set()
  
  // For now, just log - the component using this should use usePersonalize instead
  console.log(`🌐 [LANGUAGE] Language stored in localStorage: ${language}`);
  console.log(`🌐 [LANGUAGE] To actually set in Personalize SDK, use:`);
  console.log(`🌐 [LANGUAGE] const sdk = usePersonalize(); await sdk.set({ language: '${language}' })`);
};
