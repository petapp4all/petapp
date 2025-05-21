import { Stack } from "expo-router";

export default function BudgetStack() {
  return (
    <Stack>
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
      <Stack.Screen
        name="sign-in"
        options={{
          title: " Sign In",
          headerTitleAlign: "center",
          headerShown: false,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: "Create an Account",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack>
  );
}
