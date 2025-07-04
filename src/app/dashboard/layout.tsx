"use client";

import Sidebar from "@/components/Sidebar";
import AppProvider from "@/context/AppProvider";
import AuthGuard from "@/components/AuthGuard";
import { Toaster } from "sonner"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProvider>
      <AuthGuard>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
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
