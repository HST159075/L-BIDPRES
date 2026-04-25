"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function adminFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  
  // 'session' cookie priority ditte hobe, tarpor better-auth check hobe
  const sessionToken = 
    cookieStore.get("session")?.value || 
    cookieStore.get("better-auth.session_token")?.value ||
    cookieStore.get("__Secure-better-auth.session_token")?.value;

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // Backend JWT expect korle Authorization header-e Bearer token thaka dorkar
      ...(sessionToken ? { "Authorization": `Bearer ${sessionToken}` } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  // Response check and safe JSON parsing
  if (!res.ok) {
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
  return adminFetch(`/admin/users?${params}`); // API path admin prefix thaka bhalo
}

export async function getPendingApplicationsAction(page = 1) {
  return adminFetch(`/admin/seller-applications?page=${page}`);
}

export async function approveApplicationAction(id: string) {
  const result = await adminFetch(`/admin/applications/${id}/approve`, { method: "PUT" });
  if (!result.error) {
    // Apnar structure onujayi application page revalidate hobe
    revalidatePath("/admin/applications");
    revalidatePath("/admin/dashboard"); // Analytics update korar jonno
  }
  return result;
}

export async function rejectApplicationAction(id: string, reason: string) {
  const result = await adminFetch(`/admin/applications/${id}/reject`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  });
  if (!result.error) {
    revalidatePath("/admin/applications");
  }
  return result;
}

export async function addStrikeAction(userId: string, reason: string, description?: string) {
  const result = await adminFetch(`/admin/users/${userId}/strike`, {
    method: "PUT",
    body: JSON.stringify({ reason, description }),
  });
  if (!result.error) {
    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");
  }
  return result;
}

export async function banUserAction(userId: string, reason: string) {
  const result = await adminFetch(`/admin/users/${userId}/ban`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  });
  if (!result.error) {
    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");
  }
  return result;
}

export async function unbanUserAction(userId: string) {
  const result = await adminFetch(`/admin/users/${userId}/unban`, { method: "PUT" });
  if (!result.error) {
    revalidatePath("/admin/users");
  }
  return result;
}