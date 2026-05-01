"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Gavel, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import { OTPInput } from "@/components/common/OTPInput";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { showError, showSuccess } from "@/lib/error-handler";
import { setAuthToken } from "@/lib/api";
import { ROUTES, DEMO_CREDENTIALS } from "@/config/constants";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const DEMO_EXPIRY = new Date("2026-05-15T23:59:59");
  const isDemoActive = new Date() < DEMO_EXPIRY;

  const router = useRouter();
  const { setUser, setInitialized } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [needsOTP, setNeedsOTP] = useState(false);
  const [otpType, setOtpType] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const doLogin = async (identifier: string, password: string) => {
    // Step 1: Login
    const res = await authService.login({ identifier, password });
    const data = (
      res.data as { data?: { token?: string; id?: string; role?: string } }
    ).data;
    const token = data?.token;

    if (!token) throw new Error("No token received from server");

    // Step 2: Save token FIRST
    const roleFromData = data?.role;
    setAuthToken(token, roleFromData);

    // Step 4: Get user info
    const user = await authService.getMe();

    // Update role if user data has a more accurate one
    if (user.role && user.role !== roleFromData) {
      setAuthToken(token, user.role);
    }

    setUser(user);
    setInitialized(true);

    return user;
  };

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const user = await doLogin(data.identifier, data.password);
      showSuccess(`Welcome back, ${user.name}!`);

      // Redirect based on role
      if (user.role === "admin") {
        router.push(ROUTES.adminDashboard);
      } else if (user.role === "seller") {
        router.push(ROUTES.sellerDashboard);
      } else {
        router.push(ROUTES.buyerDashboard);
      }
    } catch (err: unknown) {
      const e = err as { status?: number };
      if (e?.status === 403) {
        const detectedType = data.identifier.includes("@") ? "email" : "phone";
        setIdentifier(data.identifier);
        setOtpType(detectedType);
        setNeedsOTP(true);
        try {
          await authService.sendOTP({
            [detectedType]: data.identifier,
            type: detectedType,
          } as Parameters<typeof authService.sendOTP>[0]);
          showSuccess(`OTP sent to ${data.identifier}`);
        } catch {
          showSuccess("Please check your email/phone for OTP.");
        }
      } else {
        showError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/callback`,
        errorCallbackURL: `${window.location.origin}/login?error=google_failed`,
      });
    } catch {
      showError("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleDemoLogin = async (role: "buyer" | "seller") => {
    const creds = DEMO_CREDENTIALS[role];
    setDemoLoading(role);
    form.setValue("identifier", creds.identifier);
    form.setValue("password", creds.password);
    try {
      const user = await doLogin(creds.identifier, creds.password);
      showSuccess(`Welcome, ${user.name}! (Demo ${role})`);
      if (user.role === "admin") router.push(ROUTES.adminDashboard);
      else if (user.role === "seller") router.push(ROUTES.sellerDashboard);
      else router.push(ROUTES.buyerDashboard);
    } catch (err) {
      showError(err);
    } finally {
      setDemoLoading(null);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    setOtpLoading(true);
    try {
      await authService.verifyOTP({
        [otpType]: identifier,
        code: otp,
        type: otpType,
      } as Parameters<typeof authService.verifyOTP>[0]);

      // After OTP verify, login again to get token
      const values = form.getValues();
      const user = await doLogin(values.identifier, values.password);
      showSuccess(`Verified! Welcome, ${user.name}!`);

      if (user.role === "admin") {
        router.push(ROUTES.adminDashboard);
      } else if (user.role === "seller") {
        router.push(ROUTES.sellerDashboard);
      } else {
        router.push(ROUTES.buyerDashboard);
      }
    } catch (err) {
      showError(err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await authService.sendOTP({
        [otpType]: identifier,
        type: otpType,
      } as Parameters<typeof authService.sendOTP>[0]);
      showSuccess("OTP resent!");
    } catch {
      showSuccess("Please check your email/phone.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex">
      {/* Left decorative */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-br from-[var(--color-bid-900)]/20 via-transparent to-transparent">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[var(--color-bid-500)]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="text-center z-10 space-y-6 px-12">
          <div className="w-20 h-20 bg-[var(--color-bid-500)] rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-[var(--color-bid-500)]/30">
            <Gavel className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black">BidBD</h2>
          <p className="text-[var(--color-muted-foreground)] text-lg max-w-sm">
            Bangladesh&apos;s premier real-time auction platform. Bid, win, and
            own amazing products.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-6 max-w-xs mx-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--color-bid-500)]">
                2.4K+
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Auctions
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--color-bid-500)]">
                18K+
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Users
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--color-bid-500)]">
                99.9%
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Uptime
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-6"
        >
          <div>
            <Link
              href={ROUTES.home}
              className="flex items-center gap-2 mb-8 lg:hidden"
            >
              <div className="w-8 h-8 bg-[var(--color-bid-500)] rounded-lg flex items-center justify-center">
                <Gavel className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">
                Bid<span className="text-[var(--color-bid-500)]">BD</span>
              </span>
            </Link>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-[var(--color-muted-foreground)] mt-1">
              Sign in to your account
            </p>
          </div>

          {needsOTP ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Enter the 6-digit code sent to <strong>{identifier}</strong>
              </p>
              <OTPInput value={otp} onChange={setOtp} />
              <button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || otpLoading}
                className="w-full py-3.5 bg-[var(--color-bid-500)] hover:bg-[var(--color-bid-600)] text-white font-bold rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {otpLoading ? "Verifying..." : "Verify OTP"}{" "}
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => setNeedsOTP(false)}
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                >
                  Back
                </button>
                <button
                  onClick={handleResendOTP}
                  className="text-[var(--color-bid-500)] hover:underline"
                >
                  Resend OTP
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Social Login Icons (Original) */}
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="p-3 bg-[var(--color-muted)] rounded-full cursor-pointer hover:bg-[var(--color-accent)] transition-all disabled:opacity-50"
                >
                  {googleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                </button>

                {/* Facebook button same থাকবে */}
                <div className="p-3 bg-[var(--color-muted)] rounded-full cursor-pointer hover:bg-[var(--color-accent)] transition-all">
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="#1877F2"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </div>
              </div>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email or Phone</label>
                  <input
                    {...form.register("identifier")}
                    type="text"
                    placeholder="email@example.com or 01XXXXXXXXX"
                    className="w-full px-4 py-3 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)] focus:border-transparent transition-all"
                  />
                  {form.formState.errors.identifier && (
                    <p className="text-xs text-[var(--color-destructive)]">
                      {form.formState.errors.identifier.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <input
                      {...form.register("password")}
                      type={showPass ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pr-11 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-bid-500)] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                    >
                      {showPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-xs text-[var(--color-destructive)]">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[var(--color-bid-500)] hover:bg-[var(--color-bid-600)] text-white font-bold rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? "Signing in..." : "Sign In"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo login buttons - Active for 2 weeks */}
              {isDemoActive && (
                <div className="space-y-2">
                  <p className="text-xs text-center text-[var(--color-muted-foreground)] font-medium">
                    Quick Demo Access
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["buyer", "seller"] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => handleDemoLogin(role)}
                        disabled={!!demoLoading}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[var(--color-muted)] hover:bg-[var(--color-bid-500)]/10 border border-[var(--color-border)] hover:border-[var(--color-bid-500)]/30 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 capitalize"
                      >
                        <Zap className="w-3 h-3 text-[var(--color-bid-500)]" />
                        {demoLoading === role ? "..." : role}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-center text-sm text-[var(--color-muted-foreground)]">
                Don&apos;t have an account?{" "}
                <Link
                  href={ROUTES.register}
                  className="text-[var(--color-bid-500)] font-medium hover:underline"
                >
                  Register
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
