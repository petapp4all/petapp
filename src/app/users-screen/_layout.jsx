import { Stack } from "expo-router";

const screens = [
  { name: "about", title: "About" },
  { name: "contact", title: "Contact Support" },
  { name: "FullArticle", title: "Full Article" },
  { name: "privacy", title: "Privacy & Policy" },
  { name: "terms", title: "Terms & Condition" },
  { name: "user-details", title: "Edit User Details" },
  { name: "delete-account", title: "Delete Account" },
  { name: "advert", title: "Adverts" },
  { name: "create-ads", title: "Create Your Advert" },
  { name: "AdvertDetails", title: "Advert Details" },
  { name: "webview", title: "Make Payment" },
  { name: "ArticleDetails", title: "Article Details" },
];

export default function Layout() {
  return (
    <Stack>
      {screens.map(({ name, title }) => (
        <Stack.Screen
          key={name}
          name={name}
          options={{
            title,
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      ))}
    </Stack>
  );
}
