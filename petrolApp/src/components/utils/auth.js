import { apiUrl } from "./utils.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = async (userData) => {
  const response = await fetch(`${apiUrl}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${apiUrl}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    await AsyncStorage.setItem("userDetails", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("userDetails");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
export const sendExpoPushToken = async (expoPushToken) => {
  try {
    const userData = await AsyncStorage.getItem("userDetails");
    const parsedUser = JSON.parse(userData);

    if (!parsedUser?.id) {
      throw new Error("User ID not found");
    }

    const response = await fetch(`${apiUrl}/users/push-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: parsedUser.id,
        expoPushToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send push token");
    }

    return data;
  } catch (error) {
    console.error("Error sending push token:", error);
    throw error;
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

export const deleteUser = async (email, password) => {
  try {
    const userDetails = await AsyncStorage.getItem("userDetails");
    if (!userDetails) {
      throw new Error("User details not found. Please log in again.");
    }

    const { id } = JSON.parse(userDetails);

    const response = await fetch(`${apiUrl}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete account");
    }

    await AsyncStorage.removeItem("userDetails");
    return data;
  } catch (error) {
    console.error("Error deleting account:", error.message);
    throw error;
  }
};

// ✅ Function to Update User Details
export const updateUser = async (updatedData) => {
  try {
    const token = await AsyncStorage.getItem("");
    const userDetails = await AsyncStorage.getItem("userDetails");

    if (!userDetails) {
      throw new Error("User details not found. Please log in again.");
    }
    const { id } = JSON.parse(userDetails);

    const response = await fetch(`${apiUrl}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update user details");
    }

    // Update the user details in AsyncStorage
    await AsyncStorage.setItem("userDetails", JSON.stringify(data));

    return data;
  } catch (error) {
    console.error("Error updating user details:", error.message);
    throw error;
  }
};
