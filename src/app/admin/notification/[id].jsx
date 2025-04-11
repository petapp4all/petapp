import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Button,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserById } from "../../../redux/slices/userSlice";
import {
  sendImportantEmail,
  sendNotificationToUser,
} from "../../../components/utils/auth";

const SingleUser = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailSubject, setEmailSubject] = useState("Important Message");
  const [emailMessage, setEmailMessage] = useState(
    "This is an important message."
  );
  const [sendingNotification, setSendingNotification] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleSendNotification = async () => {
    if (!id) {
      return Alert.alert("Validation", "No User ID.");
    }
    setSendingNotification(true);
    try {
      await sendNotificationToUser({
        recipientId: id,
        title,
        body,
        data: {
          screen: "/users/dashboard",
          image:
            "https://leadership.ng/wp-content/uploads/2022/06/fuel-attendant.webp",
        },
      });
      Alert.alert("Success", "Notification sent!");
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to send notification");
    } finally {
      setSendingNotification(false);
    }
  };

  const handleSendEmail = async () => {
    if (!user?.email) {
      return Alert.alert("Validation", "User email not available.");
    }
    setSendingEmail(true);
    try {
      await sendImportantEmail({
        email: user.email,
        subject: emailSubject,
        message: emailMessage,
      });
      Alert.alert("Success", "Email sent successfully!");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

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

  const [title, setTitle] = useState("Important Notification");
  const [body, setBody] = useState(
    "This is to notify you that we just sent you important email"
  );

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

  return (
    <ScrollView className="p-4 bg-gray-100 space-y-6">
      <View className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <Text className="text-3xl font-bold text-center mb-4">{user.name}</Text>
      </View>
      {/* Notification Section */}
      <View className="bg-white mb-10 rounded-2xl p-4 shadow-md">
        <Text className="text-xl font-semibold mb-4 text-gray-800">
          Send Notification
        </Text>

        <Text className="text-sm text-gray-600 mb-1">Title</Text>
        <TextInput
          placeholder="Enter Title"
          value={title}
          onChangeText={setTitle}
          className="bg-gray-100 p-3 rounded-lg mb-3"
        />

        <Text className="text-sm text-gray-600 mb-1">Body</Text>
        <TextInput
          placeholder="Enter Body"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={3}
          className="bg-gray-100 p-3 rounded-lg mb-4"
        />
        <TouchableOpacity
          className={`bg-blue-600 py-3 rounded-lg items-center ${
            sendingNotification ? "opacity-70" : ""
          }`}
          onPress={handleSendNotification}
          disabled={sendingNotification}
        >
          {sendingNotification ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Send Notification
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Email Section */}
      <View className="bg-white mb-16 rounded-2xl p-4 shadow-md">
        <Text className="text-xl font-semibold mb-4 text-gray-800">
          Send Important Email
        </Text>

        <Text className="text-sm text-gray-600 mb-1">Subject</Text>
        <TextInput
          placeholder="Subject"
          value={emailSubject}
          onChangeText={setEmailSubject}
          className="bg-gray-100 p-3 rounded-lg mb-3"
        />

        <Text className="text-sm text-gray-600 mb-1">Message</Text>
        <TextInput
          placeholder="Message"
          value={emailMessage}
          onChangeText={setEmailMessage}
          multiline
          numberOfLines={4}
          className="bg-gray-100 p-3 rounded-lg mb-4"
        />

        <TouchableOpacity
          className={`bg-green-600 py-3 rounded-lg items-center ${
            sendingEmail ? "opacity-70" : ""
          }`}
          onPress={handleSendEmail}
          disabled={sendingEmail}
        >
          {sendingEmail ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Send Email
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SingleUser;
