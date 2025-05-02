import { apiUrl } from "./utils.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const createAd = async (newAd) => {
  try {
    const { data } = await axios.post(`${apiUrl}/users/create-ad`, { newAd });
    return data;
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};

export const getAllAds = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/users/get-ads`);
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
    const { data } = await axios.get(`${apiUrl}/users/ads-count/${id}`);
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
    const { data } = await axios.post(`${apiUrl}/users/mark-ads-seen/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};

export const getSingleAd = async (id) => {
  try {
    const { data } = await axios.get(`${apiUrl}/users/get-ad/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};

export const sendPin = async (email, pinValidity) => {
  try {
    const { data } = await axios.post(`${apiUrl}/users/send-pin`, {
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
    const { data } = await axios.post(`${apiUrl}/users/confirm-pin`, {
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
    const { data } = await axios.post(`${apiUrl}/users/pricing`, {
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
    const { data } = await axios.get(`${apiUrl}/users/price/get`);
    return data;
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};

export const deleteAd = async (id) => {
  try {
    await axios.delete(`${apiUrl}/users/delete-ad/${id}`);
  } catch (error) {
    console.error("Error fetch ads:", error.message);
    throw error;
  }
};
