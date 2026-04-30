// ─── User ─────────────────────────────────────────────
export type UserRole = "buyer" | "seller" | "admin";

export interface User {
  id:            string;
  name:          string;
  email?:        string | null;
  phone?:        string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role:          UserRole;
  avatar?:       string | null;
  purchaseCount: number;
  strikeCount:   number;
  isBanned:      boolean;
  createdAt:     string;
}

// ─── Auth ─────────────────────────────────────────────
export interface AuthResponse {
  success: boolean;
  message: string;
  data: { id: string; role?: UserRole };
}

// ─── Listing ──────────────────────────────────────────
export type ProductCategory =
  | "electronics" | "fashion" | "home"
  | "vehicle"     | "sports"  | "books" | "other";

export type ProductCondition = "new" | "used" | "refurbished";
export type ListingStatus    = "draft" | "active" | "ended" | "cancelled";

export interface Listing {
  id:           string;
  sellerId:     string;
  seller:       Pick<User, "name" | "avatar">;
  status:       ListingStatus;
  title:        string;
  description:  string;
  category:     ProductCategory;
  condition?:   ProductCondition;
  brand?:       string;
  photos:       string[];
  videoUrl:     string;
  location:     string;
  shippingCost: number;
  auction?:     Auction;
  createdAt:    string;
}

// ─── Auction ──────────────────────────────────────────
export type AuctionStatus = "scheduled" | "live" | "ended" | "cancelled";

export interface Auction {
  id:            string;
  listingId:     string;
  listing?:      Listing;
  status:        AuctionStatus;
  startingPrice: number;
  bidIncrement:  number;
  currentPrice:  number;
  startTime:     string;
  endTime:       string;
  winnerId?:     string | null;
  finalPrice?:   number | null;
  bids?:         Bid[];
  createdAt:     string;
}

// ─── Bid ──────────────────────────────────────────────
export type BidStatus = "active" | "outbid" | "won" | "refunded";

export interface Bid {
  id:        string;
  auctionId: string;
  bidderId:  string;
  bidder:    Pick<User, "name" | "avatar">;
  status:    BidStatus;
  amount:    number;
  isAutoBid: boolean;
  maxAmount?: number;
  createdAt: string;
}

// ─── Payment ──────────────────────────────────────────
export type PaymentGateway = "sslcommerz" | "bkash";
export type PaymentStatus  = "pending" | "held" | "released" | "refunded" | "failed";

export interface Payment {
  id:           string;
  bidId:        string;
  userId:       string;
  status:       PaymentStatus;
  gateway:      PaymentGateway;
  totalAmount:  number;
  platformFee:  number;
  sellerAmount: number;
  paidAt?:      string;
  releasedAt?:  string;
  createdAt:    string;
}

// ─── Seller Application ───────────────────────────────
export type SellerApplicationStatus = "pending" | "approved" | "rejected";

export interface SellerApplication {
  id:              string;
  userId:          string;
  status:          SellerApplicationStatus;
  idCardUrl:       string;
  profilePhotoUrl: string;
  rejectionReason?: string;
  createdAt:       string;
}

// ─── Notification ─────────────────────────────────────
export interface Notification {
  id:        string;
  userId:    string;
  type:      string;
  title:     string;
  message:   string;
  isRead:    boolean;
  data?:     Record<string, unknown>;
  createdAt: string;
}

// ─── API ──────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data:    T[];
  pagination: {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
    hasNext:    boolean;
    hasPrev:    boolean;
  };
}

// ─── Socket Events ────────────────────────────────────
export interface BidNewEvent {
  bidderId: string;
  amount:   number;
  time:     string;
}

export interface BidOutbidEvent {
  newAmount: number;
  auctionId: string;
}

export interface AuctionEndedEvent {
  winnerId:   string | null;
  finalPrice: number;
}

export interface AuctionCountdownEvent {
  secondsLeft: number;
}

// ─── Filter ───────────────────────────────────────────
export interface AuctionFilter {
  category?:  string;
  condition?: string;
  minPrice?:  number;
  maxPrice?:  number;
  search?:    string;
  location?:  string;
  sortBy?:    string;
  sortOrder?: "asc" | "desc";
  page?:      number;
  limit?:     number;
}
