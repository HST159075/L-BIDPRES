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
      // ✅ ৪00 এরর ফিক্স করতে সরাসরি websocket ব্যবহার করা হয়েছে
      transports: ["websocket"], 
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10, // রেন্ডার সার্ভার স্লিপ মোড থেকে জাগতে সময় নিতে পারে
    });

    // ডিবাগিং লগার (প্রয়োজন না হলে রিমুভ করতে পারেন)
    socket.on("connect", () => console.log("✅ Socket Connected"));
    socket.on("connect_error", (err) => console.error("❌ Socket Error:", err.message));
  }
  return socket;
}

export function connectSocket(token?: string) {
  const s = getSocket();
  
  // ✅ ব্যাকেন্ডের auth.api.getSession লজিকের জন্য টোকেন সেট করা
  if (token) {
    s.auth = { token };
  }
  
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    // ✅ রিসেট করা হয়েছে যাতে পরে নতুন টোকেন দিয়ে কানেক্ট করা যায়
    socket = null; 
  }
}

// ── Auction room helpers ──────────────────────────────
export function joinAuction(auctionId: string) {
  const s = getSocket();
  if (s.connected) {
    s.emit("join:auction", { auctionId });
  } else {
    // কানেক্ট হওয়ার সাথে সাথে অটোমেটিক জয়েন হবে
    s.once("connect", () => s.emit("join:auction", { auctionId }));
    s.connect();
  }
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
  const s = getSocket();
  s.on("bid:new", cb);
  return () => s.off("bid:new", cb);
}

export function onBidOutbid(cb: (data: BidOutbidEvent) => void) {
  const s = getSocket();
  s.on("bid:outbid", cb);
  return () => s.off("bid:outbid", cb);
}

export function onAuctionEnded(cb: (data: AuctionEndedEvent) => void) {
  const s = getSocket();
  s.on("auction:ended", cb);
  return () => s.off("auction:ended", cb);
}

export function onAuctionCountdown(cb: (data: AuctionCountdownEvent) => void) {
  const s = getSocket();
  s.on("auction:countdown", cb);
  return () => s.off("auction:countdown", cb);
}

export function onAuctionLive(cb: (data: { auctionId: string }) => void) {
  const s = getSocket();
  s.on("auction:live", cb);
  return () => s.off("auction:live", cb);
}