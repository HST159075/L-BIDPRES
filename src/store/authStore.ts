import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (v: boolean) => void;
  logout: () => void;
}

// Simple store without persistence — AuthProvider handles loading from localStorage
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start as loading until AuthProvider initializes
  isInitialized: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  logout: () => set({ user: null, isInitialized: false }),
}));

// Selectors
export const selectUser = (s: AuthState) => s.user;
export const selectIsLoggedIn = (s: AuthState) => !!s.user;
export const selectRole = (s: AuthState) => s.user?.role;
export const selectIsSeller = (s: AuthState) =>
  s.user?.role === "seller" || s.user?.role === "admin";
export const selectIsAdmin = (s: AuthState) => s.user?.role === "admin";
