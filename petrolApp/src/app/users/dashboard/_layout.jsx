import React, { useState } from "react";
import { View, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import { Stack } from "expo-router";
import { ThemedText } from "@/src/components/ThemedText";
import Sidebar from "@/src/components/userSidebar";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;
const EDGE_ZONE = 20; // Only allow swipes from the leftmost 20 pixels

export default function MenuLayout({ navigation }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onSwipe = ({ nativeEvent }) => {
    if (
      nativeEvent.state === State.END && // Trigger only when swipe ends
      nativeEvent.translationX > 50 // Ensure it moves right at least 50 pixels
    ) {
      setIsSidebarOpen(true);
    }
  };

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
            headerLeft: () => (
              <TapGestureHandler
                onHandlerStateChange={() => setIsSidebarOpen(true)}
              >
                <Pressable>
                  <Image
                    source={require("@/assets/images/admin.jpg")}
                    style={styles.profileImage}
                  />
                </Pressable>
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
            //   <Pressable>
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
    // flexDirection: "row",
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
    width: EDGE_ZONE,
    zIndex: 10,
  },
  touchableArea: {
    flex: 1, // Fill the gesture area
  },
});
