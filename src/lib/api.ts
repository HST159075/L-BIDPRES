import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { API_URL } from "@/config/constants";
import toast from "react-hot-toast";

const api: AxiosInstance = axios.create({
  baseURL:         API_URL,
  timeout:         30000,
  withCredentials: true,
  headers:         { "Content-Type": "application/json" },
});

// ── Token storage (fallback for when cookie doesn't work) ─────
let _token: string | null = null;

export function setAuthToken(token: string | null) {
  _token = token;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (typeof window !== "undefined") sessionStorage.setItem("auth_token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    if (typeof window !== "undefined") sessionStorage.removeItem("auth_token");
  }
}

export function loadStoredToken() {
  if (typeof window === "undefined") return;
  const stored = sessionStorage.getItem("auth_token");
  if (stored) setAuthToken(stored);
}

// ── Request interceptor ───────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("auth_token") : null;
    if (stored && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${stored}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message: string }>) => {
    const message = error.response?.data?.message || "Something went wrong";
    const status  = error.response?.status;

    if (status === 401) {
      setAuthToken(null);
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
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
  }
);

export default api;

export const extractData = <T>(response: AxiosResponse): T =>
  response.data.data as T;

export const extractPaginated = <T>(response: AxiosResponse) => ({
  data:       response.data.data as T[],
  pagination: response.data.pagination,
});
