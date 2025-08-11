"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { login } = useAuth();
  
  const type = searchParams.get('type') || 'registration';
  const email = searchParams.get('email') || '';

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    if (error) setError("");
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pasteData.length === 6) {
      const newOtp = pasteData.split('').slice(0, 6);
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("otp_token");
      if (!token) {
        setError("Session expired. Please try again.");
        router.push(type === 'password_reset' ? '/forgot-password' : '/register');
        return;
      }

      const response = await axios.post("http://localhost:8000/api/auth/check-otp", {
        otp: otpString,
        token: token,
      });

      if (type === 'registration') {
        // Use the login method from AuthContext
        login(response.data.access_token, response.data.refresh_token, response.data.user);
        localStorage.removeItem("otp_token");
        localStorage.removeItem("user_id");
        
        router.push("/");
      } else if (type === 'password_reset') {
        // Store reset token and redirect to reset password page
        localStorage.setItem("reset_token", response.data.reset_token);
        localStorage.removeItem("otp_token");
        
        router.push("/reset-password");
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid or expired OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError("");

    try {
      let endpoint;
      let payload;
      
      if (type === 'password_reset') {
        endpoint = "http://localhost:8000/api/auth/forgot-password";
        payload = { email };
      } else {
        // For registration, we'd need to call registration again
        // This is a simplified approach - in production you might have a separate resend endpoint
        setError("Please go back and register again.");
        setResending(false);
        return;
      }

      const response = await axios.post(endpoint, payload);
      localStorage.setItem("otp_token", response.data.token);
      
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
      
      // Clear OTP inputs
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      
      // Start countdown again
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err: any) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
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
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
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
            {canResend ? (
              <button
                onClick={handleResendOTP}
                disabled={resending}
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium text-sm"
              >
                {resending ? "Sending..." : "Resend Code"}
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
