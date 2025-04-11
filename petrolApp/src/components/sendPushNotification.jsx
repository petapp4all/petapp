export async function sendPushNotification(expoPushToken) {
  const message = {
    to: "ExponentPushToken[5sAUAIJXSs_A46gCOLeZUB]",
    sound: "default",
    title: "Hello 👋",
    body: "This is a test notification.",
    data: { customData: "123" },
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();
    console.log("Push response:", JSON.stringify(data, null, 2)); // 👀

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Failed to send push notification"
      );
    }

    if (data?.data?.[0]?.status === "error") {
      throw new Error(data.data[0].message || "Push failed with unknown error");
    }

    return data;
  } catch (error) {
    console.error("Push notification error:", error);
    throw error;
  }
}
