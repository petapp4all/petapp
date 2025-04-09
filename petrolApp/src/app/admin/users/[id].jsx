import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Button,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserById, removeUserById } from "../../../redux/slices/userSlice";
import { sendNotificationToUser } from "../../../components/utils/auth";

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

  const [title, setTitle] = useState("Test Notification");
  const [body, setBody] = useState("This is a test message");
  const handleSendNotification = async () => {
    if (!id) {
      return Alert.alert("Validation", "No User ID.");
    }
    try {
      const res = await sendNotificationToUser({
        recipientId: id,
        title,
        body,
      });
      Alert.alert("Success", "Notification sent!");
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to send notification");
    }
  };

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
            dispatch(removeUserById(id));
            router.back();
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
  console.log("user=", user);

  return (
    <ScrollView className="p-4 bg-gray-100">
      {/* User Info */}
      <View className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <Text className="text-3xl font-bold text-center mb-4">{user.name}</Text>
        <Text className="text-xl text-gray-700">📧 Email: {user.email}</Text>
        <Text className="text-xl text-gray-700">📞 Phone: {user.phone}</Text>
        <Text className="text-xl text-gray-700">
          🏠 Address: {user.address}
        </Text>
        <Text className="text-xl text-gray-700">
          🏦 Total Transactions: {user.totalTransactions}
        </Text>
        <Text className="text-xl text-gray-700">
          🗓 Registered: {user.registeredDate}
        </Text>
        <Text
          className={`text-xl font-bold ${
            user.status === "Active" ? "text-green-500" : "text-red-500"
          }`}
        >
          ⚡ Status: {user.status}
        </Text>
        <Text className="text-xl text-gray-700">
          ⏳ Last Active: {user.lastActive}
        </Text>
      </View>

      {/* Notifications Sent */}
      <View className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <Text className="text-2xl font-bold mb-4">
          📢 Notifications Received
        </Text>
        <Text className="text-xl text-gray-700">
          📩 Push: {user.notificationsSent.push}
        </Text>
        <Text className="text-xl text-gray-700">
          📧 Email: {user.notificationsSent.email}
        </Text>
      </View>

      {/* Send Notification to a user*/}

      <TextInput
        style={styles.input}
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Body"
        value={body}
        onChangeText={setBody}
      />

      <Button title="Send Notification" onPress={handleSendNotification} />

      {/* Delete Button */}
      <TouchableOpacity
        onPress={handleDelete}
        className="bg-red-500 p-4 rounded-lg shadow-lg mt-3 mb-6"
      >
        <Text className="text-xl text-white font-bold text-center">
          Delete User
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginVertical: 8,
  },
});

export default SingleUser;
