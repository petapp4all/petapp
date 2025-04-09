export async function sendPushNotification(expoPushToken) {
  const message = {
    to: "",
    sound: "default",
    title: "Hello 👋",
    body: "This is a test notification.",
    data: { customData: "123" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
