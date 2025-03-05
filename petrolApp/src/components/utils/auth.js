import { apiUrl } from "./utils.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = async (userData) => {
  console.log(apiUrl);
  const response = await fetch(`${apiUrl}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${apiUrl}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    console.log(data.token);
    // Store updated user details & token
    await AsyncStorage.setItem("userDetails", JSON.stringify(data));
    await AsyncStorage.setItem("userToken", data.token);

    return data; // Return user data
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("userDetails");
    await AsyncStorage.removeItem("userToken");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export const getUserDetails = async () => {
  try {
    const userDetails = await AsyncStorage.getItem("userDetails");
    return userDetails ? JSON.parse(userDetails) : null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

export const getUserToken = async () => {
  try {
    return await AsyncStorage.getItem("userToken");
  } catch (error) {
    console.error("Error fetching user token:", error);
    return null;
  }
};
