"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_URL || "https://s-bidpres.onrender.com/api/v1";

async function authedFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("bidpress.session_token")?.value ||
    cookieStore.get("__Secure-bidpress.session_token")?.value ||
    cookieStore.get("session")?.value;

  if (!token) {
    console.error(`[authedFetch] No token found for: ${path}`);
    return { error: "Not authenticated" };
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error(`[authedFetch] ${res.status} on ${path}:`, json);
    return { error: json.message || `HTTP ${res.status}` };
  }

  return { data: json };
}

// ── Seller application ─────────────────────────────────────────
export async function applyForSellerAction(data: {
  idCardUrl: string;
  profilePhotoUrl: string;
}) {
  const result = await authedFetch("/seller/apply", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!result.error) revalidatePath("/sapply");
  return result;
}

export async function getApplicationStatusAction() {
  return authedFetch("/seller/application-status");
}

export async function getMyListingsAction(page = 1, limit = 20) {
  return authedFetch(`/listings/seller/mine?page=${page}&limit=${limit}`);
}

export async function createListingAction(data: Record<string, unknown>) {
  const result = await authedFetch("/listings", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!result.error) {
    revalidatePath("/slistings");
    revalidatePath("/sdashboard");
  }
  return result;
}

// ── Update & Delete (Server Action রাখা হয়েছে revalidatePath এর জন্য) ──
export async function updateListingAction(
  id: string,
  data: Record<string, unknown>,
) {
  const result = await authedFetch(`/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!result.error) revalidatePath("/slistings");
  return result;
}

export async function deleteListingAction(id: string) {
  const result = await authedFetch(`/listings/${id}`, { method: "DELETE" });
  if (!result.error) {
    revalidatePath("/slistings");
    revalidatePath("/sdashboard");
  }
  return result;
}
