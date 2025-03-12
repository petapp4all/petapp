import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

import { Colors } from "@/src/constants/Colors";

const TabBarIcon = ({ name, color }) => {
  return (
    <FontAwesome
      name={name}
      size={28}
      style={{ marginBottom: -3 }}
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
        tabBarStyle: { height: 60 },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="nearbyStation"
        options={{
          title: "Nearby Sta..",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="map-marker" size={28} color={color} /> // Uses FontAwesome5
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
        name="payment"
        options={{
          title: "Payment",
          tabBarIcon: ({ color }) => <TabBarIcon name="money" color={color} />,
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
    </Tabs>
  );
}
