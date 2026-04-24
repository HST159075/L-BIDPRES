import api, { extractData } from "@/lib/api";
import type { User, ApiResponse } from "@/types";

export const authService = {
  register: (data: {
    name: string;
    email?: string;
    phone?: string;
    password: string;
  }) => api.post<ApiResponse<{ id: string }>>("/auth/register", data),

  sendOTP: (data: {
    email?: string;
    phone?: string;
    type: "email" | "phone";
  }) => api.post("/auth/send-otp", data),

  verifyOTP: (data: {
    email?: string;
    phone?: string;
    code: string;
    type: "email" | "phone";
  }) => api.post("/auth/verify-otp", data),

  login: (data: { identifier: string; password: string }) =>
    api.post<ApiResponse<{ id: string; role: string }>>("/auth/login", data),

  logout: () => api.post("/auth/logout"),

  getMe: () => api.get<ApiResponse<User>>("/auth/me").then(extractData<User>),

  forgotPassword: (data: {
    email?: string;
    phone?: string;
    type: "email" | "phone";
  }) => api.post("/auth/forgot-password", data),

  resetPassword: (data: {
    email?: string;
    phone?: string;
    code: string;
    newPassword: string;
  }) => api.post("/auth/reset-password", data),
};
