"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import Personalize from '@contentstack/personalize-edge-sdk';
import { Sdk } from '@contentstack/personalize-edge-sdk/dist/sdk';

let sdkInstance: Sdk | null = null;
export async function getPersonalizeInstance() {
  console.log('🔧 [PERSONALIZE CONTEXT] ==========================================');
  console.log('🔧 [PERSONALIZE CONTEXT] Getting personalization SDK instance');
  console.log('🔧 [PERSONALIZE CONTEXT] ==========================================');
  console.log('🔧 [PERSONALIZE CONTEXT] Current SDK instance:', sdkInstance ? 'EXISTS' : 'NULL');
  console.log('🔧 [PERSONALIZE CONTEXT] Initialization status:', Personalize.getInitializationStatus());
  console.log('🔧 [PERSONALIZE CONTEXT] Project UID env var:', process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID ? '✅ SET' : '❌ NOT SET');
  console.log('🔧 [PERSONALIZE CONTEXT] Project UID value:', process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID);
  
  if (!Personalize.getInitializationStatus()) {
    console.log('🔧 [PERSONALIZE CONTEXT] SDK not initialized yet, initializing...');
    try {
      console.log('🔧 [PERSONALIZE CONTEXT] Calling Personalize.init()...');
      sdkInstance = await Personalize.init(
        process.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID as string
      );
      console.log('✅ [PERSONALIZE CONTEXT] Personalization SDK initialized successfully!');
      console.log('✅ [PERSONALIZE CONTEXT] SDK instance:', sdkInstance);
    } catch (error) {
      console.error('❌ [PERSONALIZE CONTEXT] Error initializing personalization SDK:', error);
      console.error('❌ [PERSONALIZE CONTEXT] Error message:', error.message);
      console.error('❌ [PERSONALIZE CONTEXT] Error stack:', error.stack);
    }
  } else {
    console.log('🔧 [PERSONALIZE CONTEXT] SDK already initialized, using existing instance');
  }
  console.log('🔧 [PERSONALIZE CONTEXT] Returning SDK instance:', sdkInstance ? 'AVAILABLE' : 'NULL');
  console.log('🔧 [PERSONALIZE CONTEXT] ==========================================');
  return sdkInstance;
}

const PersonalizeContext = createContext<Sdk | null>(null);

export function PersonalizeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('🔧 [PERSONALIZE CONTEXT] PersonalizeProvider rendering');
  const [sdk, setSdk] = useState<Sdk | null>(null);
  
  useEffect(() => {
    console.log('🔧 [PERSONALIZE CONTEXT] useEffect triggered - initializing SDK');
    getPersonalizeInstance().then((instance) => {
      console.log('🔧 [PERSONALIZE CONTEXT] SDK instance received:', instance ? 'Available' : 'Not available');
      setSdk(instance);
    });
  }, []);
  
  console.log('🔧 [PERSONALIZE CONTEXT] Current SDK state:', sdk ? 'Available' : 'Not available');
  
  return (
    <PersonalizeContext.Provider value={sdk}>
      {children}
    </PersonalizeContext.Provider>
  );
}

export function usePersonalize() {
  const sdk = useContext(PersonalizeContext);
  console.log('🔧 [PERSONALIZE CONTEXT] usePersonalize hook called, SDK available:', sdk ? 'Yes' : 'No');
  return sdk;
}
