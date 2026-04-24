import api from "@/lib/api";

export const paymentService = {
  initiate: (data: { bidId: string; gateway: "sslcommerz" | "bkash" }) =>
    api.post<{ data: { paymentUrl: string; paymentId: string } }>("/payments/initiate", data),

  confirmDelivery: (auctionId: string) =>
    api.post("/payments/confirm-delivery", { auctionId }),

  getHistory: () =>
    api.get("/payments/history"),
};
