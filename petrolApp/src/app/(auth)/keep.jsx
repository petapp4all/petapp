import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Import icons

const SignInScreen = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ImageBackground
      source={require("@/assets/images/futuristic_petrol_station.png")}
      className="flex-1 justify-center items-center"
      resizeMode="cover"
    >
      {/* Black overlay for readability */}
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50" />
      <View className="w-full p-6">
        <Text className="text-white text-4xl font-bold text-center mb-6">
          Welcome Back
        </Text>

        {/* Glassmorphic Card */}
        <View className="bg-white/10 p-6 rounded-2xl w-full shadow-lg">
          <TextInput
            className="bg-white/20 text-white px-4 py-3 rounded-lg mb-4 border border-white/30"
            placeholder="Email"
            placeholderTextColor="#ddd"
            keyboardType="email-address"
          />

          {/* Password Input with Toggle */}
          <View className="relative">
            <TextInput
              className="bg-white/20 text-white px-4 py-3 pr-12 rounded-lg border border-white/30"
              placeholder="Password"
              placeholderTextColor="#ddd"
              secureTextEntry={!showPassword} // Toggle visibility
            />
            <TouchableOpacity
              className="absolute right-4 top-3"
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#ddd"
              />
            </TouchableOpacity>
          </View>

          {/* Gradient Sign-In Button */}
          <TouchableOpacity
            className="mt-6 rounded-lg overflow-hidden"
            onPress={() => console.log("Signing In...")}
          >
            <LinearGradient
              colors={["#0072FF", "#00C6FF"]}
              className="px-6 py-3 rounded-lg"
            >
              <Text className="text-white text-lg text-center font-semibold">
                Sign In
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign-Up Navigation */}
          <TouchableOpacity
            className="mt-4"
            onPress={() => router.push("/sign-up")}
          >
            <Text className="text-gray-300 text-center">
              Don't have an account?{" "}
              <Text className="text-blue-300 font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SignInScreen;
