"use client";

import { useState } from "react";
import { useSignup } from "@/hooks/useSignup";
import Link from "next/link";

export default function SignupForm() {
  const { signup, loading, message } = useSignup();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(email, password, confirmPassword);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm text-white">Email</label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm text-white">Password</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm text-white">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {message && <p className="text-sm text-red-600">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <p className="text-sm text-center text-white/80">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-400 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
