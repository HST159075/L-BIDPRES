"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_URL || "https://s-bidpres.onrender.com/api/v1";

async function adminFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get("bidpress.session_token")?.value ||
    cookieStore.get("__Secure-bidpress.session_token")?.value ||
    cookieStore.get("session")?.value;

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return { error: errorData.message || "Failed to fetch data" };
  }
  const json = await res.json();
  return { data: json };
}

export async function getAnalyticsAction() {
  return adminFetch("/admin/analytics");
}


export async function getUsersAction(page = 1, search?: string) {
  const params = new URLSearchParams({
    page: String(page),
    ...(search ? { search } : {}),
  });
  return adminFetch(`/admin/users?${params}`);
}

export async function getPendingApplicationsAction(page = 1) {
  return adminFetch(`/admin/seller-applications?page=${page}`);
}

export async function approveApplicationAction(id: string) {
  const result = await adminFetch(`/admin/seller-applications/${id}/approve`, { method: "PUT" });
  if (!result.error) {
    revalidatePath("/applications");
    revalidatePath("/dashboard");
  }
  return result;
}

export async function rejectApplicationAction(id: string, reason: string) {
  const result = await adminFetch(`/admin/seller-applications/${id}/reject`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  });
  if (!result.error) revalidatePath("/applications");
  return result;
}

export async function addStrikeAction(userId: string, reason: string, description?: string) {
  const result = await adminFetch(`/admin/users/${userId}/strike`, {
    method: "PUT",
    body: JSON.stringify({ 
      reason: "admin_manual",  
      description: description || reason,
    }),
  });
  if (!result.error) {
    revalidatePath("/users");
    revalidatePath("/dashboard");
  }
  return result;
}

export async function banUserAction(userId: string, reason: string) {
  const result = await adminFetch(`/admin/users/${userId}/ban`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  });
  if (!result.error) {
    revalidatePath("/users");
    revalidatePath("/dashboard");
  }
  return result;
}

export async function unbanUserAction(userId: string) {
  const result = await adminFetch(`/admin/users/${userId}/unban`, { method: "PUT" });
  if (!result.error) revalidatePath("/users");
  return result;
}