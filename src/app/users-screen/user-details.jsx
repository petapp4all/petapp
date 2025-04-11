import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getUserDetails, updateUser } from "../../components/utils/auth";

const UserDetails = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = await getUserDetails();
      console.log(user);
      if (user) {
        setFullName(user.name || "");
        setEmail(user.email || "");
        setPhoneNumber(user.phone || "");
      }
    };
    fetchUserDetails();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updatedUser = {
        name: fullName,
        email,
        phone: phoneNumber,
      };
      await updateUser(updatedUser);
      Alert.alert("Success", "User details updated successfully!");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update user details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-5">
      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-3 mb-4 bg-white"
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TouchableOpacity
        className="w-full p-3 rounded-lg flex flex-row justify-center items-center"
        style={{
          backgroundColor: loading
            ? "rgba(59, 130, 246, 0.5)"
            : "rgb(59, 130, 246)",
        }}
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-bold">Update</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UserDetails;
