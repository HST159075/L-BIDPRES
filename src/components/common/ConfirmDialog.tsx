"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X }        from "lucide-react";

interface ConfirmDialogProps {
  open:        boolean;
  title:       string;
  description: string;
  confirmText?: string;
  cancelText?:  string;
  variant?:    "danger" | "warning" | "default";
  onConfirm:   () => void;
  onCancel:    () => void;
  isLoading?:  boolean;
}

export function ConfirmDialog({
  open, title, description,
  confirmText = "Confirm", cancelText = "Cancel",
  variant = "danger", onConfirm, onCancel, isLoading,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onCancel}
          >
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    variant === "danger"  ? "bg-red-500/10"    :
                    variant === "warning" ? "bg-yellow-500/10" : "bg-muted"
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      variant === "danger"  ? "text-red-500"    :
                      variant === "warning" ? "text-yellow-500" : "text-foreground"
                    }`} />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                </div>
                <button onClick={onCancel} className="text-muted-foreground hover:text-foreground p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

              <div className="flex gap-3 pt-2">
                <button onClick={onCancel} disabled={isLoading}
                  className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50">
                  {cancelText}
                </button>
                <button onClick={onConfirm} disabled={isLoading}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                    variant === "danger"  ? "bg-red-500 hover:bg-red-600"       :
                    variant === "warning" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-bid-500 hover:bg-bid-600"
                  }`}>
                  {isLoading ? "Loading..." : confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
