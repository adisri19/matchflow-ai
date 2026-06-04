"use client";

import Link from "next/link";
import { Profile } from "@/types";
import { MapPin, Sparkles, User, Heart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CustomerCardProps {
  customer: Profile;
  topMatchScore?: number;
}

export default function CustomerCard({ customer, topMatchScore = 88 }: CustomerCardProps) {
  // Let's decide a status tag color dynamically
  const statusColors: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50",
    "Needs Matches": "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
    "On Hold": "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
    New: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50",
  };

  // Mock status tag based on ID number for diverse UI
  const getStatus = (id: string) => {
    const num = parseInt(id.replace(/\D/g, "")) || 0;
    if (num % 4 === 0) return "Needs Matches";
    if (num % 5 === 0) return "On Hold";
    if (num % 7 === 0) return "New";
    return "Active";
  };

  const status = getStatus(customer.id);
  const statusClass = statusColors[status] || statusColors.Active;

  return (
    <Link href={`/dashboard/profile/${customer.id}`} className="block group">
      <div className="bg-white dark:bg-zinc-950 border border-rose-100/50 dark:border-zinc-900 rounded-2xl p-5 hover:shadow-xl hover:shadow-rose-100/20 dark:hover:shadow-none hover:border-rose-200 dark:hover:border-rose-800 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
        {/* Subtle Background Accent Gradient */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-50/40 dark:from-rose-950/5 via-transparent to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

        <div className="flex items-start gap-4">
          {/* Profile Image with status ring */}
          <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-white dark:border-zinc-900 shadow-md group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
            {customer.profileImage ? (
              <img
                src={customer.profileImage}
                alt={`${customer.firstName} ${customer.lastName}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500">
                <User className="h-6 w-6" />
              </div>
            )}
          </div>

          {/* Name & Title */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-200 truncate pr-8">
              {customer.firstName} {customer.lastName}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {customer.designation}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
              {customer.company}
            </p>
          </div>

          {/* Compatibility Match Score Badge */}
          <div className="absolute top-5 right-5 flex flex-col items-end">
            <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/50 rounded-xl px-2.5 py-1 text-center flex items-center gap-1 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {topMatchScore}%
              </span>
            </div>
            <span className="text-[9px] text-slate-400 dark:text-zinc-500 mt-1 uppercase tracking-wider font-semibold">
              Top Match
            </span>
          </div>
        </div>

        {/* Demographics row */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 mt-5 text-xs text-slate-600 dark:text-zinc-300 flex-1 border-t border-rose-50/50 dark:border-zinc-900/50 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 w-12 font-medium">Age / Gen</span>
            <span className="font-medium truncate text-slate-800 dark:text-zinc-100">
              {customer.age} yrs • {customer.gender}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 w-12 font-medium">City</span>
            <span className="font-medium truncate text-slate-800 dark:text-zinc-100 flex items-center gap-0.5">
              <MapPin className="h-3 w-3 text-rose-400 flex-shrink-0" />
              {customer.city}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 w-12 font-medium">Religion</span>
            <span className="font-medium truncate text-slate-800 dark:text-zinc-100">
              {customer.religion} ({customer.caste})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 w-12 font-medium">Status</span>
            <span className="font-medium truncate text-slate-800 dark:text-zinc-100">
              {customer.maritalStatus}
            </span>
          </div>
        </div>

        {/* Footer Row */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-50 dark:border-zinc-900/50">
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${statusClass}`}>
            {status}
          </span>
          <div className="text-[10px] text-slate-400 dark:text-zinc-500 flex items-center gap-1 font-medium group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
            <span>Consult Profile</span>
            <span className="text-xs transition-transform group-hover:translate-x-1 duration-200">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
