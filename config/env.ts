// Environment configuration for Clerk
export const env = {
  CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
};

// Validate required environment variables
export const validateEnv = () => {
  if (!env.CLERK_PUBLISHABLE_KEY) {
    console.warn('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable');
    console.warn('Please create a .env file with your Clerk publishable key');
  }
};
