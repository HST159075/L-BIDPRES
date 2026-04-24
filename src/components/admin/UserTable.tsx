"use client";

import { useState }              from "react";
import { motion }                from "framer-motion";
import { AlertTriangle, Shield, Trash2 } from "lucide-react";
import { ConfirmDialog }         from "@/components/common/ConfirmDialog";
import { formatTimeAgo }         from "@/lib/utils";
import type { User }             from "@/types";

interface UserTableProps {
  users:         User[];
  isLoading?:    boolean;
  onAddStrike:   (userId: string) => Promise<void>;
  onBan:         (userId: string) => Promise<void>;
  onUnban:       (userId: string) => Promise<void>;
}

export function UserTable({ users, isLoading, onAddStrike, onBan, onUnban }: UserTableProps) {
  const [confirm, setConfirm] = useState<{
    open:    boolean;
    action?: "strike" | "ban" | "unban";
    userId?: string;
    name?:   string;
  }>({ open: false });
  const [actionLoading, setActionLoading] = useState(false);

  const openConfirm = (action: "strike" | "ban" | "unban", userId: string, name: string) => {
    setConfirm({ open: true, action, userId, name });
  };

  const handleConfirm = async () => {
    if (!confirm.userId || !confirm.action) return;
    setActionLoading(true);
    try {
      if (confirm.action === "strike") await onAddStrike(confirm.userId);
      if (confirm.action === "ban")    await onBan(confirm.userId);
      if (confirm.action === "unban")  await onUnban(confirm.userId);
    } finally {
      setActionLoading(false);
      setConfirm({ open: false });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1,2,3,4,5].map((i) => (
          <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No users found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">User</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Role</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Purchases</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Strikes</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Joined</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {users.map((u, i) => (
              <motion.tr
                key={u.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bid-500/10 text-bid-500 font-bold flex items-center justify-center text-xs shrink-0">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email || u.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                    u.role === "admin"  ? "bg-purple-500/10 text-purple-600" :
                    u.role === "seller" ? "bg-blue-500/10 text-blue-600"     :
                                         "bg-muted text-muted-foreground"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 font-medium">{u.purchaseCount}</td>
                <td className="px-5 py-3">
                  <span className={`font-bold ${
                    u.strikeCount === 0 ? "text-green-600" :
                    u.strikeCount === 1 ? "text-yellow-600" :
                    u.strikeCount === 2 ? "text-orange-600" : "text-red-600"
                  }`}>
                    {u.strikeCount}/3
                  </span>
                </td>
                <td className="px-5 py-3">
                  {u.isBanned ? (
                    <span className="text-xs bg-red-500/10 text-red-600 px-2.5 py-1 rounded-full font-medium">
                      🚫 Banned
                    </span>
                  ) : (
                    <span className="text-xs bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full font-medium">
                      ✓ Active
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-muted-foreground text-xs">
                  {formatTimeAgo(u.createdAt)}
                </td>
                <td className="px-5 py-3">
                  {u.role !== "admin" && (
                    <div className="flex items-center gap-1.5">
                      {!u.isBanned && (
                        <button
                          onClick={() => openConfirm("strike", u.id, u.name)}
                          className="p-1.5 rounded-lg border border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10 transition-colors"
                          title="Add Strike"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {u.isBanned ? (
                        <button
                          onClick={() => openConfirm("unban", u.id, u.name)}
                          className="p-1.5 rounded-lg border border-green-500/30 text-green-600 hover:bg-green-500/10 transition-colors"
                          title="Unban"
                        >
                          <Shield className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => openConfirm("ban", u.id, u.name)}
                          className="p-1.5 rounded-lg border border-red-500/30 text-red-600 hover:bg-red-500/10 transition-colors"
                          title="Ban"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={confirm.open}
        title={
          confirm.action === "strike" ? "Add Strike"    :
          confirm.action === "ban"    ? "Ban User"      : "Unban User"
        }
        description={
          confirm.action === "strike"
            ? `Add a strike to ${confirm.name}? At 3 strikes they will be auto-banned.`
            : confirm.action === "ban"
            ? `Permanently ban ${confirm.name}? They won't be able to use the platform.`
            : `Unban ${confirm.name}? They will regain access to the platform.`
        }
        variant={confirm.action === "unban" ? "default" : "danger"}
        confirmText={
          confirm.action === "strike" ? "Add Strike" :
          confirm.action === "ban"    ? "Ban User"   : "Unban User"
        }
        onConfirm={handleConfirm}
        onCancel={() => setConfirm({ open: false })}
        isLoading={actionLoading}
      />
    </>
  );
}
