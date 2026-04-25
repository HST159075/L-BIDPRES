"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function authedFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  
  // Apnar manual login 'session' cookie-ke priority deya hoyeche
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

  // Safe JSON parsing jate error na hoy
  const json = await res.json().catch(() => ({}));
  
  if (!res.ok) return { error: json.message || "Request failed" };
  return { data: json.data };
}

export async function applyForSellerAction(data: {
  idCardUrl: string;
  profilePhotoUrl: string;
}) {
  const result = await authedFetch("/seller/apply", {
    method: "POST",
    body: JSON.stringify(data),
  });
  // Folder structure-e folder-er nam 'sapply' tai path thik kora holo
  if (!result.error) revalidatePath("/seller/sapply");
  return result;
}

export async function getApplicationStatusAction() {
  return authedFetch("/seller/application-status");
}

export async function createListingAction(data: Record<string, unknown>) {
  const result = await authedFetch("/listings", {
    method: "POST",
    body: JSON.stringify(data),
  });
  
  if (!result.error) {
    // Apnar image-e dekhlam folder-er nam 'slistings' ebong 'sdashboard'
    // Tai ei path gulo revalidate korle data sothik bhabe update hobe
    revalidatePath("/seller/slistings");
    revalidatePath("/seller/sdashboard");
  }
  return result;
}

export async function updateListingAction(id: string, data: Record<string, unknown>) {
  const result = await authedFetch(`/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!result.error) revalidatePath("/seller/slistings");
  return result;
}

export async function deleteListingAction(id: string) {
  const result = await authedFetch(`/listings/${id}`, { method: "DELETE" });
  if (!result.error) {
    revalidatePath("/seller/slistings");
    revalidatePath("/seller/sdashboard");
  }
  return result;
}

export async function getMyListingsAction(page = 1, limit = 20) {
  // Backend standard query parameter
  return authedFetch(`/listings/seller/mine?page=${page}&limit=${limit}`);
}