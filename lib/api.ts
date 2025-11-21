"use client";

import axios from "axios";

export interface TokenBundle {
  access: string;
  refresh: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token from localStorage (client-side)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem("crm_token");
    if (raw) {
      try {
        const tokenData: TokenBundle = JSON.parse(raw);
        if (tokenData?.access) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${tokenData.access}`,
          };
        }
      } catch (e) {
        console.warn("Failed to parse token from localStorage", e);
      }
    }
  }
  return config;
});

export default api;
