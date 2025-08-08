import { authStyles } from "@/assets/styles/auth.styles";
import { COLORS } from "@/constants/colors";
import { useSignUp } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import z from "zod";

interface VerifyEmailProps {
  email: string;
  onBack: () => void;
}

const verificationCodeSchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters"),
});

const VerifyEmailScreen = ({ email, onBack }: VerifyEmailProps) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof verificationCodeSchema>>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof verificationCodeSchema>) => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const { code } = data;
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        Toast.show({
          type: "error",
          text1: "Verify Email Failed",
        });
        console.log(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Sign Up failed",
        text2: error?.message,
      });
      console.log(JSON.stringify(error?.message, null, 2));
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("@/assets/images/i3.png")}
              contentFit="contain"
              style={authStyles.image}
            />
          </View>
          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to {email}</Text>
          <View style={authStyles.formContainer}>
            {/* Verificatoin Code */}
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter Verification Code"
                  placeholderTextColor={COLORS.textLight}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={authStyles.textInput}
                  keyboardType="number-pad"
                  editable={!loading}
                />
              )}
              name="code"
            />
            {/* Verify Email Button */}
            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Verifying..." : "Verify Email"}
              </Text>
            </TouchableOpacity>
            {/* Back to Sign Up Link */}
            <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
              <Text style={authStyles.linkText}>
                <Text style={authStyles.link}>Back to Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </View>
  );
};

export default VerifyEmailScreen;
