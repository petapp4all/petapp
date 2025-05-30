import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  blockUserById,
  fetchUserById,
  removeUserById,
  unblockUserById,
} from "../../../redux/slices/userSlice";

const SingleUser = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await dispatch(fetchUserById(id)).unwrap(); // if you're using createAsyncThunk
        setUser(fetchedUser);
      } catch (err) {
        setError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete ${user?.name}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(removeUserById(id)); // Use the thunk here
            router.back();
          },
        },
      ]
    );
  };

  const handleBlockToggle = () => {
    const action = user?.block ? unblockUserById : blockUserById;
    const actionText = user?.block ? "Unblock" : "Block";

    Alert.alert(
      `Confirm ${actionText}`,
      `Are you sure you want to ${actionText.toLowerCase()} ${user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: actionText,
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(action(id)).unwrap();
              const updatedUser = await dispatch(fetchUserById(id)).unwrap();
              setUser(updatedUser);
            } catch (err) {
              Alert.alert(
                "Error",
                `Failed to ${actionText.toLowerCase()} user.`
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-xl">Loading user data...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-2xl font-bold text-red-500">
          {error || "User not found"}
        </Text>
      </View>
    );
  }
  const lastActiveDate = new Date(user.lastActive);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const isRecentlyActive = lastActiveDate > oneWeekAgo;
  const displayStatus = isRecentlyActive ? "Active" : "Inactive";
  const statusColor =
    displayStatus === "Active" ? "text-green-500" : "text-red-500";

  return (
    <ScrollView className="p-4 bg-gray-100">
      {/* User Info */}
      <View className="items-center mb-6">
        <View className="w-44 h-44 rounded-full bg-white p-1 shadow-lg">
          <Image
            source={
              user?.image
                ? { uri: user.image }
                : require("@/assets/images/user.jpeg")
            }
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        </View>
      </View>

      <View className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <Text className="text-3xl font-bold text-center mb-4">{user.name}</Text>
        <Text className="text-xl text-gray-700">
          🌍 Country: {user.country}
        </Text>
        <Text className="text-xl text-gray-700">🧑‍💼 Role: {user.role}</Text>

        <Text className="text-xl text-gray-700">📧 Email: {user.email}</Text>
        <Text className="text-xl text-gray-700">📞 Phone: {user.phone}</Text>
        <Text className="text-xl text-gray-700">
          🏠 Address: {user.address}
        </Text>
        <Text className="text-xl text-gray-700">
          🗓 Registered Date: {new Date(user.createdAt).toLocaleString()}
        </Text>

        <Text className={`text-xl font-bold ${statusColor}`}>
          ⚡ Status: {displayStatus}
        </Text>

        <Text className="text-xl text-gray-700">
          ⏳ Last Active:{" "}
          {user.lastActive
            ? new Date(user.lastActive).toLocaleString()
            : "No activity yet"}
        </Text>

        <Text className="text-xl text-gray-700">
          🔒 Times Blocked: {user.blockCount}
        </Text>
      </View>

      {/* Notifications Sent */}
      <View className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <Text className="text-2xl font-bold mb-4">📢 Notifications Sent</Text>
        <Text className="text-xl text-gray-700">
          📩 Push: {user.notificationsSent?.push}
        </Text>
        <Text className="text-xl text-gray-700">
          📧 Email: {user.notificationsSent?.email}
        </Text>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={handleDelete}
        className="bg-red-500 p-4 rounded-lg shadow-lg mt-3 mb-4"
      >
        <Text className="text-xl text-white font-bold text-center">
          Delete User
        </Text>
      </TouchableOpacity>

      {/* Block/Unblock Button */}
      <TouchableOpacity
        onPress={handleBlockToggle}
        className={`${
          user?.block ? "bg-green-500" : "bg-yellow-500"
        } p-4 rounded-lg shadow-lg mb-6`}
      >
        <Text className="text-xl text-white font-bold text-center">
          {user?.block ? "Unblock User" : "Block User"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SingleUser;
