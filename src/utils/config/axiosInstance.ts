// src/utils/config/axiosInstance.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: import("axios").InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem("acmec.api_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token from AsyncStorage:", error);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.clear();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
