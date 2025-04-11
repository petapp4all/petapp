import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Import useRouter
import { apiUrl } from "../../components/utils/utils";
import axios from "axios";
const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Use router from Expo Router

  const handleForgetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${apiUrl}/users/forgot-password`, {
        email,
      });
      Alert.alert(
        "Success",
        "Check your email for the reset code. If you don't see it, check your spam folder."
      );
      router.push({
        pathname: "/reset-password",
        params: { token: data.token },
      });
      console.log("data=", data);
    } catch (error) {
      console.log("error=", error);

      if (error.response && error.response.status === 404) {
        Alert.alert("Error", `User with email: ${email} not found.`);
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    } finally {
      setLoading(false);
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
          Forgot Password?
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Enter your email and we'll send you a reset code.
        </Text>

        {/* Email Input */}
        <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-xl mb-4 border border-gray-300">
          <Feather name="mail" size={20} color="#555" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-lg"
            placeholder="Enter your email"
            placeholderTextColor="#777"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={{ height: 45 }}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="rounded-lg overflow-hidden shadow-xl mt-4"
          onPress={handleForgetPassword}
          disabled={loading}
        >
          <LinearGradient
            colors={["#0072FF", "#00C6FF"]}
            className="px-6 py-5 rounded-lg flex items-center"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white text-lg text-center font-semibold tracking-wide">
                Send Reset Code
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ForgetPasswordScreen;
