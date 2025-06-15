import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const supabase = createClient();
  const signup = async (email: string, password: string, confirmPassword: string) => {
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email to confirm your account.");
    }

    setLoading(false);
  };

  return { signup, loading, message };
}
