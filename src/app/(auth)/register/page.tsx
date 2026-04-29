"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { OTPInput } from "@/components/common/OTPInput";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { showError, showSuccess } from "@/lib/error-handler";
import { ROUTES } from "@/config/constants";

// ✅ শুধু email — phone বাদ
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number"),
});

type RegisterForm = z.infer<typeof registerSchema>;
type Step = "form" | "otp" | "done";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [step, setStep] = useState<Step>("form");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      await authService.sendOTP({ email: data.email, type: "email" });
      showSuccess("OTP sent! Please verify.");
      setStep("otp");
    } catch (err) {
      showError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    setOtpError("");
    setIsLoading(true);
    const data = form.getValues();
    try {
      await authService.verifyOTP({
        email: data.email,
        code: otp,
        type: "email",
      });
      const user = await authService.getMe();
      setUser(user);
      setStep("done");
      setTimeout(() => router.push(ROUTES.buyerDashboard), 1500);
    } catch {
      setOtpError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const data = form.getValues();
    try {
      await authService.sendOTP({ email: data.email, type: "email" });
      showSuccess("OTP resent!");
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <div className="w-9 h-9 bg-bid-500 rounded-xl flex items-center justify-center">
            <Gavel className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">
            Bid<span className="text-bid-500">BD</span>
          </span>
        </Link>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold">Create account</h1>
                <p className="text-muted-foreground mt-1">
                  Join BidBD and start bidding
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    {...form.register("name")}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-bid-500 transition-all"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    {...form.register("email")}
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-bid-500 transition-all"
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <input
                      {...form.register("password")}
                      type={showPass ? "text" : "password"}
                      placeholder="Min 8 chars, uppercase & number"
                      className="w-full px-4 py-3 pr-11 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-bid-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-bid-500 hover:bg-bid-600 text-white font-bold rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href={ROUTES.login} className="text-bid-500 font-medium hover:underline">
                    Login
                  </Link>
                </p>
              </form>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold">Verify OTP</h1>
                <p className="text-muted-foreground mt-1">
                  Enter the code sent to <strong>{form.watch("email")}</strong>
                </p>
              </div>
              <OTPInput value={otp} onChange={setOtp} error={otpError} />
              <button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || isLoading}
                className="w-full py-3.5 bg-bid-500 hover:bg-bid-600 text-white font-bold rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? "Verifying..." : "Verify & Continue"}
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => setStep("form")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Back
                </button>
                <button
                  onClick={handleResendOTP}
                  className="text-bid-500 hover:underline"
                >
                  Resend OTP
                </button>
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-8"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold">You&apos;re all set!</h2>
              <p className="text-muted-foreground">
                Redirecting to your dashboard...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}