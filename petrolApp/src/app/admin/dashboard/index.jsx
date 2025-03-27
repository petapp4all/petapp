import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  BackHandler,
} from "react-native";
import React, { useEffect } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
const AdminDashboard = () => {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const backAction = () => {
      // Check if user is at the main dashboard and trying to go back
      if (
        segments.length === 2 &&
        segments[0] === "admin" &&
        segments[1] === "dashboard"
      ) {
        Alert.alert(
          "Logout",
          "Are you sure you want to logout?",
          [
            {
              text: "No",
              onPress: () => null,
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: async () => {
                await AsyncStorage.removeItem("userDetails");
                router.replace("/sign-in");
              },
            },
          ],
          { cancelable: false }
        );
        return true; // Prevent default back action
      }

      return false; // Allow normal back navigation
    };

    // Add event listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup listener on unmount
  }, [segments]);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      className="p-4 bg-[#f5f5f5] flex-1"
    >
      {/* Header */}
      <LinearGradient
        colors={["#002F63", "#00509D"]}
        className="rounded-xl p-6 mb-4"
      >
        <Text className="text-white text-xl font-semibold">
          Fuel Sales & User Analytics
        </Text>
      </LinearGradient>

      {/* Sales Overview */}
      <View className="bg-white p-4 rounded-lg shadow-md mb-4">
        <Text className="text-lg font-semibold text-gray-700">
          Today's Sales
        </Text>
        <Text className="text-2xl font-bold text-green-600">₦1,250,000</Text>
        <Text className="text-gray-500">Total Revenue This Month</Text>
        <Text className="text-xl font-bold text-gray-800">₦35,750,000</Text>
      </View>

      {/* Fuel Inventory */}
      <View className="bg-white p-4 rounded-lg shadow-md mb-4">
        <Text className="text-lg font-semibold text-gray-700">Fuel Stock</Text>
        <View className="flex-row justify-between mt-2">
          <View>
            <Text className="text-gray-500">PMS</Text>
            <Text className="text-xl font-bold">12,500 Liters</Text>
          </View>
          <View>
            <Text className="text-gray-500">AGO</Text>
            <Text className="text-xl font-bold">8,900 Liters</Text>
          </View>
        </View>
      </View>

      {/* User Statistics */}
      <View className="bg-white p-4 rounded-lg shadow-md mb-4">
        <Text className="text-lg font-semibold text-gray-700">
          User Statistics
        </Text>
        <View className="flex-row justify-between mt-2">
          <View className="items-center">
            <FontAwesome5 name="users" size={24} color="#00509D" />
            <Text className="text-gray-600 font-semibold">Total Users</Text>
            <Text className="text-2xl font-bold">50</Text>
          </View>
          <View className="items-center">
            <FontAwesome5 name="user-check" size={24} color="#00509D" />
            <Text className="text-gray-600 font-semibold">Active Users</Text>
            <Text className="text-2xl font-bold">30</Text>
          </View>
          <View className="items-center">
            <FontAwesome5 name="user-plus" size={24} color="#00509D" />
            <Text className="text-gray-600 font-semibold">New Users</Text>
            <Text className="text-2xl font-bold">20</Text>
          </View>
        </View>
      </View>

      {/* Orders Management */}
      <View className="flex-row justify-between mb-4">
        <View className="bg-white p-4 rounded-lg shadow-md flex-1 mr-2 items-center">
          <FontAwesome5 name="shopping-cart" size={24} color="#00509D" />
          <Text className="text-gray-600 font-semibold">Pending Orders</Text>
          <Text className="text-2xl font-bold">7</Text>
        </View>
        <View className="bg-white p-4 rounded-lg shadow-md flex-1 ml-2 items-center">
          <FontAwesome5 name="check-circle" size={24} color="green" />
          <Text className="text-gray-600 font-semibold">Completed Orders</Text>
          <Text className="text-2xl font-bold">56</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="p-4 bg-white rounded-lg shadow-lg mb-4">
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="bg-green-600 p-5 rounded-lg shadow-md flex-1 mx-2 items-center"
            onPress={() => router.push("/admin/users")}
          >
            <FontAwesome5 name="user-cog" size={24} color="white" />
            <Text className="text-white text-center">Manage Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/admin/orders")}
            className="bg-red-600 p-5 rounded-lg shadow-md flex-1 ml-2 items-center"
          >
            <FontAwesome5 name="file-invoice-dollar" size={24} color="white" />
            <Text className="text-white text-center">Manage Orders</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;
