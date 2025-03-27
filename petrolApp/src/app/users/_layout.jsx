import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Keyboard, Platform, useColorScheme } from "react-native";

import { Colors } from "@/src/constants/Colors";
import { useEffect, useState } from "react";

const TabBarIcon = ({ name, color }) => {
  return (
    <FontAwesome
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
        tabBarLabelStyle: { fontSize: 11 },
        tabBarStyle: {
          height: 55,
          position: Platform.OS === "ios" ? "absolute" : "relative",
          display: isKeyboardVisible ? "none" : "flex",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="nearbyStation"
        options={{
          title: "Nearby Sta..",
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              name="gas-pump"
              size={26}
              color={color}
              style={{ marginBottom: 3 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="marketPlace"
        options={{
          title: "Market Pla..",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="shopping-bag" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="newspaper-o" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
