# Clerk Setup with Google OAuth

## Prerequisites

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application in your Clerk dashboard
3. Get your publishable key from the Clerk dashboard

## Environment Setup

Create a `.env` file in the mobile directory with:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

## Google OAuth Configuration

### 1. Configure Google OAuth in Clerk Dashboard

1. Go to your Clerk dashboard
2. Navigate to **User & Authentication** → **Social Connections**
3. Enable **Google** provider
4. Configure Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - `https://clerk.your-app.com/v1/oauth_callback`
     - `https://clerk.your-app.com/v1/oauth_callback/google`
   - Copy the Client ID and Client Secret
5. In Clerk dashboard, paste the Google Client ID and Client Secret

### 2. Configure Redirect URLs

In your Clerk dashboard, add these redirect URLs:
- `mobile://oauth-callback`
- `exp://localhost:8081/--/oauth-callback` (for development)

### 3. Update Bundle Identifiers

Update the bundle identifiers in `app.json` to match your actual app:
- iOS: `bundleIdentifier`
- Android: `package`

## Testing

1. Start your Expo development server
2. Test Google sign-in on both sign-in and sign-up screens
3. Verify that users can authenticate with Google accounts

## Troubleshooting

- Ensure your Google OAuth credentials are properly configured
- Check that redirect URLs match exactly
- Verify your Clerk publishable key is correct
- Check console logs for any OAuth errors

## Security Notes

- Never commit your `.env` file to version control
- Keep your Google OAuth credentials secure
- Use environment variables for all sensitive configuration
