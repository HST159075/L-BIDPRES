"use client";

import { useState }              from "react";
import Image                     from "next/image";
import { motion }                from "framer-motion";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { ConfirmDialog }         from "@/components/common/ConfirmDialog";
import { formatTimeAgo }         from "@/lib/utils";

interface Application {
  id:              string;
  userId:          string;
  status:          string;
  idCardUrl:       string;
  profilePhotoUrl: string;
  user?:           { name: string; email?: string; phone?: string };
  createdAt:       string;
}

interface ApplicationCardProps {
  application:  Application;
  onApprove:    (id: string) => Promise<void>;
  onReject:     (id: string, reason: string) => Promise<void>;
}

export function ApplicationCard({ application, onApprove, onReject }: ApplicationCardProps) {
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [rejectOpen,     setRejectOpen]     = useState(false);
  const [rejectReason,   setRejectReason]   = useState("");
  const [isLoading,      setIsLoading]      = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try { await onApprove(application.id); }
    finally { setIsLoading(false); setConfirmApprove(false); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setIsLoading(true);
    try { await onReject(application.id, rejectReason); }
    finally { setIsLoading(false); setRejectOpen(false); setRejectReason(""); }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-5 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{application.user?.name || "Unknown"}</p>
            <p className="text-xs text-muted-foreground">{application.user?.email || application.user?.phone}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(application.createdAt)}
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">ID Card</p>
            <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-muted">
              <Image src={application.idCardUrl} alt="ID" fill className="object-cover" sizes="200px" />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Profile Photo</p>
            <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-muted">
              <Image src={application.profilePhotoUrl} alt="Profile" fill className="object-cover" sizes="200px" />
            </div>
          </div>
        </div>

        {/* Actions */}
        {application.status === "pending" && (
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setConfirmApprove(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <CheckCircle className="w-4 h-4" /> Approve
            </button>
            <button
              onClick={() => setRejectOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </div>
        )}
      </motion.div>

      {/* Approve confirm */}
      <ConfirmDialog
        open={confirmApprove}
        title="Approve Application"
        description={`Approve ${application.user?.name}'s seller application? They will receive seller privileges.`}
        variant="default"
        confirmText="Approve"
        onConfirm={handleApprove}
        onCancel={() => setConfirmApprove(false)}
        isLoading={isLoading}
      />

      {/* Reject with reason */}
      {rejectOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setRejectOpen(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm space-y-4"
          >
            <h3 className="font-semibold">Reject Application</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={3}
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bid-500 resize-none"
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectOpen(false)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-accent">
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || isLoading}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isLoading ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
