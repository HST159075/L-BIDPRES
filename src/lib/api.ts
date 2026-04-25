import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { API_URL } from "@/config/constants";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "bid_auth_token";

// ── Token helpers ─────────────────────────────────────────────
function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage;
  } catch {
    return null;
  }
}
export function setAuthToken(token: string | null) {
  const storage = getStorage();
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    storage?.setItem(TOKEN_KEY, token);
    // Middleware-er jonno cookie-te save korun (7 days expiry)
    Cookies.set("session", token, { expires: 7, path: '/' }); 
  } else {
    delete api.defaults.headers.common["Authorization"];
    storage?.removeItem(TOKEN_KEY);
    Cookies.remove("session");
  }
}


export function loadStoredToken(): string | null {
  const storage = getStorage();
  const token = storage?.getItem(TOKEN_KEY) || null;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  return token;
}

export function getStoredToken(): string | null {
  return getStorage()?.getItem(TOKEN_KEY) || null;
}

// ── Request interceptor ───────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ──────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message: string }>) => {
    const message = error.response?.data?.message || "Something went wrong";
    const status = error.response?.status;

    if (status === 401) {
      setAuthToken(null);
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    } else if (status === 403) {
      toast.error("Access denied");
    } else if (status === 429) {
      toast.error("Too many requests. Please wait.");
    } else if (status && status >= 500) {
      toast.error("Server error. Please try again.");
    }

    return Promise.reject({ message, status });
  },
);



export const extractData = <T>(response: AxiosResponse): T =>
  response.data.data as T;

export const extractPaginated = <T>(response: AxiosResponse) => {
  // তোমার ব্যাকেন্ড sendPaginated ফাংশন সরাসরি response.data-তে data, total ইত্যাদি পাঠায়
  return {
    data: (response.data?.data || []) as T[],
    total: response.data?.total || 0,
    page: response.data?.page || 1,
    limit: response.data?.limit || 20,
  };
};

if (typeof window !== "undefined") {
  loadStoredToken();
}

export default api;