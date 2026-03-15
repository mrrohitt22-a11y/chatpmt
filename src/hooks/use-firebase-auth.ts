'use client';

import { useContext } from 'react';
import { FirebaseContext } from '@/firebase/provider';

/**
 * Drop-in replacement for useSupabaseAuth.
 * Returns { user, isLoading } from Firebase context so every
 * component that previously depended on Supabase auth keeps working
 * with zero API-surface change.
 */
export function useFirebaseAuth() {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseProvider.');
  }

  return {
    user: context.user,
    isLoading: context.isUserLoading,
  };
}
