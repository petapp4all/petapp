import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FullArticle = () => {
  const { url } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1">
      {/* Back Button */}
      {/* <TouchableOpacity onPress={() => router.back()} className="p-4">
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity> */}

      {/* WebView to Display the Article */}
      <WebView
        source={{ uri: url }}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator size="large" color="blue" />}
        injectedJavaScript={`
    const style = document.createElement('style');
    style.innerHTML = 'body, html { overflow-x: hidden; }';
    document.head.appendChild(style);
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  `}
        scalesPageToFit={false}
        bounces={false}
      />
    </View>
  );
};

export default FullArticle;
