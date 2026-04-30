"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

const QUICK_REPLIES = [
  "How do I place a bid?",
  "How to become a seller?",
  "Payment methods?",
  "Contact support",
];

const BOT_RESPONSES: Record<string, string> = {
  "how do i place a bid": "To place a bid:\n1. Browse our live auctions\n2. Click on any auction to view details\n3. Enter your bid amount (must be higher than current bid + increment)\n4. Click 'Place Bid' to submit\n\nYou can also use Auto-Bid to set your maximum and let us bid for you!",
  "how to become a seller": "To become a seller on BidBD:\n1. Create a buyer account first\n2. Make at least 5 successful purchases\n3. Go to Dashboard → 'Become a Seller'\n4. Submit your ID card and profile photo\n5. Wait for admin approval (usually 24-48 hours)\n\nOnce approved, you can start listing items!",
  "payment methods": "BidBD supports these payment methods:\n\n💳 SSLCommerz - Credit/Debit cards, mobile banking\n📱 bKash - Mobile wallet payment\n\nAll payments are held in escrow until delivery is confirmed, protecting both buyers and sellers.",
  "contact support": "You can reach our support team through:\n\n📧 Email: support@bidbd.com\n📞 Phone: +880 1700-000000\n💬 Live Chat: Available 24/7 on our website\n📍 Office: Dhaka, Bangladesh\n\nWe typically respond within 2-4 hours.",
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  
  for (const [key, response] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(key) || key.includes(lower)) {
      return response;
    }
  }

  if (lower.includes("bid") || lower.includes("auction")) {
    return "I can help with bidding! You can browse live auctions at our Auctions page. Each auction shows the current price, bid increment, and time remaining. Need more specific help?";
  }
  if (lower.includes("sell") || lower.includes("list")) {
    return "To sell on BidBD, you need a verified seller account. Start by making 5 purchases as a buyer, then apply through your dashboard. Want me to explain the process?";
  }
  if (lower.includes("pay") || lower.includes("money") || lower.includes("refund")) {
    return "We use secure payment processing through SSLCommerz and bKash. Payments are held in escrow until delivery confirmation. For refund queries, please contact our support team.";
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return "Hello! 👋 Welcome to BidBD! I'm here to help you with:\n\n• Bidding & Auctions\n• Seller Applications\n• Payment Questions\n• Account Issues\n\nWhat would you like to know?";
  }

  return "I'm here to help! You can ask me about:\n\n• How to place bids\n• Becoming a seller\n• Payment methods\n• Contact & support\n\nOr try one of the quick replies below!";
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Hi! 👋 I'm BidBot, your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = getBotResponse(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-bid-500)] to-orange-600 text-white shadow-2xl shadow-[var(--color-bid-500)]/30 flex items-center justify-center hover:shadow-[var(--color-bid-500)]/50 transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MessageCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-2xl animate-ping bg-[var(--color-bid-500)] opacity-20" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "520px" }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[var(--color-bid-500)] to-orange-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">BidBot AI Assistant</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[320px]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === "bot"
                      ? "bg-[var(--color-bid-500)]/10 text-[var(--color-bid-500)]"
                      : "bg-blue-500/10 text-blue-500"
                  }`}>
                    {msg.role === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-[var(--color-bid-500)] text-white rounded-tr-sm"
                      : "bg-[var(--color-muted)] rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-[var(--color-bid-500)]/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[var(--color-bid-500)]" />
                  </div>
                  <div className="px-4 py-3 bg-[var(--color-muted)] rounded-2xl rounded-tl-sm flex items-center gap-1">
                    <Loader className="w-3 h-3 animate-spin text-[var(--color-muted-foreground)]" />
                    <span className="text-xs text-[var(--color-muted-foreground)]">Thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => sendMessage(reply)}
                  className="px-3 py-1.5 bg-[var(--color-muted)] hover:bg-[var(--color-bid-500)]/10 hover:text-[var(--color-bid-500)] border border-[var(--color-border)] rounded-full text-xs font-medium transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="p-3 border-t border-[var(--color-border)] flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-4 py-2.5 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)]"
              />
              <motion.button
                type="submit"
                disabled={!input.trim()}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl bg-[var(--color-bid-500)] text-white flex items-center justify-center disabled:opacity-50 hover:bg-[var(--color-bid-600)] transition-colors"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
