import api, { extractData, extractPaginated } from "@/lib/api";
import type { Listing, SellerApplication, ApiResponse } from "@/types";

export const sellerService = {
  apply: (data: { idCardUrl: string; profilePhotoUrl: string }) =>
    api.post("/seller/apply", data),

  getApplicationStatus: () =>
    api
      .get<ApiResponse<SellerApplication>>("/seller/application-status")
      .then(extractData<SellerApplication>),

  getMyListings: (page = 1, limit = 50) =>
    api
      .get("/listings/seller/mine", { params: { page, limit } })
      .then((res) => {
        // যদি extractPaginated কাজ না করে তবে সরাসরি ডাটা রিটার্ন করার এই লজিকটি দেখো
        return res.data; 
      }),

  createListing: (data: Record<string, unknown>) => 
    api.post("/listings", data),

  updateListing: (id: string, data: Record<string, unknown>) =>
    api.put(`/listings/${id}`, data),

  deleteListing: (id: string) => 
    api.delete(`/listings/${id}`),

  getNotifications: () => 
    api.get("/notifications").then(extractData),
};