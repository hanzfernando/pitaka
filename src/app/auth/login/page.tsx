"use client";

import GoogleAuthButton from "@/components/GoogleAuthButton";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen px-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg space-y-6 bg-white/10 backdrop-blur-md border border-white/20 text-white">
        <h1 className="text-2xl font-semibold text-center">Sign In</h1>

        <GoogleAuthButton label="Log in with Google"/>

        <div className="relative flex items-center my-2">
          <div className="flex-grow border-t border-white/30" />
          <span className="mx-4 text-sm text-white/80">or</span>
          <div className="flex-grow border-t border-white/30" />
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
