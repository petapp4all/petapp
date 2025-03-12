import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useMutation } from "@tanstack/react-query";
import { loginUser, logoutUser } from "../../components/utils/auth";

const SignInScreen = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userDetails = await AsyncStorage.getItem("userDetails");
        if (userDetails) {
          const parsedUser = JSON.parse(userDetails);
          setEmail(parsedUser.email);
          setUserLoggedIn(true);
        }
      } catch (error) {
        console.log("Error checking login status:", error);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    };
    checkBiometricSupport();
  }, []);

  const handleLoginWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with Fingerprint",
      });

      if (result.success) {
        const userDetails = await AsyncStorage.getItem("userDetails");
        if (userDetails) {
          Alert.alert("Success", "Authenticated successfully!");
          router.push("/dashboard");
        }
      } else {
        Alert.alert("Error", "Authentication failed.");
      }
    } catch (error) {
      console.error("Biometric authentication error:", error.message);
      Alert.alert("Error", "An unexpected error occurred. Try again.");
    }
  };

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      Alert.alert("Success", "Login successful!");
      router.push("/(user)/menu");
    },
    onError: (error) => {
      const errorMessage =
        error.message || "Something went wrong, please try again";
      console.log("errorMessage=:", errorMessage);
      Alert.alert("Error", errorMessage);
    },
  });

  // Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ImageBackground
      source={require("@/assets/images/futuristic_petrol_station.png")}
      className="flex-1 justify-center items-center"
      resizeMode="cover"
    >
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50" />
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="w-full max-w-md p-6"
      >
        {/* Show welcome message if user is already logged in */}
        {userLoggedIn ? (
          <Text className="text-white text-2xl font-extrabold text-center mb-6 tracking-wide">
            Welcome Back, {email.split("@")[0]}
          </Text>
        ) : (
          <Text className="text-white text-4xl font-extrabold text-center mb-6 tracking-wide">
            Sign In
          </Text>
        )}

        <View className="bg-white/10 p-6 rounded-3xl w-full shadow-lg backdrop-blur-md border border-white/20">
          {/* Show password input only if user is already logged in */}
          {!userLoggedIn && (
            <View className="flex-row items-center bg-white/20 px-4 py-4 rounded-xl mb-4 border border-white/30">
              <FontAwesome name="envelope" size={20} color="#ddd" />
              <TextInput
                className="flex-1 ml-3 text-white text-lg font-bold"
                placeholder="Email"
                placeholderTextColor="#ddd"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          )}

          {/* Password Input */}
          <View className="flex-row items-center bg-white/20 px-4 py-4 rounded-xl mb-6 border border-white/30">
            <Ionicons name="lock-closed" size={24} color="#ddd" />
            <TextInput
              className="flex-1 ml-3 text-white text-lg font-bold"
              placeholder="Password"
              placeholderTextColor="#ddd"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#ddd"
              />
            </TouchableOpacity>
          </View>

          {/* Sign-In Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="rounded-lg overflow-hidden shadow-xl"
            onPress={() => mutation.mutate({ email, password })}
            disabled={
              (userLoggedIn ? !password : !email || !password) ||
              mutation.isPending
            }
          >
            <LinearGradient
              colors={["#0072FF", "#00C6FF"]}
              className="px-6 py-4 rounded-lg"
              style={{ opacity: mutation.isPending ? 0.5 : 1 }}
            >
              {mutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-lg text-center font-semibold tracking-wide">
                  Sign In
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {isBiometricSupported && userLoggedIn && (
            <View className="mt-4">
              <TouchableOpacity
                className="mt-3 px-6 py-4 bg-blue-600 rounded-lg"
                onPress={handleLoginWithBiometrics}
              >
                <Text className="text-white text-center font-semibold">
                  Sign In with Fingerprint
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Switch Account Button */}
          {userLoggedIn && (
            <TouchableOpacity
              className="mt-4 px-6 py-4 bg-red-600 rounded-lg"
              onPress={() => {
                Alert.alert(
                  "Warning",
                  "This action will clear your saved email, password, and other saved settings from this device. Do you want to continue?",
                  [
                    {
                      text: "CANCEL",
                      style: "cancel",
                    },
                    {
                      text: "PROCEED",
                      onPress: async () => {
                        await AsyncStorage.removeItem("userDetails");
                        setUserLoggedIn(false);
                        setEmail("");
                        setPassword("");
                        Alert.alert(
                          "Success",
                          "All saved data has been cleared. You can now sign in with another account."
                        );
                        router.replace("/sign-in");
                      },
                    },
                  ]
                );
              }}
            >
              <Text className="text-white text-center font-semibold">
                Switch Account
              </Text>
            </TouchableOpacity>
          )}

          {/* Sign-Up Navigation */}
          {!userLoggedIn && (
            <TouchableOpacity
              className="mt-6"
              onPress={() => router.push("/sign-up")}
            >
              <Text className="text-gray-300 text-center text-base">
                Don't have an account?{" "}
                <Text className="text-blue-300 font-semibold">Sign Up</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

export default SignInScreen;
