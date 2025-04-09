import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import {
  sendNotificationToManyUsers,
  sendNotificationToUser,
} from "../../../components/utils/auth";
import { sendPushNotification } from "../../../components/sendPushNotification";

export default function NotificationScreen() {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("Test Notification");
  const [body, setBody] = useState("This is a test message");

  const handleSendNotification = async () => {
    if (!userId) {
      return Alert.alert("Validation", "Please enter a User ID.");
    }
    try {
      // const res = await sendNotificationToUser({
      //   recipientId: userId,
      //   title,
      //   body,
      // });
      const res = await sendPushNotification();
      console.log("Success", "Notification sent!");
      Alert.alert("Success", "Notification sent!");
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to send notification");
    }
  };

  // const handleSend = async () => {
  //   try {
  //     await sendNotificationToManyUsers({
  //       title: "🛢️ Petrol News Update (Test)",
  //       body: "Click to see the latest petrol updates.",
  //       data: { screen: "/users/news" },
  //     });
  //     alert("Notification sent!");
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Failed to send notification");
  //   }
  // };

  return (
    <View style={styles.container}>
      {/* <Button title="Send Test Notification" onPress={handleSend} />; */}
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
