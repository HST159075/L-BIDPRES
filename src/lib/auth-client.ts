import { createAuthClient } from "better-auth/react";
import { APP_URL } from "@/config/constants";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:5000",
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
