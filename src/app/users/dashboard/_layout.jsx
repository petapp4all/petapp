import React, { useCallback, useState } from "react";
import { View, Image, Pressable, Text } from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedText } from "@/src/components/ThemedText";
import Sidebar from "@/src/components/userSidebar";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { addCount } from "../../../components/utils/ads";

const EDGE_ZONE = 20;

export default function MenuLayout({ navigation }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [count, setCount] = useState(0);
  const router = useRouter();

  const onSwipe = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END && nativeEvent.translationX > 50) {
      setIsSidebarOpen(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const adCount = async () => {
        try {
          const data = await addCount();
          setCount(data);
        } catch (error) {
          console.log(error);
        }
      };
      adCount();
    }, [])
  );

  return (
    <GestureHandlerRootView className="flex-1">
      {/* Gesture area on the left edge */}
      <View
        className="absolute left-0 top-0 bottom-0 z-10"
        style={{ width: EDGE_ZONE }}
      >
        <PanGestureHandler onHandlerStateChange={onSwipe}>
          <View className="flex-1" />
        </PanGestureHandler>
      </View>

      <View className="flex-1 bg-white">
        <Stack
          screenOptions={{
            headerLeft: () => (
              <TapGestureHandler
                onHandlerStateChange={() => setIsSidebarOpen(true)}
              >
                <Pressable>
                  <Image
                    source={require("@/assets/images/admin.jpg")}
                    className="w-[50px] h-[50px] rounded-full"
                  />
                </Pressable>
              </TapGestureHandler>
            ),
            headerTitle: () => (
              <View className="items-center justify-center mr-[50px]">
                <Text className="text-[20px] ml-8 font-bold">
                  Splantom Petrol
                </Text>
              </View>
            ),
            headerRight: () => (
              <TapGestureHandler
                onHandlerStateChange={() => router.push("/users-screen/advert")}
              >
                <Pressable className="mr-[15px]">
                  {({ pressed }) => (
                    <View className="relative">
                      <FontAwesome
                        name="bell"
                        size={25}
                        color="blue"
                        style={{ opacity: pressed ? 0.5 : 1 }}
                      />
                      {count > 0 && (
                        <View className="absolute -top-1 -right-1 bg-red-600 rounded-full w-4 h-4 items-center justify-center">
                          <Text className="text-white text-[10px] font-bold">
                            {count}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </Pressable>
              </TapGestureHandler>
            ),
          }}
        />

        {/* Sidebar */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </View>
    </GestureHandlerRootView>
  );
}
