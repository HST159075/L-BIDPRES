"use server";

import { cookies } from "next/headers";
import type { Auction, Listing, AuctionFilter } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL || "https://s-bidpres.onrender.com/api/v1";

async function serverFetch<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("bidpress.session_token")?.value ||
      cookieStore.get("__Secure-bidpress.session_token")?.value ||
      cookieStore.get("session")?.value;

    const res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

export async function getAuctionsAction(filter: AuctionFilter = {}) {
  const params = new URLSearchParams(
    Object.entries(filter)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  try {
    const res = await fetch(`${API}/auctions${params ? "?" + params : ""}`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return { data: [], pagination: null };
    const json = await res.json();
    return { data: json.data as Auction[], pagination: json.pagination };
  } catch {
    return { data: [], pagination: null };
  }
}

export async function getAuctionAction(id: string) {
  return serverFetch<Auction>(`/auctions/${id}`);
}

export async function getListingsAction(filter: AuctionFilter = {}) {
  const params = new URLSearchParams(
    Object.entries(filter)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  try {
    const res = await fetch(`${API}/listings${params ? "?" + params : ""}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return { data: [], pagination: null };
    const json = await res.json();
    return { data: json.data as Listing[], pagination: json.pagination };
  } catch {
    return { data: [], pagination: null };
  }
}

export async function getListingAction(id: string) {
  return serverFetch<Listing>(`/listings/${id}`);
}