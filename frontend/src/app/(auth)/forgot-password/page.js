"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Email validation, Step 2: Reset password
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/forgot-password`, { email });
      setUserId(response.data.data.userId);
      setStep(2); // Move to the next step
    } catch (error) {
      setErrors({ email: error.response?.data?.message || "Invalid email address" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/reset-password`, {
        userId,
        newPassword,
      });
      router.push("/login"); // Redirect to login page
    } catch (error) {
      setErrors({ general: "Failed to reset password. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h1>

        {errors.general && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Validating..." : "Submit"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="newPassword"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-indigo-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}