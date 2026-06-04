"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { 
  Users, 
  Settings, 
  LogOut, 
  Heart, 
  Sparkles, 
  TrendingUp,
  UserCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function Sidebar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string>("matchmaker@tdc.com");
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

  const navItems = [
    {
      name: "Clients",
      href: "/dashboard",
      icon: Users,
    },
    {
      name: "Success Stories",
      href: "#",
      icon: UserCheck,
      disabled: true,
    },
    {
      name: "Insights",
      href: "#",
      icon: TrendingUp,
      disabled: true,
    },
    {
      name: "Settings",
      href: "#",
      icon: Settings,
      disabled: true,
    },
  ];

  return (
    <aside className="w-64 border-r border-rose-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-screen fixed left-0 top-0 z-20">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-rose-50/50 dark:border-zinc-900">
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
              onClick={(e) => item.disabled && e.preventDefault()}
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
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-rose-100 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/50 transition-all duration-200 text-xs font-medium cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
