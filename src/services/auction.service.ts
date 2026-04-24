import api, { extractData, extractPaginated } from "@/lib/api";
import type { Auction, Listing, AuctionFilter, ApiResponse } from "@/types";

export const auctionService = {
  getAll: (filter: AuctionFilter = {}) =>
    api.get("/auctions", { params: filter }).then(extractPaginated<Auction>),

  getOne: (id: string) =>
    api.get<ApiResponse<Auction>>(`/auctions/${id}`).then(extractData<Auction>),

  getBids: (id: string, page = 1, limit = 20) =>
    api
      .get(`/auctions/${id}/bids`, { params: { page, limit } })
      .then(extractPaginated),

  getListings: (filter: AuctionFilter = {}) =>
    api.get("/listings", { params: filter }).then(extractPaginated<Listing>),

  getOneListing: (id: string) =>
    api.get<ApiResponse<Listing>>(`/listings/${id}`).then(extractData<Listing>),
};
