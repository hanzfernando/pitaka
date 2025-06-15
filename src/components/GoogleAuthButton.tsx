"use client";

import { createClient } from "@/lib/supabase/client"; // adjust to your path

type GoogleAuthButtonProps = {
  label?: string; // optional, fallback provided
};

export default function GoogleAuthButton({ label = "Continue with Google" }: GoogleAuthButtonProps) {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`, // adjust this route if needed
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full bg-white cursor-pointer font-medium py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition border border-gray-300"
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 533.5 544.3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#4285F4"
          d="M533.5 278.4c0-17.4-1.6-34-4.6-50.1H272v94.9h146.9c-6.4 34.8-25.6 64.2-54.4 83.9v69h87.7c51.4-47.3 81.3-117.1 81.3-197.7z"
        />
        <path
          fill="#34A853"
          d="M272 544.3c73.6 0 135.5-24.5 180.7-66.4l-87.7-69c-24.3 16.3-55.3 25.9-93 25.9-71.5 0-132-48.2-153.7-112.9H27.1v70.9C71.9 482 165.5 544.3 272 544.3z"
        />
        <path
          fill="#FBBC05"
          d="M118.3 321.9c-10.2-30.1-10.2-62.6 0-92.7V158.3H27.1c-33.5 66.9-33.5 146.7 0 213.6l91.2-70z"
        />
        <path
          fill="#EA4335"
          d="M272 107.2c39.9 0 75.8 13.7 104 40.5l78.2-78.2C407.5 24.8 345.6 0 272 0 165.5 0 71.9 62.3 27.1 158.3l91.2 70C140 155.4 200.5 107.2 272 107.2z"
        />
      </svg>
      <span className="text-gray-700">{label}</span>
    </button>
  );
}
