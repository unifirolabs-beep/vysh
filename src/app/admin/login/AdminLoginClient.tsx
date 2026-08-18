"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { VyshLogo } from "@/components/common/VyshLogo";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginAdmin } from "@/actions/admin.actions";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export function AdminLoginClient() {
  const router = useRouter();
  const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(adminLoginSchema), defaultValues: { email: "", password: "" } })

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: z.infer<typeof adminLoginSchema>) => {
    try {
      const res = await loginAdmin (data.email, data.password);
      if(res.success){
        toast.success("Admin logged in successfully", {id: "admin-login"});
        router.push("/admin");
      }else{
        toast.error(res.message, {id: "admin-login"});
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {id: "admin-login"});
    }
  }

  return (
    <div className="min-h-screen w-full bg-[url('/admin-bg.jpg')] bg-cover bg-center bg-no-repeat relative flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden selection:bg-[#5C061D] selection:text-[#D4AF37]">
      
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/40 pointer-events-none" />

      {/* Main Container Split (Matches admin login page design.jpg Exactly) */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center z-10">
        
        {/* LEFT HERO PANEL */}
        <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
          {/* Logo */}
          <div className="flex justify-center lg:justify-start">
            <VyshLogo variant="gold" size="xl" href="/" />
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-4 pt-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4D68B] via-[#D4AF37] to-[#C9A227] font-serif font-bold block mt-1">
                Vysh Admin
              </span>
            </h1>

            {/* Diamond Ornament */}
            <div className="flex items-center justify-center lg:justify-start gap-2 py-1 text-[#D4AF37]">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span>✦</span>
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>

            <p className="text-sm sm:text-base text-white/90 font-sans leading-relaxed max-w-md mx-auto lg:mx-0 drop-shadow-md">
              Manage your store, orders, products, banners, offers & everything from one place.
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN CARD (Matches 1st Image Design Exactly) */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="bg-[#24040E]/85 backdrop-blur-md border border-[#D4AF37]/40 rounded-3xl p-7 sm:p-10 shadow-2xl space-y-5 text-white max-w-md w-full relative">
            
            {/* Top Shield Lock Badge */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#7A0A28] to-[#4A0417] border-2 border-[#D4AF37] flex items-center justify-center mx-auto shadow-xl shadow-[#5C061D]/50">
                <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                  Admin Login
                </h2>
                <p className="text-xs text-white/70 mt-0.5">
                  Secure access to your Vysh store
                </p>
              </div>

              {/* Gold Ornament Divider */}
              <div className="flex items-center justify-center gap-2 text-[#D4AF37] text-xs pt-1">
                <span className="h-[1px] w-16 bg-[#D4AF37]/40" />
                <span>✦</span>
                <span className="h-[1px] w-16 bg-[#D4AF37]/40" />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    {...register("email")}
                    placeholder="admin@vysh.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#160408]/90 border border-[#7A0A28] rounded-xl text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                  {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    {...register("password")}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-3 bg-[#160408]/90 border border-[#7A0A28] rounded-xl text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  />
                  {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-end text-xs pt-1">

                <button
                  type="button"
                  onClick={() => toast.info("Password reset link sent to admin@vysh.com")}
                  className="text-[#D4AF37] hover:underline cursor-pointer font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button (Gold Metallic Gradient) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F4D68B] to-[#C9A227] text-[#160408] font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl hover:opacity-95 transition-opacity shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-[#160408]" />
                  <span>{isSubmitting ? "Logging in..." : "LOGIN SECURELY"}</span>
                </button>
              </div>
            </form>

            {/* Footer Enterprise Security Badge */}
            <div className="pt-3 border-t border-white/10 text-center space-y-2">
              <div className="flex items-center justify-center gap-3 text-white/40 text-xs">
                <span className="h-[1px] flex-1 bg-white/10" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                  Admin Access Only
                </span>
                <span className="h-[1px] flex-1 bg-white/10" />
              </div>

              <p className="text-[11px] text-white/70 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Your data is protected with enterprise grade security</span>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
