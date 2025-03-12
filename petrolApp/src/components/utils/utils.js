import Constants from "expo-constants";
import { QueryClient } from "@tanstack/react-query";

const isDevelopment = __DEV__;
const extra = Constants.expoConfig?.extra || Constants.manifest?.extra || {};

export const apiUrl = isDevelopment
  ? extra.apiUrlDevelopment || "http://localhost:8000/api"
  : extra.apiUrlProduction || "https://petrol-auth.vercel.app/api";

export const queryClient = new QueryClient();

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
