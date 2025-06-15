"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLogout } from "@/hooks/useLogout";
import {
  Home,
  Wallet,
  Folder,
  BarChart,
  Book,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "My Expenses", icon: Wallet, href: "/dashboard/expenses" },
  { label: "Categories", icon: Folder, href: "/dashboard/categories" },
  { label: "Reports", icon: BarChart, href: "/dashboard/reports", optional: true },

  { divider: true },

  { label: "Activity Log", icon: Book, href: "/dashboard/activity", optional: true },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  { label: "Logout", icon: LogOut, action: "logout" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [username, setUsername] = useState("user");
  const { logout, loading } = useLogout();
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const name = data.user?.user_metadata?.name;
      setUsername(name || "user");
    };
    getUser();
  }, [supabase.auth]);

  return (
    <aside className="w-64 h-screen border-r flex flex-col justify-between p-4 shadow-sm">
      <div>
        <h1 className="text-xl font-bold mb-1">Pitaka</h1>
        <p className="text-sm text-muted-foreground mb-6">👤 {username}</p>

        <nav className="space-y-1 text-sm">
          {navItems.map((item, index) => {
            if (item.divider) {
              return <hr key={index} className="my-3 border-gray-200" />;
            }

            if (item.optional && (item.label === "Reports" || item.label === "Activity Log")) {
              return null;
            }

            const isActive = pathname === item.href;
            const ItemIcon = item.icon!;

            const baseClasses =
              "flex items-center w-full px-3 py-2 rounded-md transition-colors";
            const activeClasses =
              "bg-blue-600 text-white hover:bg-blue-500";
            const inactiveClasses =
              "hover:bg-gray-100";

            const classes = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

            if (item.action === "logout") {
              return (
                <button
                  key={index}
                  onClick={logout}
                  className={classes}
                  disabled={loading}
                >
                  <ItemIcon size={18} className="mr-2" />
                  {item.label}
                </button>
              );
            }

            return (
              <button
                key={index}
                onClick={() => router.push(item.href!)}
                className={classes}
              >
                <ItemIcon size={18} className="mr-2" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
