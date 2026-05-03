export const API_URL =
  process.env.NODE_ENV === "production" ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1");
export const SOCKET_URL =
  process.env.NODE_ENV === "production" ? "/" : (process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000");
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export const PLATFORM_COMMISSION = 0.15;

export const CATEGORIES = [
  { value: "electronics", labelEn: "Electronics", labelBn: "ইলেকট্রনিক্স", icon: "💻" },
  { value: "fashion", labelEn: "Fashion", labelBn: "ফ্যাশন", icon: "👗" },
  { value: "home", labelEn: "Home & Living", labelBn: "হোম", icon: "🏠" },
  { value: "vehicle", labelEn: "Vehicle", labelBn: "যানবাহন", icon: "🚗" },
  { value: "sports", labelEn: "Sports & Fitness", labelBn: "স্পোর্টস", icon: "⚽" },
  { value: "books", labelEn: "Books & Media", labelBn: "বই", icon: "📚" },
  { value: "realestate", labelEn: "Real Estate", labelBn: "রিয়েল এস্টেট", icon: "🏢" },
  { value: "art", labelEn: "Art & Collectibles", labelBn: "আর্ট", icon: "🎨" },
  { value: "other", labelEn: "Other", labelBn: "অন্যান্য", icon: "📦" },
] as const;

export const CONDITIONS = [
  { value: "new", labelEn: "New", labelBn: "নতুন" },
  { value: "used", labelEn: "Used", labelBn: "পুরানো" },
  { value: "refurbished", labelEn: "Refurbished", labelBn: "রিফার্বিশড" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "ending_soon", label: "Ending Soon" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "most_bids", label: "Most Bids" },
] as const;

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  auctions: "/auctions",
  auction: (id: string) => `/auctions/${id}`,
  about: "/about",
  contact: "/contact",
  blog: "/blog",
  privacy: "/privacy",
  terms: "/terms",
  help: "/help",
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
  adminAuctions: "/auctions",
  adminReports: "/dashboard",
  adminSettings: "/dashboard",
  paymentSuccess: "/payment/success",
  paymentFailed: "/payment/failed",
} as const;

// Demo credentials for demo login
export const DEMO_CREDENTIALS = {
  buyer: { identifier: "buyer@demo.com", password: "Buyer@1234" },
  seller: { identifier: "seller@demo.com", password: "Seller@1234" },
  admin: { identifier: "hsttasin90@gmail.com", password: "Admin@1234" },
};

// Testimonials data
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Rafiq Ahmed",
    role: "Verified Buyer",
    avatar: "R",
    rating: 5,
    text: "BidBD completely changed my auction experience. I won a brand new laptop at 40% less than market price. The real-time bidding is thrilling!",
    location: "Dhaka",
  },
  {
    id: 2,
    name: "Fatema Begum",
    role: "Top Seller",
    avatar: "F",
    rating: 5,
    text: "As a seller, I love how easy it is to list products. The platform handles everything from bidding to payment. My sales increased 3x since joining!",
    location: "Chattogram",
  },
  {
    id: 3,
    name: "Kamal Hossain",
    role: "Real Estate Dealer",
    avatar: "K",
    rating: 4,
    text: "The real estate auction feature is a game-changer for Bangladesh. Transparent pricing and secure transactions make it trustworthy.",
    location: "Sylhet",
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    role: "Collector",
    avatar: "N",
    rating: 5,
    text: "I've found rare collectibles and art pieces through BidBD auctions. The verification system ensures I always get authentic items.",
    location: "Rajshahi",
  },
  {
    id: 5,
    name: "Imran Khan",
    role: "Verified Buyer",
    avatar: "I",
    rating: 5,
    text: "The auto-bid feature is brilliant! I set my maximum and let BidBD handle the rest. Won 3 auctions while I was at work!",
    location: "Khulna",
  },
  {
    id: 6,
    name: "Sumaiya Akter",
    role: "Fashion Seller",
    avatar: "S",
    rating: 4,
    text: "Great platform for fashion sellers. The auction format creates excitement and my items sell for much better prices than fixed-price listings.",
    location: "Dhaka",
  },
];

// FAQ data
export const FAQ_DATA = [
  {
    question: "How does bidding work on BidBD?",
    answer: "Simply browse live auctions, find an item you like, and place your bid. You can bid manually or set up auto-bid with your maximum amount. If you're the highest bidder when the auction ends, you win the item!",
  },
  {
    question: "Is my payment secure?",
    answer: "Absolutely! We use SSLCommerz and bKash for secure payment processing. Your payment is held in escrow until you confirm delivery of the item, protecting both buyers and sellers.",
  },
  {
    question: "How do I become a seller?",
    answer: "To become a seller, you need to make at least 5 purchases as a buyer first. Then you can apply through your dashboard by submitting your ID card and profile photo for verification.",
  },
  {
    question: "What happens if I win an auction but don't pay?",
    answer: "Winners have 48 hours to complete payment. Failure to pay results in a strike on your account. After 3 strikes, your account may be suspended.",
  },
  {
    question: "Can I cancel my bid?",
    answer: "Once placed, bids cannot be cancelled as they represent a binding commitment. Make sure you're ready to purchase before bidding.",
  },
  {
    question: "How does the auto-bid feature work?",
    answer: "Set your maximum bid amount and BidBD will automatically place the minimum winning bid on your behalf, up to your maximum. You'll be notified if you're outbid.",
  },
  {
    question: "What types of items can I sell?",
    answer: "You can sell electronics, fashion items, home goods, vehicles, sports equipment, books, real estate, art & collectibles, and more. All items must be legal and comply with our terms of service.",
  },
  {
    question: "How long does shipping take?",
    answer: "Shipping timelines depend on the seller's location and chosen courier. Sellers specify shipping costs upfront. Most items are delivered within 3-7 business days across Bangladesh.",
  },
];

// Blog data
export const BLOG_POSTS = [
  {
    id: "1",
    title: "How to Win More Auctions: Expert Tips & Strategies",
    excerpt: "Learn proven strategies from top bidders who consistently win auctions at the best prices. From timing your bids to using auto-bid effectively.",
    category: "Tips & Tricks",
    author: "BidBD Team",
    date: "2026-04-25",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    title: "The Complete Guide to Selling on BidBD",
    excerpt: "Everything you need to know about becoming a successful seller on BidBD. From listing your first item to maximizing your auction revenue.",
    category: "Seller Guide",
    author: "BidBD Team",
    date: "2026-04-20",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Real Estate Auctions: A New Era in Bangladesh",
    excerpt: "Discover how online real estate auctions are transforming the property market in Bangladesh with transparent pricing and secure transactions.",
    category: "Real Estate",
    author: "BidBD Team",
    date: "2026-04-15",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
  },
];

// Stats for animated counter
export const PLATFORM_STATS = [
  { label: "Live Auctions", value: 2400, suffix: "+", icon: "TrendingUp" },
  { label: "Active Bidders", value: 18000, suffix: "+", icon: "Users" },
  { label: "Items Sold", value: 9800, suffix: "+", icon: "ShoppingBag" },
  { label: "Verified Sellers", value: 1200, suffix: "+", icon: "Shield" },
];
