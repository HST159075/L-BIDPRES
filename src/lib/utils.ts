import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, differenceInSeconds } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | string, currency = "৳"): string {
  return `${currency}${Number(amount).toLocaleString("bn-BD")}`;
}

export function formatPriceEn(amount: number | string): string {
  return `৳${Number(amount).toLocaleString("en-US")}`;
}

export function formatTimeAgo(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDate(date: string): string {
  return format(new Date(date), "dd MMM yyyy, hh:mm a");
}

export function getSecondsLeft(endTime: string): number {
  return Math.max(0, differenceInSeconds(new Date(endTime), new Date()));
}

export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + "..." : str;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function isAuctionLive(endTime: string, status: string): boolean {
  return status === "live" && getSecondsLeft(endTime) > 0;
}

export function getBidStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-50";
    case "outbid":
      return "text-red-600 bg-red-50";
    case "won":
      return "text-blue-600 bg-blue-50";
    case "refunded":
      return "text-gray-600 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}
