import api, { extractData, extractPaginated } from "@/lib/api";
import type { Listing, SellerApplication, ApiResponse } from "@/types";

export const sellerService = {
  apply: (data: { idCardUrl: string; profilePhotoUrl: string }) =>
    api.post("/seller/apply", data),

  getApplicationStatus: () =>
    api
      .get<ApiResponse<SellerApplication>>("/seller/application-status")
      .then(extractData<SellerApplication>),

getMyListings: (page = 1, limit = 20) =>
  api
    .get("/listings/seller/mine", { params: { page, limit } })
    .then(extractPaginated<Listing>),

  createListing: (data: Record<string, unknown>) => 
    api.post("/listings", data),

  updateListing: (id: string, data: Record<string, unknown>) =>
    api.put(`/listings/${id}`, data),

  deleteListing: (id: string) => 
    api.delete(`/listings/${id}`),

  getNotifications: () => 
    api.get("/notifications").then(extractData),
};