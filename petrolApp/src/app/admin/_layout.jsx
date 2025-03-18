import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

import { Colors } from "@/src/constants/Colors";

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

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: { height: 55 },
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
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="shopping-cart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="chart-bar" color={color} type="FontAwesome5" />
          ),
        }}
      />
    </Tabs>
  );
}
