import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { Alert } from "react-native";
import { sendPin } from "../../components/utils/ads";

const WebViewScreen = () => {
  const { url, email, pinValidity } = useLocalSearchParams();

  const handleSendEmail = async () => {
    if (!email) return Alert.alert("Validation", "User email not available.");
    try {
      await sendPin(email, pinValidity);
      Alert.alert("Success", "PIN successfully sent to your email!");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send email.");
    }
  };
  const router = useRouter();

  const handleNavigationChange = async (navState) => {
    const currentUrl = navState.url;
    console.log("Navigated to:", currentUrl);

    if (currentUrl.includes("payment-complete")) {
      Alert.alert("Success", "Payment Successful!");
      await handleSendEmail();
      router.back();
    } else if (currentUrl.includes("payment-cancel")) {
      Alert.alert("Cancelled", "Payment Cancelled.");
      router.back();
    } else if (
      currentUrl.includes("paystack.com/close") ||
      currentUrl.includes("paystack.com/close.html")
    ) {
      Alert.alert("Closed", "Payment window closed");
      router.back();
    }
  };

  if (!url) {
    return null;
  }

  return (
    <WebView
      source={{ uri: decodeURIComponent(url) }}
      onNavigationStateChange={handleNavigationChange}
      javaScriptEnabled={true}
      startInLoadingState
      style={{ flex: 1 }}
    />
  );
};

export default WebViewScreen;
