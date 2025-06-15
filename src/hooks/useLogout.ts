"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const logout = useCallback(async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/");
    setLoading(false);
  }, [router]);

  return { logout, loading };
}
