"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { 
  Users, 
  Settings, 
  LogOut, 
  Heart, 
  TrendingUp,
  UserCheck,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string>("matchmaker@tdc.com");
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    }
    getUser();
  }, [supabase]);

  const navItems: { name: string; href: string; icon: any; disabled?: boolean }[] = [
    {
      name: "Clients",
      href: "/dashboard",
      icon: Users,
    },
    {
      name: "Success Stories",
      href: "/dashboard/success",
      icon: UserCheck,
    },
    {
      name: "Insights",
      href: "/dashboard/insights",
      icon: TrendingUp,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const renderSidebarContent = (isMobileView = false) => {
    return (
      <div className="flex flex-col h-full w-full bg-white dark:bg-zinc-950 font-sans">
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-rose-50/50 dark:border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-rose-peach flex items-center justify-center shadow-md shadow-rose-200/50 dark:shadow-none">
              <Heart className="h-5 w-5 text-white fill-white/20" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 dark:text-white tracking-tight flex items-center gap-1.5">
                MatchFlow
                <span className="text-[10px] bg-rose-50 dark:bg-rose-950/50 text-rose-500 font-semibold px-2 py-0.5 rounded-full border border-rose-100/50 dark:border-rose-900/50">
                  AI
                </span>
              </h1>
              <p className="text-[10px] text-muted-foreground">Relationship CRM</p>
            </div>
          </div>
          {isMobileView && (
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 text-slate-400 hover:text-rose-500 rounded-lg md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2">
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              Matchmaker Hub
            </p>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.disabled ? "#" : item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  item.disabled 
                    ? "opacity-40 cursor-not-allowed hover:bg-transparent" 
                    : isActive
                    ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 shadow-sm"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-rose-50/30 dark:hover:bg-zinc-900/50 hover:text-rose-500 dark:hover:text-rose-400"
                }`}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  } else if (isMobileView) {
                    setIsOpen(false);
                  }
                }}
              >
                <Icon className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-rose-500 dark:text-rose-400" : "text-slate-400 group-hover:text-rose-400"
                }`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Profile & Logout */}
        <div className="p-4 border-t border-rose-50/50 dark:border-zinc-900 bg-rose-50/10 dark:bg-zinc-950">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-9 w-9 rounded-full bg-gradient-rose-peach flex items-center justify-center text-white font-semibold text-sm">
              {userEmail[0]?.toUpperCase() || "M"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-700 dark:text-zinc-200 truncate">
                {userEmail.split("@")[0]}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-rose-100 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/50 transition-all duration-200 text-xs font-medium cursor-pointer bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-zinc-950 border-b border-rose-50/50 dark:border-zinc-900 flex items-center justify-between px-4 z-30 font-sans">
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-2 text-slate-600 dark:text-zinc-400 hover:text-rose-500 rounded-xl"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-1.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-rose-peach flex items-center justify-center shadow-sm">
            <Heart className="h-4 w-4 text-white fill-white/10" />
          </div>
          <span className="font-bold text-sm text-slate-800 dark:text-white">MatchFlow</span>
        </div>
        <div className="w-9" />
      </div>

      {/* DESKTOP PERMANENT SIDEBAR */}
      <aside className="hidden md:flex w-64 border-r border-rose-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-col h-screen fixed left-0 top-0 z-20">
        {renderSidebarContent(false)}
      </aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black z-40"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-zinc-950 z-50 shadow-2xl h-screen"
            >
              {renderSidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
