import { Slot } from "expo-router";
import "./globals.css";
import { ClerkProvider, tokenCache, clerkConfig } from "@/config/clerk";
import SafeScreen from "@/components/SafeScreen";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, Text } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
  // Don't render ClerkProvider if publishable key is missing
  if (!clerkConfig.publishableKey) {
    return (
      <SafeScreen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, textAlign: 'center', color: '#666' }}>
            Missing Clerk configuration. Please check your environment variables.
          </Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <ClerkProvider 
      tokenCache={tokenCache}
      publishableKey={clerkConfig.publishableKey}
    >
      <QueryClientProvider client={queryClient}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
