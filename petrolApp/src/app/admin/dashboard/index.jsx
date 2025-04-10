import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllUsersSummary } from "../../../components/utils/auth";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const AdminDashboard = () => {
  const router = useRouter();
  const segments = useSegments();
  const [users, setUsers] = useState({});
  const screenWidth = Dimensions.get("window").width;

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userDetails = await AsyncStorage.getItem("userDetails");
        if (!userDetails) {
          router.replace("/sign-in");
        }
        const users = await getAllUsersSummary();
        setUsers(users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

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
        <Text className="text-white text-xl font-semibold">User Analytics</Text>
      </LinearGradient>

      {/* User Statistics */}

      <View className="bg-white p-4 rounded-lg shadow-md mb-4">
        <Text className="text-lg font-semibold text-gray-700">
          User Statistics
        </Text>
        <View className="flex-row flex-wrap justify-between mt-2">
          <View className="w-1/2 items-center mb-4">
            <FontAwesome5 name="users" size={24} color="#00509D" />
            <Text className="text-gray-600 font-semibold">Total Users</Text>
            <Text className="text-2xl font-bold">{users.totalUsers}</Text>
          </View>
          <View className="w-1/2 items-center mb-4">
            <FontAwesome5 name="user-check" size={24} color="#00509D" />
            <Text className="text-gray-600 font-semibold">Active Users</Text>
            <Text className="text-2xl font-bold">{users.activeUsers}</Text>
          </View>
          <View className="w-1/2 items-center mb-4">
            <FontAwesome5 name="user-plus" size={24} color="#00509D" />
            <Text className="text-gray-600 font-semibold">New Users</Text>
            <Text className="text-2xl font-bold">{users.newUsers}</Text>
          </View>
          <View className="w-1/2 items-center mb-4">
            <FontAwesome5 name="user-lock" size={24} color="#D9534F" />
            <Text className="text-gray-600 font-semibold">Blocked Users</Text>
            <Text className="text-2xl font-bold">
              {users.blockedUsers || 0}
            </Text>
          </View>
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-700">
          Recent User Logins (Weekly)
        </Text>
      </View>
      <LineChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              data: [5, 6, 4, 8, 2, 9, 3],
            },
          ],
        }}
        width={screenWidth - 40} // minus padding
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#00509D",
          backgroundGradientTo: "#002F63",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: () => "#fff",
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

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
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={() => router.push("/admin/notifications")}
              className="flex-1 mx-2 items-center bg-blue-500 p-4 rounded-lg"
            >
              <FontAwesome5 name="bell" size={20} color="white" />
              <Text className="text-white">Send Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/admin/settings")}
              className="flex-1 mx-2 items-center bg-purple-500 p-4 rounded-lg"
            >
              <FontAwesome5 name="cogs" size={20} color="white" />
              <Text className="text-white">Manage Notification</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;
