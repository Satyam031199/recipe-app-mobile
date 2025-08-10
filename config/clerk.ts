import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { env, validateEnv } from './env';

// Validate environment variables
validateEnv();

export const clerkConfig = {
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
  // Enable Google OAuth
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/',
  afterSignUpUrl: '/',
};

export { ClerkProvider, tokenCache };
