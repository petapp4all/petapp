import React from "react";
import { View, Text, Button } from "react-native";
import { usePushNotifications } from "../../../components/usePushNotifications";
import { sendPushNotification } from "../../../components/sendPushNotification";

export default function NotificationScreen() {
  const { expoPushToken, notification } = usePushNotifications();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Your Expo Push Token:</Text>
      <Text selectable>{expoPushToken}</Text>

      {notification && (
        <View style={{ marginTop: 20 }}>
          <Text>Title: {notification.request.content.title}</Text>
          <Text>Body: {notification.request.content.body}</Text>
        </View>
      )}

      <Button
        title="Send Notification"
        onPress={() => sendPushNotification(expoPushToken)}
      />
    </View>
  );
}
