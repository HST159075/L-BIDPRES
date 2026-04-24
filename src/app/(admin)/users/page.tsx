"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, AlertTriangle, Shield, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { useRequireAuth } from "@/hooks/useAuth";
import {
  getUsersAction,
  addStrikeAction,
  banUserAction,
  unbanUserAction,
} from "@/actions/admin.actions";
import { showSuccess, showError } from "@/lib/error-handler";

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  purchaseCount: number;
  strikeCount: number;
  isBanned: boolean;
}

export default function AdminUsersPage() {
  const { user: adminUser, isLoading: authLoading } = useRequireAuth("admin");
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsersAction(1, search)
      .then((res) => setUsers((res.data as { data: User[] }).data || []))
      .catch(() => setUsers([]))
      .finally(() => setUsersLoading(false));
  }, [search]);

  const handleAddStrike = async (userId: string) => {
    try {
      await addStrikeAction(userId, "violation", "Admin strike");
      showSuccess("Strike added");
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, strikeCount: u.strikeCount + 1 } : u,
        ),
      );
    } catch (err) {
      showError(err);
    }
  };

  const handleBan = async (userId: string) => {
    try {
      await banUserAction(userId, "Admin decision");
      showSuccess("User banned");
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, isBanned: true } : u)),
      );
    } catch (err) {
      showError(err);
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      await unbanUserAction(userId);
      showSuccess("User unbanned");
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, isBanned: false } : u)),
      );
    } catch (err) {
      showError(err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-bid-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal className="mt-8 mb-6">
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage users, strikes, and bans
            </p>
          </ScrollReveal>

          {/* Search */}
          <ScrollReveal className="mb-6">
            <input
              type="search"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bid-500"
            />
          </ScrollReveal>

          {/* Users Table */}
          <ScrollReveal>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">
                        User
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Purchases
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Strikes
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersLoading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-muted-foreground"
                        >
                          Loading users...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-8 text-center text-muted-foreground"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <motion.tr
                          key={u.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-6 py-3">
                            <div>
                              <p className="font-medium">{u.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {u.email || u.phone}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <span className="text-xs capitalize px-2 py-1 rounded-full bg-muted">
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-3">{u.purchaseCount}</td>
                          <td className="px-6 py-3">
                            <span
                              className={`font-semibold ${u.strikeCount > 0 ? "text-red-500" : "text-green-500"}`}
                            >
                              {u.strikeCount}/3
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            {u.isBanned ? (
                              <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full font-medium">
                                🚫 Banned
                              </span>
                            ) : (
                              <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full font-medium">
                                ✓ Active
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3 space-x-2 flex">
                            {!u.isBanned && (
                              <button
                                onClick={() => handleAddStrike(u.id)}
                                className="text-xs px-2 py-1 rounded border border-red-500/30 text-red-600 hover:bg-red-500/10 transition-colors flex items-center gap-1"
                              >
                                <AlertTriangle className="w-3 h-3" /> Strike
                              </button>
                            )}
                            {!u.isBanned ? (
                              <button
                                onClick={() => handleBan(u.id)}
                                className="text-xs px-2 py-1 rounded border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Ban
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnban(u.id)}
                                className="text-xs px-2 py-1 rounded border border-green-500/30 text-green-600 hover:bg-green-500/10 transition-colors flex items-center gap-1"
                              >
                                <Shield className="w-3 h-3" /> Unban
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </SmoothScroll>
  );
}
