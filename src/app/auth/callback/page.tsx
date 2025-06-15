"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("AuthCallback: session", data, error);

      // Optional small delay to make sure everything is synced
      setTimeout(() => {
        router.replace("/dashboard");
      }, 300);
    };

    handleRedirect();
  }, [router]);

  return <p className="text-center mt-10">Signing you in...</p>;
}
