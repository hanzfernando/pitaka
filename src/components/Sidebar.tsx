"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";
import {
  Home,
  Wallet,
  Folder,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { useUserContext } from "@/hooks/useUserContext";
import ConfirmLogoutModal from "./ConfirmLogoutModal";
import { useState } from "react";

const navItems = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "My Expenses", icon: Wallet, href: "/dashboard/expenses" },
  { label: "Recurring Expenses", icon: Wallet, href: "/dashboard/recurring" },
  { label: "Categories", icon: Folder, href: "/dashboard/categories" },
  { divider: true },
  { label: "Settings", icon: Settings, href: "/dashboard/profile_settings" },
  { label: "Logout", icon: LogOut, action: "logout" },
];

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const { logout, loading } = useLogout();
  const router = useRouter();

  const { state: userState } = useUserContext();
  const username = userState.displayName || "user";

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}


      <aside
        className={`
          fixed top-0 left-0 z-50 w-64 h-screen border-r bg-background dark:bg-background
          flex flex-col p-4 shadow-sm transition-transform duration-300
          transform ${open ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        {/* Close button only for mobile */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <h1 className="text-xl font-bold">Pitaka</h1>
          <button onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Top content */}
        <div className="flex-1">
          {/* Show "Pitaka" header on desktop too */}
          <h1 className="text-xl font-bold mb-1 hidden md:block">Pitaka</h1>
          <p className="text-sm text-muted-foreground mb-6 hidden md:block">👤 {username}</p>

          <nav className="space-y-1 text-sm">
            {navItems.map((item, index) => {
              if (item.divider) {
                return <hr key={index} className="my-3 border-gray-200 dark:border-gray-700" />;
              }

              const isActive = pathname === item.href;
              const ItemIcon = item.icon!;
              const baseClasses =
                "flex items-center w-full px-3 border-transparent border-1 py-2 rounded-md transition-colors";
              const activeClasses = "bg-blue-600 text-white hover:bg-blue-500";
              const inactiveClasses = "hover:border-gray-400 hover:bg-gray-900";

              const classes = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

              if (item.action === "logout") {
                return (
                  <button
                    key={index}
                    onClick={() => setShowLogoutModal(true)}
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
                  onClick={() => {
                    router.push(item.href!);
                    setOpen(false);
                  }}
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


      {showLogoutModal && (
        <ConfirmLogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={() => {
            logout();
            setShowLogoutModal(false);
          }}
        />
      )}
    </>
  );
}
