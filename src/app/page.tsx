'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.replace('/dashboard')
      }
    }

    checkUser()
  }, [router, supabase.auth])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors duration-300">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 shadow-sm bg-white dark:bg-zinc-800">
        <h2 className="text-2xl font-bold tracking-tight">Pitaka</h2>
        <div className="space-x-3">
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
      <section className="flex-grow flex flex-col min-h-[70vh] justify-center items-center text-center px-4 py-20 bg-gradient-to-b from-white to-slate-100 dark:from-zinc-900 dark:to-zinc-800">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
          Manage Your Money Smartly
        </h1>
        <p className="text-xl max-w-xl text-zinc-700 dark:text-zinc-300 mb-6">
          Pitaka lets you track expenses and subscriptions in one place — simple, secure, and beautifully designed.
        </p>
        <Link
          href="/auth/signup"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition text-lg shadow"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 text-center bg-white dark:bg-zinc-900">
        <h2 className="text-3xl font-bold mb-10">Why Choose Pitaka?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2">All-in-One Tracking</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Keep tabs on both your everyday expenses and recurring subscriptions.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Insightful Dashboards</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Visualize your spending habits with clean, easy-to-read charts.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Privacy-Focused</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Your data stays yours — encrypted storage and zero-knowledge design.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="max-w-4xl mx-auto space-y-6 text-lg text-zinc-700 dark:text-zinc-300">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
            <strong>1. Sign Up</strong> – Create an account quickly with secure email authentication.
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
            <strong>2. Add Your Categories</strong> – Categorize your finances however you want (transportation, groceries, etc.).
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
            <strong>3. Track Expenses & Subscriptions</strong> – Log and monitor transactions and auto-renewals easily.
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-600 text-white text-center dark:bg-blue-500">
        <h2 className="text-4xl font-bold mb-4">Ready to take control of your finances?</h2>
        <p className="text-lg mb-6">Join Pitaka today — it’s free and takes less than a minute.</p>
        <Link
          href="/auth/signup"
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition"
        >
          Create Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-6">
        &copy; {new Date().getFullYear()} Pitaka. All rights reserved.
      </footer>
    </div>
  )
}
