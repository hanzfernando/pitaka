"use client";

import Sidebar from "@/components/Sidebar";
import AppProvider from "@/context/AppProvider";
import AuthGuard from "@/components/AuthGuard";
import { Toaster } from "sonner";
import { useState } from "react";
import { Menu } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <AuthGuard>
        <div className="flex h-screen relative">
          {/* Mobile toggle button */}
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-3 absolute top-4 left-4 z-50 bg-white dark:bg-gray-800 rounded-md shadow"
            >
              <Menu size={20} />
            </button>
          )}

          <main className="flex-1 overflow-y-auto relative">
            <div className="max-w-5xl mx-auto w-full px-4 py-10 bg-background text-foreground">
              {children}
              <Toaster richColors position="top-right" />
            </div>
          </main>
        </div>
      </AuthGuard>
    </AppProvider>
  );
};

export default DashboardLayout;
