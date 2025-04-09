import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import { sendNotificationToManyUsers } from "../../../components/utils/auth";

export default function NotificationScreen() {
  const handleSend = async () => {
    try {
      await sendNotificationToManyUsers({
        title: "🛢️ Petrol News Update (Test)",
        body: "Click to see the latest petrol updates.",
        data: { screen: "/users/news" },
      });
      alert("Notification sent!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send notification");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Send Test Notification" onPress={handleSend} />;
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
