"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Gavel, Eye, EyeOff, ArrowRight } from "lucide-react";
import { OTPInput } from "@/components/common/OTPInput";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { showError, showSuccess } from "@/lib/error-handler";
import { setAuthToken } from "@/lib/api";
import { ROUTES } from "@/config/constants";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setInitialized } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [needsOTP, setNeedsOTP] = useState(false);
  const [otpType, setOtpType] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

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
    setAuthToken(token);

    // Step 3: Small delay to ensure token is saved
    await new Promise((r) => setTimeout(r, 100));

    // Step 4: Get user info
    const user = await authService.getMe();
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
        <div className="text-center z-10 space-y-4 px-12">
          <div className="w-20 h-20 bg-[var(--color-bid-500)] rounded-3xl flex items-center justify-center mx-auto">
            <Gavel className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black">BidBD</h2>
          <p className="text-[var(--color-muted-foreground)] text-lg">
            Bangladesh&apos;s premier auction platform
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-8"
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

              <p className="text-center text-sm text-[var(--color-muted-foreground)]">
                Don&apos;t have an account?{" "}
                <Link
                  href={ROUTES.register}
                  className="text-[var(--color-bid-500)] font-medium hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
