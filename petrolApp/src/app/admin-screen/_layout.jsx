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
      <Stack.Screen
        name="station"
        options={{
          title: "Stations",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="SingleStation"
        options={{
          title: "Station Details",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          title: "Orders",
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
