import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="about"
        options={{
          title: "About",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="contact"
        options={{
          title: "Contact Support",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: "Privacy & Policy",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="terms"
        options={{
          title: "Terms & Condition",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="user-details"
        options={{
          title: "Edit User Details",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="delete-account"
        options={{
          title: "Delete Account",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: "bold",
          },
        }}
      />
    </Stack>
  );
}
