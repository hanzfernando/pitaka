'use client'

import Link from 'next/link'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LandingPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();


      if (user) {
        router.replace('/dashboard');
      }
    }

    checkUser();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-300">
      {/* Navbar */}
      <nav className="flex justify-end p-6 shadow-md bg-white dark:bg-zinc-800 transition-colors">
        <div className="space-x-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
          >
            Signup
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4">Pitaka</h1>
        <p className="text-xl max-w-xl">
          An Expense and Subscription Tracker
        </p>
      </main>
    </div>
  );
}
