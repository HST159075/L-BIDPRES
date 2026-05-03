"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES }   from "@/config/constants";

const API = process.env.NEXT_PUBLIC_API_URL || "https://s-bidpres.onrender.com/api/v1";

async function serverFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("bidpress.session_token") || 
                         cookieStore.get("__Secure-bidpress.session_token") ||
                         cookieStore.get("session");

    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(sessionCookie ? { Cookie: `${sessionCookie.name}=${sessionCookie.value}` } : {}),
        ...(sessionCookie ? { Authorization: `Bearer ${sessionCookie.value}` } : {}),
        ...options.headers,
      },
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok) return { error: json.message || "Request failed" };
    return { data: json.data };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export async function registerAction(formData: {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}) {
  return serverFetch("/auth/register", {
    method: "POST",
    body:   JSON.stringify(formData),
  });
}

export async function sendOTPAction(data: {
  email?: string;
  phone?: string;
  type: "email" | "phone";
}) {
  return serverFetch("/auth/send-otp", {
    method: "POST",
    body:   JSON.stringify(data),
  });
}

export async function verifyOTPAction(data: {
  email?: string;
  phone?: string;
  code: string;
  type: "email" | "phone";
}) {
  return serverFetch("/auth/verify-otp", {
    method: "POST",
    body:   JSON.stringify(data),
  });
}

export async function loginAction(data: {
  identifier: string;
  password: string;
}) {
  return serverFetch("/auth/login", {
    method: "POST",
    body:   JSON.stringify(data),
  });
}

export async function getMeAction() {
  return serverFetch("/auth/me");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("bidpress.session_token");
  cookieStore.delete("__Secure-bidpress.session_token");
  cookieStore.delete("session");
  cookieStore.delete("user-role");
  redirect(ROUTES.login);
}
