"use client";

import Sidebar from "@/components/Sidebar";
import AppProvider from "@/context/AppProvider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full px-4 py-10 bg-background text-foreground">
            {children}
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default DashboardLayout;
