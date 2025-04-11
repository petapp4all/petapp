import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router"; // Import router and params
import { apiUrl } from "../../components/utils/utils";

const ResetPasswordScreen = () => {
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureNewPassword, setSecureNewPassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  const { token } = useLocalSearchParams(); // Get token from URL params
  const router = useRouter(); // Use Expo Router

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword || !confirmPassword) {
      return Alert.alert("Error", "Please fill in all fields.");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }

    try {
      const response = await fetch(`${apiUrl}/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetCode, password: newPassword, token }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Your password has been reset!");
        router.replace("/sign-in");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <LinearGradient
      colors={["#0072FF", "#00C6FF"]}
      className="flex-1 justify-center items-center px-6"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg"
      >
        <Text className="text-2xl font-bold text-center text-gray-900 mb-4">
          Reset Password
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Enter the reset code sent to your email and create a new password.
        </Text>

        {/* Reset Code Input */}
        <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl mb-4 border border-gray-300">
          <Feather name="key" size={20} color="#555" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-lg"
            placeholder="Enter reset code"
            placeholderTextColor="#777"
            keyboardType="numeric"
            value={resetCode}
            onChangeText={setResetCode}
            style={{ height: 45 }}
          />
        </View>

        {/* New Password Input */}
        <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl mb-4 border border-gray-300">
          <Feather name="lock" size={20} color="#555" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-lg"
            placeholder="New password"
            placeholderTextColor="#777"
            secureTextEntry={secureNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            style={{ height: 45 }}
          />
          <TouchableOpacity
            onPress={() => setSecureNewPassword(!secureNewPassword)}
          >
            <Feather
              name={secureNewPassword ? "eye-off" : "eye"}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
        <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl mb-4 border border-gray-300">
          <Feather name="lock" size={20} color="#555" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-lg"
            placeholder="Confirm password"
            placeholderTextColor="#777"
            secureTextEntry={secureConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={{ height: 45 }}
          />
          <TouchableOpacity
            onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}
          >
            <Feather
              name={secureConfirmPassword ? "eye-off" : "eye"}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          className="rounded-lg overflow-hidden shadow-xl mt-4"
          onPress={handleResetPassword}
        >
          <LinearGradient
            colors={["#0072FF", "#00C6FF"]}
            className="px-6 py-5 rounded-lg"
          >
            <Text className="text-white text-lg text-center font-semibold tracking-wide">
              Reset Password
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ResetPasswordScreen;
