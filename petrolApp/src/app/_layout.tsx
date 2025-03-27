import { Provider } from "react-redux";
import { store } from "../redux/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { QueryClientProvider } from "@tanstack/react-query";
import { Asset } from "expo-asset";
import { queryClient } from "../components/utils/utils";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import it here
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await Asset.loadAsync(
        require("../../assets/images/futuristic_petrol_station_splantom.png")
      );
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <QueryClientProvider client={queryClient}>
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
              <StatusBar style="auto" />
            </View>
          </QueryClientProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
