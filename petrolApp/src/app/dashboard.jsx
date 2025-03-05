import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserDetails,
  getUserToken,
  logoutUser,
} from "../components/utils/auth";
import { useRouter } from "expo-router";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch user details
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userDetails"],
    queryFn: getUserDetails,
  });

  // Fetch user token
  const { data: token } = useQuery({
    queryKey: ["userToken"],
    queryFn: getUserToken,
  });

  // Handle Logout
  const handleLogout = async () => {
    await logoutUser();
    queryClient.invalidateQueries(["userDetails"]);
    router.push("/");
  };

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Logout Confirmation", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: handleLogout },
      ]);
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup listener on unmount
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0072FF" />
        <Text className="text-gray-400 mt-2">Loading user data...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Failed to load user data</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-900 p-6">
      <Text className="text-white text-2xl font-bold">User Dashboard</Text>

      <View className="bg-white/10 p-6 rounded-xl mt-4 shadow-lg w-full max-w-md">
        <Image
          source={{
            uri: user?.profileImage || "https://via.placeholder.com/150",
          }}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <Text className="text-white text-lg font-semibold text-center">
          {user?.fullName || "Guest User"}
        </Text>
        <Text className="text-gray-300 text-center">
          {user?.email || "No email provided"}
        </Text>
        <Text className="text-gray-400 text-center mt-2">
          Token: {token ? token.slice(0, 10) + "..." : "No token available"}
        </Text>
      </View>

      <TouchableOpacity onPress={handleLogout} className="mt-6">
        <Text className="text-red-500 text-lg font-semibold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;
