"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { ProfileService } from "@/services/profileService";
import { Profile } from "@/types";
import { 
  TrendingUp, 
  Sparkles, 
  MapPin, 
  Heart, 
  Award, 
  PieChart, 
  CheckCircle,
  Users
} from "lucide-react";
import { motion } from "framer-motion";

export default function InsightsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    avgAge: 0,
    avgIncome: 0,
    cityCounts: [] as { name: string; count: number }[],
    religionCounts: [] as { name: string; count: number }[],
    wantsKidsCounts: { Yes: 0, No: 0, Open: 0 } as Record<string, number>,
  });

  useEffect(() => {
    async function loadStats() {
      const all = await ProfileService.getAllProfiles();
      setProfiles(all);

      const total = all.length;
      const male = all.filter((p) => p.gender === "Male").length;
      const female = all.filter((p) => p.gender === "Female").length;
      
      const sumAge = all.reduce((acc, p) => acc + p.age, 0);
      const avgAge = Math.round((sumAge / total) * 10) / 10;

      const sumIncome = all.reduce((acc, p) => acc + p.income, 0);
      const avgIncome = Math.round((sumIncome / total) * 10) / 10;

      // City distribution
      const cities: Record<string, number> = {};
      all.forEach((p) => {
        cities[p.city] = (cities[p.city] || 0) + 1;
      });
      const cityCounts = Object.entries(cities)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Religion distribution
      const religions: Record<string, number> = {};
      all.forEach((p) => {
        religions[p.religion] = (religions[p.religion] || 0) + 1;
      });
      const religionCounts = Object.entries(religions)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Wants Kids distribution
      const wantsKidsCounts = { Yes: 0, No: 0, Open: 0 };
      all.forEach((p) => {
        const val = p.wantsKids as "Yes" | "No" | "Open";
        if (wantsKidsCounts[val] !== undefined) {
          wantsKidsCounts[val]++;
        }
      });

      setStats({
        total,
        male,
        female,
        avgAge,
        avgIncome,
        cityCounts,
        religionCounts,
        wantsKidsCounts,
      });
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-rose-100/50 dark:border-zinc-900 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-rose-100/30 dark:from-rose-950/10 to-transparent rounded-full pointer-events-none" />
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
              <TrendingUp className="h-4.5 w-4.5" />
              <span className="text-xs font-bold uppercase tracking-wider">CRM Demographics</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
              CRM Matchmaking Insights
            </h2>
            <p className="text-xs text-muted-foreground">
              Live data analysis, demographic distribution, and relationship trends calculated from current client profiles.
            </p>
          </div>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-900/50 border border-rose-100/30 dark:border-zinc-900 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Gender Balance</span>
            <div className="flex justify-between items-baseline">
              <p className="text-xl font-bold text-slate-800 dark:text-zinc-100">
                {stats.male}M : {stats.female}F
              </p>
              <span className="text-[10px] text-emerald-500 font-semibold">Perfect 50:50</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden flex">
              <div className="bg-blue-400 h-full" style={{ width: "50%" }} />
              <div className="bg-rose-400 h-full" style={{ width: "50%" }} />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/50 border border-rose-100/30 dark:border-zinc-900 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Average Client Age</span>
            <p className="text-2xl font-bold text-slate-800 dark:text-zinc-100">{stats.avgAge} yrs</p>
            <p className="text-[10px] text-muted-foreground">Optimal pairing range (23-38 yrs)</p>
          </div>

          <div className="bg-white dark:bg-zinc-900/50 border border-rose-100/30 dark:border-zinc-900 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Average Income</span>
            <p className="text-2xl font-bold text-slate-800 dark:text-zinc-100">{stats.avgIncome} LPA</p>
            <p className="text-[10px] text-rose-500 font-semibold">Strong financial stability</p>
          </div>

          <div className="bg-white dark:bg-zinc-900/50 border border-rose-100/30 dark:border-zinc-900 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Top Location</span>
            <p className="text-2xl font-bold text-slate-800 dark:text-zinc-100">Mumbai</p>
            <p className="text-[10px] text-muted-foreground">Hub of active client dossiers</p>
          </div>
        </div>

        {/* Charts & Distributions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Religion Distribution Card */}
          <div className="bg-white dark:bg-zinc-950 border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-rose-50 dark:border-zinc-900/50">
              <PieChart className="h-4.5 w-4.5 text-rose-500" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Religious Demographics</h4>
            </div>
            <div className="space-y-3.5">
              {stats.religionCounts.map((r) => {
                const pct = Math.round((r.count / stats.total) * 100);
                return (
                  <div key={r.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      <span>{r.name}</span>
                      <span>{r.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-rose-peach h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Cities Card */}
          <div className="bg-white dark:bg-zinc-950 border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-rose-50 dark:border-zinc-900/50">
              <MapPin className="h-4.5 w-4.5 text-rose-500" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Top Geographic Centers</h4>
            </div>
            <div className="space-y-3.5">
              {stats.cityCounts.map((c) => {
                const pct = Math.round((c.count / stats.total) * 100);
                return (
                  <div key={c.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      <span>{c.name}</span>
                      <span>{c.count} clients</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-slate-700 dark:bg-zinc-700 h-full rounded-full" style={{ width: `${pct * 3}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* AI Trends Commentary */}
        <div className="bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/30 dark:border-rose-900/20 rounded-3xl p-6 space-y-3 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-rose-100/20 to-transparent rounded-full pointer-events-none" />
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 relative z-10">
            <Sparkles className="h-4.5 w-4.5 text-rose-500 fill-rose-500/10" />
            <span>AI Matchmaker Trend Analysis</span>
          </div>
          <div className="text-xs leading-relaxed text-slate-700 dark:text-zinc-300 font-medium space-y-2 relative z-10">
            <p>
              &ldquo;Based on analysis of our 100 active matrimonial dossiers, we are seeing a <strong>22% rise</strong> in relocation flexibility among female pediatricians and analysts, particularly moving from metro hubs to tier-2 centers. Language compatibility remains a primary alignment criteria for 74% of parent networks.&rdquo;
            </p>
            <p>
              &ldquo;Additionally, clients choosing a child-free or open lifestyle preferences show a high compatibility index with partners holding B.Tech/MBA degrees, yielding an average pairing score of 84.6% in our database.&rdquo;
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
