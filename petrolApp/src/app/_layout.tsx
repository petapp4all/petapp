import * as Updates from "expo-updates";
import { useEffect, useState, useCallback } from "react";
import { Alert, Button, Platform, SafeAreaView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../components/utils/utils";
import { Stack, useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import "./global.css";
import { registerForPushNotificationsAsync } from "../components/usePushNotifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const router = useRouter();
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await Asset.loadAsync(
        require("../../assets/images/futuristic_petrol_station_splantom.png")
      );
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Check for updates on mount
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setIsUpdateAvailable(true);
          Alert.alert(
            "Update Available",
            "A new update is available. Download now?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Download",
                onPress: async () => {
                  await Updates.fetchUpdateAsync();
                  setIsUpdatePending(true);
                },
              },
            ]
          );
        }
      } catch (e) {
        console.error("Error checking for updates:", e);
      }
    };

    checkForUpdates();
  }, []);

  useEffect(() => {
    const initNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        console.log("Push token received but not sent:", token);
        if (token) {
          await AsyncStorage.setItem("expoPushToken", token);
        }
      } catch (error) {
        console.error("Push notification setup failed:", error);
      }
    };

    initNotifications();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response?.notification?.request?.content?.data?.screen;
        console.log("🔔 Notification clicked. Navigating to:", screen);

        if (screen) {
          // Add a slight delay to ensure navigation context is ready
          setTimeout(
            () => {
              router.push(screen);
            },
            Platform.OS === "android" ? 500 : 0
          );
        }
      }
    );

    return () => subscription.remove();
  }, []);

  // Apply update when ready
  useEffect(() => {
    if (isUpdatePending) {
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen
                  name="users-screen"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="admin-screen"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="users" options={{ headerShown: false }} />
                <Stack.Screen name="admin" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="index"
                  options={{ title: "Home", headerShown: false }}
                />
              </Stack>

              {/* Visible fallback update button */}
              {isUpdateAvailable && !isUpdatePending && (
                <View style={{ padding: 10 }}>
                  <Button
                    title="Download Update"
                    onPress={async () => {
                      await Updates.fetchUpdateAsync();
                      setIsUpdatePending(true);
                    }}
                  />
                </View>
              )}

              <StatusBar style="dark" />
            </View>
          </SafeAreaView>
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
