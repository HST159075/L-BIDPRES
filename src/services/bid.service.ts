import api, { extractData } from "@/lib/api";
import type { Bid, ApiResponse } from "@/types";

export const bidService = {
  placeBid: (data: {
    auctionId: string;
    amount: number;
    gateway: "sslcommerz" | "bkash";
  }) => api.post<ApiResponse<Bid>>("/bids", data).then(extractData<Bid>),

  setAutoBid: (data: {
    auctionId: string;
    maxAmount: number;
    gateway: "sslcommerz" | "bkash";
  }) => api.post("/bids/auto-bid", data),

  cancelAutoBid: (auctionId: string) =>
    api.delete(`/bids/auto-bid/${auctionId}`),

  getMyBids: (page = 1, limit = 20) =>
    api.get("/bids/my", { params: { page, limit } }),
};
