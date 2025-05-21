import React, { useCallback, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, useFocusEffect } from "expo-router";
import { ThemedText } from "@/src/components/ThemedText";
import Sidebar from "@/src/components/adminSidebar";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserById } from "../../../components/utils/users";

const EDGE_ZONE = 20; // Only allow swipes from the leftmost 20 pixels

export default function MenuLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const onSwipe = ({ nativeEvent }) => {
    if (
      nativeEvent.state === State.END && // Trigger only when swipe ends
      nativeEvent.translationX > 50 // Ensure it moves right at least 50 pixels
    ) {
      setIsSidebarOpen(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const userData = await AsyncStorage.getItem("userDetails");
          const parsedUser = JSON.parse(userData);
          const user = await getUserById(parsedUser.id);
          if (user) {
            setUser(user || null);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchUser();
    }, [])
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Left Edge Gesture Area */}
      <View style={styles.gestureArea}>
        <PanGestureHandler onHandlerStateChange={onSwipe}>
          <View style={styles.touchableArea} />
        </PanGestureHandler>
      </View>

      <View style={styles.container}>
        <Stack
          screenOptions={{
            // headerStyle: { backgroundColor: "blue", height: 90 },
            headerLeft: () => (
              <TapGestureHandler
                onHandlerStateChange={() => setIsSidebarOpen((prev) => !prev)}
              >
                <TouchableOpacity>
                  <Image
                    source={
                      user?.image
                        ? { uri: user.image } // Use network image
                        : require("@/assets/images/admin.jpg") // Fallback
                    }
                    className="w-[50px] h-[50px] rounded-full"
                  />
                </TouchableOpacity>
              </TapGestureHandler>
            ),
            headerTitle: () => (
              <View style={styles.titleContainer}>
                <ThemedText style={styles.titleText}>
                  Splantom Petrol
                </ThemedText>
              </View>
            ),
            // headerRight: () => (
            //   <Pressable onPress={() => setIsSidebarOpen((prev) => !prev)}>
            //     {({ pressed }) => (
            //       <FontAwesome
            //         name="bell"
            //         size={25}
            //         color={Colors.light.tint}
            //         style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            //       />
            //     )}
            //   </Pressable>
            // ),
          }}
        />

        {/* Sidebar Component */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // width: "100%",
    marginRight: 50,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  gestureArea: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: EDGE_ZONE, // Only the leftmost 20 pixels
    zIndex: 10, // Ensure it is above the scrollable content
  },
  touchableArea: {
    flex: 1, // Fill the gesture area
  },
});
