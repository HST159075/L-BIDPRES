export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export const PLATFORM_COMMISSION = 0.15;

export const CATEGORIES = [
  { value: "electronics", labelEn: "Electronics", labelBn: "ইলেকট্রনিক্স" },
  { value: "fashion", labelEn: "Fashion", labelBn: "ফ্যাশন" },
  { value: "home", labelEn: "Home", labelBn: "হোম" },
  { value: "vehicle", labelEn: "Vehicle", labelBn: "যানবাহন" },
  { value: "sports", labelEn: "Sports", labelBn: "স্পোর্টস" },
  { value: "books", labelEn: "Books", labelBn: "বই" },
  { value: "other", labelEn: "Other", labelBn: "অন্যান্য" },
] as const;

export const CONDITIONS = [
  { value: "new", labelEn: "New", labelBn: "নতুন" },
  { value: "used", labelEn: "Used", labelBn: "পুরানো" },
  { value: "refurbished", labelEn: "Refurbished", labelBn: "রিফার্বিশড" },
] as const;

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  auctions: "/auctions",
  auction: (id: string) => `/auctions/${id}`,
  buyerDashboard: "/bdashboard",
  buyerBids: "/bids",
  buyerProfile: "/profile",
  sellerDashboard: "/sdashboard",
  sellerListings: "/slistings",
  sellerNewListing: "/slistings/new",
  sellerApply: "/sapply",
  adminDashboard: "/dashboard",
  adminUsers: "/users",
  adminApplications: "/applications",
  paymentSuccess: "/payment/success",
  paymentFailed: "/payment/failed",
} as const;
