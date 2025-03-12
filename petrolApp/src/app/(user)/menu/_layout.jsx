import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Colors } from "@/src/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import Sidebar from "@/src/components/Sidebar";
import { ThemedText } from "@/src/components/ThemedText";

export default function MenuLayout({ navigation }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Stack
        screenOptions={{
          headerLeft: () => (
            <Pressable onPress={() => setIsSidebarOpen(true)}>
              <Image
                source={require("@/assets/images/profileImage.jpeg")}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  marginLeft: 10,
                }}
              />
            </Pressable>
          ),
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <ThemedText
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Splantom Petrol
              </ThemedText>
            </View>
          ),
          headerRight: () => (
            // <Link href="/cart" asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="bell"
                  size={25}
                  color={Colors.light.tint}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
            // </Link>
          ),
        }}
      ></Stack>

      {/* Sidebar Component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </>
  );
}
