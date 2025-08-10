import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  isLoading = false,
  disabled = false,
}) => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const handleGoogleSignIn = async () => {
    if (isLoading || disabled) return;

    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      onError?.(error?.message || 'Google sign-in failed');
    }
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        opacity: disabled ? 0.6 : 1,
      }}
      onPress={handleGoogleSignIn}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      <Ionicons name="logo-google" size={20} color="#4285F4" />
      <Text
        style={{
          marginLeft: 12,
          fontSize: 16,
          fontWeight: '500',
          color: '#333',
        }}
      >
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </Text>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;
