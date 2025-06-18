"use client";

import SignupForm from "@/components/SignupForm";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center h-screen px-4 bg-white/30 dark:bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg space-y-6 
        bg-white/70 dark:bg-white/10 
        text-black dark:text-white 
        border border-black/10 dark:border-white/20 
        backdrop-blur-md transition-colors duration-300"
      >
        <h1 className="text-2xl font-semibold text-center">
          Create your account
        </h1>

        <GoogleAuthButton label="Sign up with Google" />

        <div className="relative flex items-center my-2">
          <div className="flex-grow border-t border-black/20 dark:border-white/30" />
          <span className="mx-4 text-sm text-black/60 dark:text-white/80">or</span>
          <div className="flex-grow border-t border-black/20 dark:border-white/30" />
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
