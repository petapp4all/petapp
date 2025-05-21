import { apiUrl } from "./utils.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const createAd = async (newAd) => {
  try {
    const { data } = await axios.post(`${apiUrl}/ads/create-ad`, newAd);
    return data;
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};

export const getAllAds = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/ads/get-ads`);
    return data;
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};

export const addCount = async () => {
  try {
    const userDetails = await AsyncStorage.getItem("userDetails");
    const { id } = JSON.parse(userDetails);
    const { data } = await axios.get(`${apiUrl}/ads/ads-count/${id}`);
    return data.count;
  } catch (error) {
    console.error("Error fetch addCount:", error.message);
    throw error;
  }
};

export const markAdsAsSeen = async () => {
  try {
    const userDetails = await AsyncStorage.getItem("userDetails");
    const { id } = JSON.parse(userDetails);
    const { data } = await axios.post(`${apiUrl}/ads/mark-ads-seen/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};

export const getSingleAd = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/ads/get-ad/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};

export const sendPin = async (email, pinValidity) => {
  try {
    const { data } = await axios.post(`${apiUrl}/ads/send-pin`, {
      email,
      pinValidity,
    });
    return data;
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};

export const confirmPin = async (email, advertPin) => {
  try {
    const { data } = await axios.post(`${apiUrl}/ads/confirm-pin`, {
      email,
      advertPin,
    });
    return data;
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};

export const postPricing = async (duration, amount) => {
  try {
    const { data } = await axios.post(`${apiUrl}/ads/pricing`, {
      duration,
      amount,
    });
    return data;
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};
export const getPricing = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/ads/price/get`);
    return data;
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};

export const deleteAd = async (id) => {
  try {
    await axios.delete(`${apiUrl}/ads/delete-ad/${id}`);
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};

export const getStations = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/station`);
    return data;
  } catch (error) {
    console.error("Error fetch station:", error.message);
    throw error;
  }
};

export const getStationById = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/station/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch station:", error.message);
    throw error;
  }
};

export const deleteStation = async (id) => {
  try {
    const { data } = await axios.delete(`${apiUrl}/station/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch station:", error.message);
    throw error;
  }
};

export const getStationDetails = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/station/details/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch station:", error.message);
    throw error;
  }
};

export const getStationByOwner = async () => {
  try {
    const userData = await AsyncStorage.getItem("userDetails");
    const { id } = JSON.parse(userData);
    const { data } = await axios.get(`${apiUrl}/station/by-owner/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch station:", error.message);
    throw error;
  }
};

export const createOrder = async (orderDetails) => {
  try {
    const { data } = await axios.post(`${apiUrl}/order/create`, orderDetails);
    return data;
  } catch (error) {
    console.error("Error createOrder:", error.message);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/order/all-orders`);
    return data;
  } catch (error) {
    console.error("Error getting orders:", error.message);
    throw error;
  }
};

export const getOrdersByOwnerID = async () => {
  try {
    const userData = await AsyncStorage.getItem("userDetails");
    const { id } = JSON.parse(userData);
    const { data } = await axios.get(`${apiUrl}/order/all-orders`, {
      params: {
        ownerId: id,
      },
    });
    return data;
  } catch (error) {
    console.error("Error getting orders:", error.message);
    throw error;
  }
};

export const getOrdersByUserID = async () => {
  try {
    const userData = await AsyncStorage.getItem("userDetails");
    const { id } = JSON.parse(userData);
    const { data } = await axios.get(`${apiUrl}/order/all-orders`, {
      params: {
        userId: id,
      },
    });
    return data;
  } catch (error) {
    console.error("Error getting orders:", error.message);
    throw error;
  }
};

export const markOrdersAsCompleted = async (id) => {
  try {
    const { data } = await axios.put(`${apiUrl}/order/${id}/complete`);
    return data;
  } catch (error) {
    console.error("Error getting orders:", error.message);
    throw error;
  }
};

export const createReview = async (content, rating) => {
  const userData = await AsyncStorage.getItem("userDetails");
  const { id } = JSON.parse(userData);
  try {
    const { data } = await axios.post(`${apiUrl}/order/create-review`, {
      userId: id,
      content,
      rating,
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getAllReviews = async () => {
  const { data } = await axios.get(`${apiUrl}/order/get-review`);
  return data;
};
