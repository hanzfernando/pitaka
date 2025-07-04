import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggleButton from "@/components/ThemeToggleButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pitaka – Personal Expense Tracker",
  description: "Pitaka helps you manage your daily spending, track expenses, and take control of your finances with a clean and minimalist interface.",
  keywords: ["expense tracker", "budgeting", "personal finance", "Pitaka", "money management"],
  authors: [{ name: "Hanz Fernando" }],
  themeColor: "#1f2937",
  icons: {
    icon: [
      { url: "/pitaka-icon.png", sizes: "32x32", type: "image/png" },
      { url: "/pitaka-icon.png", sizes: "192x192", type: "image/png" },
      { url: "/pitaka-icon.png", sizes: "512x512", type: "image/png" },
    ],
  },  
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ThemeToggleButton />
      </body>
    </html>
  );
}
