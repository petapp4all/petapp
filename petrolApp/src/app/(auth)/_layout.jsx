import { Colors } from "@/src/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function BudgetStack() {
  return (
    <Stack
      screenOptions={
        {
          // headerRight: () => (
          //   <View>
          //     <FontAwesome
          //       name="edit"
          //       size={25}
          //       color={Colors.light.tint}
          //       style={{ marginRight: 10 }}
          //     />
          //   </View>
          // ),
        }
      }
    >
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: "Forgot Password",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          title: "Reset Password",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack>
  );
}
