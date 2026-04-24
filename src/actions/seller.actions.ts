"use server";

import { cookies }   from "next/headers";
import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function authedFetch(path: string, options: RequestInit = {}) {
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
  if (!res.ok) return { error: json.message || "Failed" };
  return { data: json.data };
}

export async function applyForSellerAction(data: {
  idCardUrl: string;
  profilePhotoUrl: string;
}) {
  const result = await authedFetch("/seller/apply", {
    method: "POST",
    body:   JSON.stringify(data),
  });
  if (!result.error) revalidatePath("/seller/apply");
  return result;
}

export async function getApplicationStatusAction() {
  return authedFetch("/seller/application-status");
}

export async function createListingAction(data: Record<string, unknown>) {
  const result = await authedFetch("/listings", {
    method: "POST",
    body:   JSON.stringify(data),
  });
  if (!result.error) revalidatePath("/seller/listings");
  return result;
}

export async function updateListingAction(id: string, data: Record<string, unknown>) {
  const result = await authedFetch(`/listings/${id}`, {
    method: "PUT",
    body:   JSON.stringify(data),
  });
  if (!result.error) revalidatePath("/seller/listings");
  return result;
}

export async function deleteListingAction(id: string) {
  const result = await authedFetch(`/listings/${id}`, { method: "DELETE" });
  if (!result.error) revalidatePath("/seller/listings");
  return result;
}

export async function getMyListingsAction(page = 1, limit = 20) {
  return authedFetch(`/listings/seller/mine?page=${page}&limit=${limit}`);
}
