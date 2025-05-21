import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";

const ReusableInput = ({
  icon,
  label,
  value,
  onChangeText,
  isPassword = false,
  keyboardType = "default",
  fontFamily,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const labelAnim = useState(new Animated.Value(value ? 1 : 0))[0];

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  return (
    <View style={[styles.inputContainer, isFocused && styles.focusedBorder]}>
      {/* Left Icon */}
      {fontFamily === "FontAwesome5" ? (
        <FontAwesome5
          name={icon}
          size={20}
          color={isFocused ? "#0072FF" : "#666"}
          style={styles.icon}
        />
      ) : (
        <FontAwesome
          name={icon}
          size={20}
          color={isFocused ? "#0072FF" : "#666"}
          style={styles.icon}
        />
      )}

      {/* Input & Label Container */}
      <View style={styles.inputWrapper}>
        {/* Floating Label */}
        <Animated.Text
          style={[
            styles.label,
            {
              top: labelAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [13, -8],
              }),
              fontSize: labelAnim.interpolate({
                inputRange: [0, 2],
                outputRange: [18, 8],
              }),
              color: isFocused ? "#0072FF" : "#999",
            },
          ]}
        >
          {label}
        </Animated.Text>

        {/* Input Field */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          style={styles.input}
          placeholder={isFocused && !value ? label : ""}
          placeholderTextColor="#999"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {/* Toggle Password Visibility */}
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color={isFocused ? "#0072FF" : "#666"}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",

    // borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 40,
    height: 50,
  },
  focusedBorder: {
    borderColor: "#0072FF",
    borderWidth: 1,
  },
  inputWrapper: {
    flex: 1,
    position: "relative",
    height: 50,
    justifyContent: "center",
  },

  input: {
    color: "#000",
    fontSize: 18,
    height: 40,
    paddingLeft: 2,
    marginTop: 3,
  },
  label: {
    position: "absolute",
    left: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  icon: {
    marginRight: 10,
  },
});

export default ReusableInput;
