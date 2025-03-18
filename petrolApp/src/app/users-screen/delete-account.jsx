import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { deleteUser } from "../../components/utils/auth";

const DeleteAccount = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      await deleteUser(email, password);
      Alert.alert("Success", "Account deleted successfully");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-red-500 mb-3 text-lg font-bold">
        Warning: This action is irreversible!
      </Text>

      <TextInput
        className="border p-3 mb-3 rounded-lg"
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="border p-3 mb-3 rounded-lg"
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className={`p-4 rounded-lg ${loading ? "bg-gray-400" : "bg-red-600"}`}
        onPress={handleDeleteAccount}
        disabled={loading}
      >
        <Text className="text-white text-center">
          {loading ? "Deleting..." : "Delete My Account"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteAccount;
