import Constants from "expo-constants";
import { QueryClient } from "@tanstack/react-query";

const isDevelopment = __DEV__;
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};

export const apiUrl = isDevelopment
  ? extra.apiUrlDevelopment || "http://localhost:8000/api"
  : extra.apiUrlProduction || "https://petapp-black.vercel.app/api";

export const queryClient = new QueryClient();

const API_KEY = "87d978790ca385ed78570a66";

export const getConversionRates = async () => {
  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/NGN`
    );
    const data = await res.json();
    if (data && data.conversion_rates) {
      return data.conversion_rates;
    }
    throw new Error("Failed to fetch exchange rates.");
  } catch (error) {
    console.error("Currency Conversion Error:", error);
    return null;
  }
};
