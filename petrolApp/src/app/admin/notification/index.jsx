import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import { usePushNotifications } from "../../../components/usePushNotifications";
import { sendNotificationToUser } from "../../../components/utils/auth";

export default function NotificationScreen() {
  const { expoPushToken, notification } = usePushNotifications();

  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("Test Notification");
  const [body, setBody] = useState("This is a test message");

  const handleSendNotification = async () => {
    if (!userId) {
      return Alert.alert("Validation", "Please enter a User ID.");
    }
    try {
      const res = await sendNotificationToUser({
        recipientId: userId,
        title,
        body,
      });
      Alert.alert("Success", "Notification sent!");
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to send notification");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Your Expo Push Token:</Text>
      <Text selectable>{expoPushToken}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter User ID"
        value={userId}
        onChangeText={setUserId}
      />

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

      {notification && (
        <View style={{ marginTop: 20 }}>
          <Text>📨 Received Notification:</Text>
          <Text>Title: {notification.request.content.title}</Text>
          <Text>Body: {notification.request.content.body}</Text>
        </View>
      )}
    </View>
  );
}

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
