"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { VyshLogo } from "@/components/common/VyshLogo";
import { Phone, CheckCircle2, Loader2, Sparkles, X, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authStep,
    setAuthStep,
    loginWithPhone,
    verifyOtpAndLogin,
    userPhone,
  } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [notifyOffers, setNotifyOffers] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginWithPhone(phone);
      toast.success(`OTP sent to +91 ${phone}`);
    }, 600);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid 4-digit OTP (e.g. 1234)");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const success = verifyOtpAndLogin(otp);
      if (success) {
        toast.success("Login Successful!");
        setTimeout(() => {
          closeAuthModal();
          setPhone("");
          setOtp("");
        }, 1500);
      }
    }, 600);
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="sm:max-w-[720px] p-0 bg-white border border-[#E8D8D3] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] sm:min-h-[420px]">
          
          {/* Left Brand Panel (Matches Image 1 & 2 Left Side) */}
          <div className="md:col-span-6 bg-gradient-to-br from-[#4A0417] via-[#5C061D] to-[#3D0312] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A227]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header / Logo */}
            <div className="space-y-4">
              <VyshLogo variant="gold" size="md" />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C9A227]/20 border border-[#C9A227]/40 rounded-full text-[#C9A227] text-[10px] font-bold tracking-wider uppercase">
                <Sparkles className="w-3 h-3 text-[#C9A227]" />
                <span>Pure 925 Sterling Silver</span>
              </div>
            </div>

            {/* Brand Quote */}
            <div className="space-y-2 py-6">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#C9A227] leading-tight">
                Unlock Exclusive Silver Perks
              </h3>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                Sign in to track your royal orders, save delivery addresses, and receive hallmark authenticity benefits.
              </p>
            </div>

            {/* Trust footer */}
            <div className="flex items-center gap-2 text-[10px] text-white/70 pt-4 border-t border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              <span>100% Safe & Encrypted Login</span>
            </div>
          </div>

          {/* Right Form Panel (Matches Image 1 & Image 2 Right Side) */}
          <div className="md:col-span-6 p-6 sm:p-8 bg-white flex flex-col justify-center relative">
            
            {/* Step 1: Enter Mobile Number (Image 1) */}
            {authStep === "phone" && (
              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1D1D1D]">
                    Sign In / Register
                  </h3>
                  <p className="text-xs text-[#6E5D57] mt-1">
                    Enter your mobile number to get an OTP
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                      Mobile Number
                    </label>
                    <div className="flex items-center border border-[#E8D8D3] rounded-xl overflow-hidden focus-within:border-[#5C061D] focus-within:ring-1 focus-within:ring-[#5C061D] bg-[#FFF9F8]">
                      <span className="px-3 py-3 text-xs font-bold text-[#5C061D] border-r border-[#E8D8D3] flex items-center gap-1">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter Mobile Number"
                        className="flex-1 px-3 py-3 text-xs text-[#1D1D1D] bg-transparent focus:outline-none placeholder:text-[#888888]"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-[#6E5D57] cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={notifyOffers}
                      onChange={(e) => setNotifyOffers(e.target.checked)}
                      className="accent-[#5C061D] w-4 h-4 rounded"
                    />
                    <span>Notify me with offers & updates</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#5C061D] text-white text-xs font-bold tracking-wider uppercase rounded-xl hover:bg-[#7A0A28] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Enter OTP */}
            {authStep === "otp" && (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1D1D1D]">
                    Enter OTP Verification
                  </h3>
                  <p className="text-xs text-[#6E5D57] mt-1">
                    Sent to <strong>+91 {userPhone}</strong>{" "}
                    <button
                      type="button"
                      onClick={() => setAuthStep("phone")}
                      className="text-[#5C061D] font-bold underline ml-1 cursor-pointer"
                    >
                      Edit
                    </button>
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP (e.g. 1234)"
                    className="w-full px-4 py-3 bg-[#FFF9F8] border border-[#E8D8D3] rounded-xl text-center font-mono font-bold text-sm tracking-widest text-[#5C061D] focus:outline-none focus:border-[#5C061D]"
                  />
                  <p className="text-[10px] text-[#6E5D57] mt-1.5 text-right">
                    Didn&apos;t receive code?{" "}
                    <button
                      type="button"
                      onClick={() => toast.success("OTP Resent to your mobile number")}
                      className="text-[#5C061D] font-bold underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#5C061D] text-white text-xs font-bold tracking-wider uppercase rounded-xl hover:bg-[#7A0A28] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Verify & Continue</span>
                  )}
                </button>
              </form>
            )}

            {/* Step 3: Login Success Message (Matches Image 2) */}
            {authStep === "success" && (
              <div className="text-center py-6 space-y-4 animate-in fade-in-0 zoom-in-95">
                <div className="w-16 h-16 bg-[#5C061D]/10 rounded-full flex items-center justify-center mx-auto border border-[#5C061D]/20">
                  <CheckCircle2 className="w-10 h-10 text-[#5C061D]" />
                </div>

                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1D1D1D]">
                    Congratulations!
                  </h3>
                  <p className="text-sm font-bold text-[#5C061D] mt-1">
                    Login successful
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-[#6E5D57] pt-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#5C061D]" />
                  <span>Signing you in...</span>
                </div>
              </div>
            )}

          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};
