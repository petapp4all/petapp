import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
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
    </Stack>
  );
}
