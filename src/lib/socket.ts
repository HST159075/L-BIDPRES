"use client";

import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/config/constants";
import type {
  BidNewEvent,
  BidOutbidEvent,
  AuctionEndedEvent,
  AuctionCountdownEvent,
} from "@/types";

// ── Socket instance (singleton) ───────────────────────
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
  }
  return socket;
}

export function connectSocket(token?: string) {
  const s = getSocket();
  if (token) s.auth = { token };
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
}

// ── Auction room helpers ──────────────────────────────
export function joinAuction(auctionId: string) {
  getSocket().emit("join:auction", { auctionId });
}

export function leaveAuction(auctionId: string) {
  getSocket().emit("leave:auction", { auctionId });
}

export function placeBidSocket(auctionId: string, amount: number) {
  getSocket().emit("place:bid", { auctionId, amount });
}

export function setAutoBidSocket(auctionId: string, maxAmount: number) {
  getSocket().emit("set:autobid", { auctionId, maxAmount });
}

// ── Event listeners ───────────────────────────────────
export function onBidNew(cb: (data: BidNewEvent) => void) {
  getSocket().on("bid:new", cb);
  return () => getSocket().off("bid:new", cb);
}

export function onBidOutbid(cb: (data: BidOutbidEvent) => void) {
  getSocket().on("bid:outbid", cb);
  return () => getSocket().off("bid:outbid", cb);
}

export function onAuctionEnded(cb: (data: AuctionEndedEvent) => void) {
  getSocket().on("auction:ended", cb);
  return () => getSocket().off("auction:ended", cb);
}

export function onAuctionCountdown(cb: (data: AuctionCountdownEvent) => void) {
  getSocket().on("auction:countdown", cb);
  return () => getSocket().off("auction:countdown", cb);
}

export function onAuctionLive(cb: (data: { auctionId: string }) => void) {
  getSocket().on("auction:live", cb);
  return () => getSocket().off("auction:live", cb);
}
