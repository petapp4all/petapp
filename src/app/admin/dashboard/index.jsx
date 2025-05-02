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
// import { VictoryLine, VictoryChart, VictoryAxis } from "victory-native";

import { Dimensions } from "react-native";

const AdminDashboard = () => {
  const router = useRouter();
  const segments = useSegments();
  const [users, setUsers] = useState(null);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const backAction = () => {
      // Check if user is at the main dashboard and trying to go back
      if (
        segments?.length === 2 &&
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
      <View className="bg-white p-4 rounded-2xl shadow-md mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          User Statistics
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {[
            {
              icon: "users",
              label: "Total Users",
              value: users?.totalUsers || 0,
              color: "#00509D",
            },
            {
              icon: "user-check",
              label: "Active Users",
              value: users?.activeUsersCount || 0,
              color: "#28a745",
            },
            {
              icon: "user-plus",
              label: "New Users",
              value: users?.newUsers || 0,
              color: "#17a2b8",
            },
            {
              icon: "user-lock",
              label: "Blocked Users",
              value: users?.blockedUsers || 0,
              color: "#D9534F",
            },
          ].map((item, index) => (
            <View key={index} className="w-1/2 p-2">
              <View className="items-center bg-gray-200 p-4 rounded-xl shadow-sm">
                <FontAwesome5 name={item.icon} size={24} color={item.color} />
                <Text className="text-sm text-gray-600 mt-1">{item.label}</Text>
                <Text className="text-xl font-extrabold text-gray-800">
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
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
            className="bg-blue-500 p-5 rounded-lg shadow-md flex-1 mx-2 items-center"
            onPress={() => router.push("/admin/notification")}
          >
            <FontAwesome5 name="bell" size={24} color="white" />
            <Text className="text-white text-center">Send Notification</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Chart */}
      <View className="mb-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Active Users Per Day (Weekly)
        </Text>
      </View>

      <LineChart
        data={{
          labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          datasets: [{ data: users?.loginsPerDay || [0, 0, 1, 0, 0, 0, 0] }],
        }}
        width={screenWidth - 40}
        height={200}
        fromZero={true}
        bezier={false}
        chartConfig={{
          backgroundGradientFrom: "#00509D",
          backgroundGradientTo: "#002F63",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: () => "#fff",
          formatYLabel: (yValue) => {
            const val = Math.round(Number(yValue));
            return val <= 1 ? val.toString() : "";
          },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#fff",
          },
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      {/* <VictoryChart domainPadding={20}>
  <VictoryAxis
    tickValues={[0, 1]}
    tickFormat={["0", "1"]}
  />
  <VictoryAxis
    dependentAxis
    tickValues={[0, 1]}
    tickFormat={["0", "1"]}
  />
  <VictoryLine
    data={[
      { x: "Sun", y: 0 },
      { x: "Mon", y: 0 },
      { x: "Tue", y: 1 },
      { x: "Wed", y: 0 },
      { x: "Thu", y: 0 },
      { x: "Fri", y: 0 },
      { x: "Sat", y: 0 },
    ]}
  />
</VictoryChart> */}
    </ScrollView>
  );
};

export default AdminDashboard;
