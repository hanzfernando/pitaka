'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // redirect after successful login
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Redirecting...' : 'Login with Google'}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
