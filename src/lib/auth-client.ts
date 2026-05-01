// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  {
    baseURL:
      process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
      "https://s-bidpres.onrender.com",
  },
);

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
