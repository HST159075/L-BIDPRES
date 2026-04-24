"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES }   from "@/config/constants";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function serverFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("better-auth.session_token");

    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(sessionCookie ? { Cookie: `better-auth.session_token=${sessionCookie.value}` } : {}),
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
  cookieStore.delete("better-auth.session_token");
  redirect(ROUTES.login);
}
