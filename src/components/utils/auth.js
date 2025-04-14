import { apiUrl } from "./utils.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

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
    await linkPushTokenToUser();
    return data;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${apiUrl}/users/${userId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user");
    }
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const deleteUserById = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete account");
    }
    return data;
  } catch (error) {
    console.error("Error deleting account:", error.message);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${apiUrl}/users`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }

    return data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const getAllUsersSummary = async () => {
  try {
    const response = await fetch(`${apiUrl}/users/summary`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }

    return data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const linkPushTokenToUser = async () => {
  try {
    const token = await AsyncStorage.getItem("expoPushToken");
    const userData = await AsyncStorage.getItem("userDetails");
    const parsedUser = JSON.parse(userData);

    if (token && parsedUser?.id) {
      await sendExpoPushToken(token);
    }
  } catch (error) {
    console.error("Error linking push token to user:", error);
  }
};

export const sendExpoPushToken = async (expoPushToken) => {
  try {
    const userData = await AsyncStorage.getItem("userDetails");
    const parsedUser = JSON.parse(userData);

    if (!parsedUser?.id) {
      throw new Error("User ID not found");
    }
    const response = await axios.post(`${apiUrl}/users/push-token`, {
      userId: parsedUser.id,
      expoPushToken,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error sending push token:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const sendNotificationToUser = async ({
  recipientId,
  title,
  body,
  data = {},
}) => {
  try {
    const response = await fetch(`${apiUrl}/users/send-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId, title, body, data }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to send notification");
    }

    return result;
  } catch (error) {
    console.error("Notification Error:", error);
    throw error;
  }
};

export const sendNotificationToManyUsers = async ({
  title,
  body,
  data = {},
}) => {
  try {
    const response = await fetch(`${apiUrl}/users/send-notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, data }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to send notification to all users"
      );
    }

    return result;
  } catch (error) {
    console.error("Notification Error:", error);
    throw error;
  }
};

export const sendImportantEmail = async ({ email, subject, message }) => {
  try {
    const response = await fetch(`${apiUrl}/users/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, subject, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Error sending email:", error.message);
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

    const response = await fetch(`${apiUrl}/details/users/${id}`, {
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

export const blockUser = async (id) => {
  try {
    if (!id) {
      throw new Error("User ID is required.");
    }

    const response = await axios.put(`${apiUrl}/users/${id}/block`);

    if (response.status !== 200) {
      throw new Error(response.data.message || "Failed to block user.");
    }

    return response.data;
  } catch (error) {
    console.error("Error blocking user:", error.message);
    throw error;
  }
};

export const unblockUser = async (id) => {
  try {
    if (!id) {
      throw new Error("User ID is required.");
    }

    const response = await axios.put(`${apiUrl}/users/${id}/unblock`);

    if (response.status !== 200) {
      throw new Error(response.data.message || "Failed to unblock user.");
    }

    return response.data;
  } catch (error) {
    console.error("Error unblocking user:", error.message);
    throw error;
  }
};
