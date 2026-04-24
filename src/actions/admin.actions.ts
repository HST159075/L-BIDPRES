"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function adminFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  
  // Amader manual 'session' cookie ebong better-auth er token duto-i check kora bhalo
  const sessionToken = 
    cookieStore.get("session")?.value || 
    cookieStore.get("better-auth.session_token")?.value ||
    cookieStore.get("__Secure-better-auth.session_token")?.value;

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // Backend jodi Bearer token expect kore, tobe Authorization header best
      ...(sessionToken ? { "Authorization": `Bearer ${sessionToken}` } : {}),
      // Jodi backend Cookie header expect kore, tobe nichetao thakte pare:
      // ...(sessionToken ? { "Cookie": `session=${sessionToken}` } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  // Response check
  if (!res.ok) {
    // Try-catch use kora hoyeche jate res.json() fail korle crash na kore
    const errorData = await res.json().catch(() => ({}));
    return { error: errorData.message || "Failed to fetch data" };
  }

  const json = await res.json();
  return { data: json.data };
}

export async function getAnalyticsAction() {
  return adminFetch("/admin/analytics");
}

export async function getUsersAction(page = 1, search?: string) {
  const params = new URLSearchParams({ 
    page: String(page), 
    ...(search ? { search } : {}) 
  });
  return adminFetch(`/users?${params}`);
}

export async function getPendingApplicationsAction(page = 1) {
  return adminFetch(`/admin/seller-applications?page=${page}`);
}

export async function approveApplicationAction(id: string) {
  const result = await adminFetch(`/seller/applications/${id}/approve`, { method: "PUT" });
  if (!result.error) revalidatePath("/applications");
  return result;
}

export async function rejectApplicationAction(id: string, reason: string) {
  const result = await adminFetch(`/applications/${id}/reject`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  });
  if (!result.error) revalidatePath("/applications");
  return result;
}

export async function addStrikeAction(userId: string, reason: string, description?: string) {
  const result = await adminFetch(`/users/${userId}/strike`, {
    method: "PUT",
    body: JSON.stringify({ reason, description }),
  });
  if (!result.error) revalidatePath("/users");
  return result;
}

export async function banUserAction(userId: string, reason: string) {
  const result = await adminFetch(`/users/${userId}/ban`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  });
  if (!result.error) revalidatePath("/users");
  return result;
}

export async function unbanUserAction(userId: string) {
  const result = await adminFetch(`/users/${userId}/unban`, { method: "PUT" });
  if (!result.error) revalidatePath("/users");
  return result;
}