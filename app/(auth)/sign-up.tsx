import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { authStyles } from "@/assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import VerifyEmailScreen from "./verify-email";

const signUpSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignUpScreen = () => {
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const email = watch("email");
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      const { email, password } = data;
      const signInAttempt = await signUp.create({
        emailAddress: email,
        password: password,
      });
      const emailVerification = await signUp.prepareEmailAddressVerification({strategy: 'email_code'});
      setPendingVerification(true);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Sign Up failed",
        text2: error?.message
      });
      console.log(JSON.stringify(error?.message, null, 2));
    } finally {
      setIsLoading(false);
    }
  };
  if(pendingVerification) return <VerifyEmailScreen email={email} onBack={() => setPendingVerification(false)}/>
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
              source={require("../../assets/images/i2.png")}
              contentFit="contain"
              style={authStyles.image}
            />
          </View>
          <Text style={authStyles.title}>Create Account</Text>
          <View style={authStyles.formContainer}>
            {/* Email */}
            <View style={authStyles.inputContainer}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor={COLORS.textLight}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={authStyles.textInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                )}
                name="email"
              />
              {errors.email && (
                <Text className="text-red-500 my-2 ml-4">
                  {errors.email.message}
                </Text>
              )}
            </View>
            {/* Password */}
            <View style={authStyles.inputContainer}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Enter Password"
                    onBlur={onBlur}
                    placeholderTextColor={COLORS.textLight}
                    onChangeText={onChange}
                    value={value}
                    style={authStyles.textInput}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                )}
                name="password"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
              {errors.password && (
                <Text className="text-red-500 my-2 ml-4">
                  {errors.password.message}
                </Text>
              )}
            </View>
            {/* Sign In Button */}
            <TouchableOpacity style={[authStyles.authButton, isLoading && authStyles.buttonDisabled]} onPress={handleSubmit(onSubmit)} disabled={isLoading} activeOpacity={0.8}>
              <Text style={authStyles.buttonText}>{isLoading ? "Creating an Account..." : "Sign Up"}</Text>
            </TouchableOpacity>
            {/* Sign Up Link */}
            <TouchableOpacity style={authStyles.linkContainer} onPress={() => router.push("/(auth)/sign-in")}>
              <Text style={authStyles.linkText}>
                Don&apos;t have an account? <Text style={authStyles.link}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </View>
  );
};

export default SignUpScreen;
