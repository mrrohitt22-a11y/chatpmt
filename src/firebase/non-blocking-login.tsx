'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  UserCredential
} from 'firebase/auth';

/** Initiate anonymous sign-in. */
export async function initiateAnonymousSignIn(authInstance: Auth): Promise<UserCredential> {
  return signInAnonymously(authInstance);
}

/** Initiate email/password sign-up. */
export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in. */
export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(authInstance, email, password);
}

/** Initiate Google sign-in. */
export async function initiateGoogleSignIn(authInstance: Auth): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  return signInWithPopup(authInstance, provider);
}

/** Initiate GitHub sign-in. */
export async function initiateGithubSignIn(authInstance: Auth): Promise<UserCredential> {
  const provider = new GithubAuthProvider();
  return signInWithPopup(authInstance, provider);
}
