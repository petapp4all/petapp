import { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { apiUrl } from "../../components/utils/utils";

const ForgetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleForgetPassword = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        Alert.alert("Success", "Check your email for the reset code.");
        navigation.navigate("ResetPassword", { resetToken: data.resetToken });
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
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderBottomWidth: 1,
          marginBottom: 20,
          backgroundColor: "white",
        }}
      />
      <Button title="Send Reset Code" onPress={handleForgetPassword} />
    </View>
  );
};

export default ForgetPasswordScreen;
