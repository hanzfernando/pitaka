"use client";

import GoogleLoginButton from "@/components/GoogleLoginButton";
import LoginForm from "@/components/LoginForm"; // adjust path if needed

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h1 className="text-2xl font-semibold text-center text-gray-800">Sign In</h1>

        <GoogleLoginButton />

        <div className="relative flex items-center my-2">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
