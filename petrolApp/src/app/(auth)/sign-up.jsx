import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../components/utils/auth";

const SignUpScreen = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      Alert.alert("Success", "Registration successful!");
      router.push("/sign-in");
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Registration failed");
    },
  });

  const handleSignUp = () => {
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    mutation.mutate({ fullName, email, phoneNumber, password });
  };

  return (
    <ImageBackground
      source={require("@/assets/images/futuristic_petrol_station.png")}
      className="flex-1 justify-center items-center"
      resizeMode="cover"
    >
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50" />

      <View className="w-full p-6">
        <Text className="text-white text-4xl font-bold text-center mb-6 shadow-md">
          Create an Account
        </Text>
        <View className="bg-white/10 p-6 rounded-2xl w-full shadow-lg border border-white/20 backdrop-blur-md">
          <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-lg mb-4 border border-white/30">
            <FontAwesome name="user" size={20} color="#ddd" />
            <TextInput
              className="flex-1 ml-3 text-white text-lg font-bold"
              placeholder="Full Name"
              placeholderTextColor="#ddd"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-lg mb-4 border border-white/30">
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
          <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-lg mb-4 border border-white/30">
            <FontAwesome name="phone" size={20} color="#ddd" />
            <TextInput
              className="flex-1 ml-3 text-white text-lg font-bold"
              placeholder="Phone Number"
              placeholderTextColor="#ddd"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-lg mb-4 border border-white/30">
            <Ionicons name="lock-closed" size={20} color="#ddd" />
            <TextInput
              className="flex-1 ml-3 text-white text-lg font-bold"
              placeholder="Password"
              placeholderTextColor="#ddd"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View className="flex-row items-center bg-white/20 px-4 py-2 rounded-lg mb-6 border border-white/30">
            <Ionicons name="lock-closed" size={20} color="#ddd" />
            <TextInput
              className="flex-1 ml-3 text-white text-lg font-bold"
              placeholder="Confirm Password"
              placeholderTextColor="#ddd"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <TouchableOpacity
            className="rounded-lg overflow-hidden"
            onPress={handleSignUp}
            disabled={mutation.isPending}
          >
            <LinearGradient
              colors={["#0072FF", "#00C6FF"]}
              className="px-6 py-4 rounded-lg flex-row justify-center items-center"
            >
              {mutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-lg text-center font-semibold">
                  Sign Up
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          expo start --android
          <TouchableOpacity
            className="mt-4"
            onPress={() => router.push("/sign-in")}
          >
            <Text className="text-gray-300 text-center">
              Already have an account?{" "}
              <Text className="text-blue-300 font-semibold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default SignUpScreen;
