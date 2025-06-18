"use client";

import GoogleAuthButton from "@/components/GoogleAuthButton";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen px-4 bg-white/50 dark:bg-black/30 backdrop-blur-sm transition-colors duration-300">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg space-y-6 
        bg-white/70 dark:bg-white/10 
        text-black dark:text-white 
        border border-black/10 dark:border-white/20 
        backdrop-blur-md transition-colors duration-300"
      >
        <h1 className="text-2xl font-semibold text-center">Login to your account</h1>

        <GoogleAuthButton label="Log in with Google" />

        <div className="relative flex items-center my-2">
          <div className="flex-grow border-t border-black/30 dark:border-white/30" />
          <span className="mx-4 text-sm text-black/60 dark:text-white/80">or</span>
          <div className="flex-grow border-t border-black/30 dark:border-white/30" />
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
