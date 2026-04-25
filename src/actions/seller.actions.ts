"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function authedFetch(path: string, options: RequestInit = {}) {
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
      // Backend standard JWT ba Manual Session Token expect korle Authorization header best
      ...(sessionToken ? { "Authorization": `Bearer ${sessionToken}` } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  // Response JSON parse korar somoy error handling (safety-r jonno)
  const json = await res.json().catch(() => ({}));
  
  if (!res.ok) return { error: json.message || "Failed" };
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
  // Folder structure onujayi 'sapply' path revalidate kora holo
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
    // Dashboard analytics ebong Listing list duto-i update hobe
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
  return authedFetch(`/listings/seller/mine?page=${page}&limit=${limit}`);
}