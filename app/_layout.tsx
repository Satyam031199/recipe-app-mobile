import { Slot } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import "./globals.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import SafeScreen from "@/components/SafeScreen";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
