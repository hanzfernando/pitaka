'use client'

import Link from 'next/link'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log('User:', user);

      if (user) {
        // User is logged in, redirect to dashboard
        router.replace('/dashboard');
      }
    }

    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-end p-6 bg-white shadow-md">
        <div className="space-x-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Signup
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 px-6 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Pitaka</h1>
        <p className="text-xl text-gray-700 max-w-xl">
          An Expense and Subscription Tracker
        </p>
      </main>
    </div>
  )
}
