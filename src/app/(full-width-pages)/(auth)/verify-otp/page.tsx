"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { axiosApiCall } from "../../../../utils/api";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const type = searchParams.get("type");
  const email = searchParams.get("email");

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Move to previous input if value is deleted
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosApiCall("/api/auth/check-otp", {
        method: "POST",
        data: {
          otp: otpString,
          token: isClient ? localStorage.getItem("otp_token") : ""
        }
      });

      if (type === "password_reset") {
        // Store reset token and redirect to reset password page
        if (isClient) {
          localStorage.setItem("reset_token", response.token);
        }
        router.push(`/reset-password?email=${encodeURIComponent(email || "")}`);
      } else {
        // Registration verification - login the user
        login(response.access_token, response.refresh_token, response.user);
        router.push("/");
      }
    } catch (err: any) {
      if (err.message?.includes('400')) {
        setError("Invalid OTP. Please try again.");
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      let endpoint = "/api/auth/forgot-password";
      if (type === "registration") {
        endpoint = "/api/auth/register";
      }

      await axiosApiCall(endpoint, {
        method: "POST",
        data: { email }
      });

      setCountdown(60);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const getTitle = () => {
    return type === 'password_reset' ? 'Reset Password' : 'Verify Email';
  };

  const getDescription = () => {
    return type === 'password_reset' 
      ? `Enter the 6-digit code sent to ${email} to reset your password.`
      : `Enter the 6-digit code sent to ${email} to verify your account.`;
  };

  // Show loading state during server-side rendering
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white text-2xl font-bold">TMS</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {getTitle()}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {getDescription()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Tangento Monitoring System
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              Didn't receive the code?
            </p>
            {countdown > 0 ? (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium text-sm"
              >
                {resendLoading ? "Sending..." : "Resend Code"}
              </button>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Resend in {countdown}s
              </p>
            )}
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link
              href={type === 'password_reset' ? '/forgot-password' : '/register'}
              className="inline-flex items-center text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
