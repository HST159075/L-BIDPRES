"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { API_URL } from "@/config/constants";

interface Message {
  role: "user" | "model";
  content: string;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Hi! I'm your BidBD assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/ai/chat`, {
        message: userMessage,
        history: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        }))
      });

      const aiText = response.data?.data?.response || "Sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: "model", content: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "model", content: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-bid-500 text-white shadow-lg flex items-center justify-center transition-opacity",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-[400px] h-[500px] bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-bid-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">BidBD AI Assistant</h3>
                  <p className="text-[10px] text-white/80">Online & ready to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex items-start gap-2", m.role === "user" ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                    m.role === "user" ? "bg-bid-500" : "bg-muted"
                  )}>
                    {m.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-bid-500" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm",
                    m.role === "user" ? "bg-bid-500 text-white rounded-tr-none" : "bg-muted text-foreground rounded-tl-none"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-bid-500" />
                  </div>
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-bid-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="w-full pl-4 pr-12 py-3 bg-muted border-none rounded-2xl text-sm focus:ring-2 focus:ring-bid-500 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1.5 w-9 h-9 bg-bid-500 text-white rounded-xl flex items-center justify-center hover:bg-bid-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
