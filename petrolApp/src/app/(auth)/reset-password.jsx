import { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";

const ResetPasswordScreen = ({ route, navigation }) => {
  const { resetToken } = route.params;
  const [password, setPassword] = useState("");

  const handleResetPassword = async () => {
    try {
      const response = await fetch("https://your-api.com/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password }),
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Password reset successfully.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter new password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

export default ResetPasswordScreen;
