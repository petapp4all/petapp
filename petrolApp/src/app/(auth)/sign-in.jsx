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
import React, { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../components/utils/auth";

const SignInScreen = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Handle success - store token, redirect
      console.log("Login Successful", data);
      Alert.alert("Success", "Login successful!");
      router.push("/dashboard");
    },
    onError: (error) => {
      // Handle error
      Alert.alert("Error", error.message);
    },
  });
  // Fade-in animation
  React.useEffect(() => {
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
        <Text className="text-white text-4xl font-extrabold text-center mb-6 tracking-wide">
          Welcome Back
        </Text>

        <View className="bg-white/10 p-6 rounded-3xl w-full shadow-lg backdrop-blur-md border border-white/20">
          {/* Email Input */}
          <View className="flex-row items-center bg-white/20 px-4 py-3 rounded-xl mb-4 border border-white/30">
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

          {/* Password Input */}
          <View className="flex-row items-center bg-white/20 px-4 py-3 rounded-xl mb-6 border border-white/30">
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
            disabled={mutation.isPending}
          >
            <LinearGradient
              colors={["#0072FF", "#00C6FF"]}
              className="px-6 py-4 rounded-lg"
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

          {/* Sign-Up Navigation */}
          <TouchableOpacity
            className="mt-6"
            onPress={() => router.push("/sign-up")}
          >
            <Text className="text-gray-300 text-center text-base">
              Don't have an account?{" "}
              <Text className="text-blue-300 font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

export default SignInScreen;
