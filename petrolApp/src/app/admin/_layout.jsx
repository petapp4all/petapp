import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Keyboard, Platform, useColorScheme } from "react-native";

import { Colors } from "@/src/constants/Colors";
import { useEffect, useState } from "react";

const TabBarIcon = ({ name, color, type = "FontAwesome" }) => {
  const IconComponent = type === "FontAwesome5" ? FontAwesome5 : FontAwesome;
  return (
    <IconComponent
      name={name}
      size={26}
      style={{ marginBottom: 3 }}
      color={color}
    />
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          height: 55,
          position: Platform.OS === "ios" ? "absolute" : "relative",
          display: isKeyboardVisible ? "none" : "flex",
        },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="tachometer-alt"
              color={color}
              type="FontAwesome5"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="users" color={color} type="FontAwesome5" />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="bell" color={color} type="FontAwesome5" />
          ),
        }}
      />
    </Tabs>
  );
}
