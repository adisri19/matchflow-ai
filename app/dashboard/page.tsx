"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import CustomerCard from "@/components/CustomerCard";
import { ProfileService } from "@/services/profileService";
import { Profile } from "@/types";
import { 
  Search, 
  Filter, 
  Sparkles, 
  Users, 
  Heart, 
  CheckCircle2, 
  X,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filtered, setFiltered] = useState<Profile[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [religions, setReligions] = useState<string[]>([]);

  // Filter States
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState("All");
  const [city, setCity] = useState("All");
  const [religion, setReligion] = useState("All");
  const [wantsKids, setWantsKids] = useState("All");
  const [maritalStatus, setMaritalStatus] = useState("All");

  // Local Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const allProfiles = await ProfileService.getAllProfiles();
      setProfiles(allProfiles);
      setFiltered(allProfiles);

      const uniqueCities = await ProfileService.getUniqueCities();
      setCities(uniqueCities);

      const uniqueReligions = await ProfileService.getUniqueReligions();
      setReligions(uniqueReligions);
    }
    loadData();
  }, []);

  // Handle Filtering on change
  useEffect(() => {
    async function applyFilters() {
      const result = await ProfileService.getFilteredProfiles({
        query,
        gender,
        city,
        religion,
        wantsKids,
        maritalStatus,
      });
      setFiltered(result);
    }
    applyFilters();
  }, [query, gender, city, religion, wantsKids, maritalStatus]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Mock Top Match scores for clients so each shows a realistic number
  const getMockTopScore = (id: string) => {
    const num = parseInt(id.replace(/\D/g, "")) || 0;
    return 70 + (num % 26); // returns score between 70% and 95%
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8 space-y-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-rose-100/50 dark:border-zinc-900 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-rose-100/30 dark:from-rose-950/10 to-transparent rounded-full pointer-events-none" />
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
              <Sparkles className="h-4.5 w-4.5 fill-rose-500/10" />
              <span className="text-xs font-bold uppercase tracking-wider">Consultant Workspace</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
              Elite Matrimonial Client Dashboard
            </h2>
            <p className="text-xs text-muted-foreground">
              Review relationship profiles, analyze algorithmic compatibility, and manage active match proposals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => showToast("Exporting client log spreadsheet...")}
              className="px-4 py-2 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Dashboard Metrics / Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white dark:bg-zinc-900/50 border border-rose-100/30 dark:border-zinc-900 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Total Clients</span>
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-zinc-950 flex items-center justify-center text-rose-500">
                <Users className="h-4.5 w-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-zinc-100">{profiles.length}</p>
              <p className="text-[10px] text-emerald-500 font-medium mt-1">100% active matchmaking</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/50 border border-rose-100/30 dark:border-zinc-900 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Matches Active</span>
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-zinc-950 flex items-center justify-center text-rose-500">
                <Heart className="h-4.5 w-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-zinc-100">74</p>
              <p className="text-[10px] text-muted-foreground mt-1">Pending client responses</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/50 border border-rose-100/30 dark:border-zinc-900 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Avg Compatibility</span>
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-zinc-950 flex items-center justify-center text-rose-500">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-zinc-100">82.4%</p>
              <p className="text-[10px] text-rose-500 font-medium mt-1">High potential pairings</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900/50 border border-rose-100/30 dark:border-zinc-900 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Sent Packets</span>
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-zinc-950 flex items-center justify-center text-rose-500">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-zinc-100">12</p>
              <p className="text-[10px] text-muted-foreground mt-1">Dispatched this week</p>
            </div>
          </div>

        </div>

        {/* Filters and Controls Header */}
        <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-rose-100/50 dark:border-zinc-900 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients by name, profession, company, or caste..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-zinc-900/50 border border-rose-50/50 dark:border-zinc-900 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-400 text-slate-800 dark:text-zinc-200"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Control Header */}
            <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 border-l border-slate-100 dark:border-zinc-900 pl-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
            </div>
          </div>

          {/* Filter dropdown selectors */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-slate-50 dark:border-zinc-900/50">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-50/50 dark:bg-zinc-900/50 border border-rose-50/50 dark:border-zinc-900 text-slate-700 dark:text-zinc-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50/50 dark:bg-zinc-900/50 border border-rose-50/50 dark:border-zinc-900 text-slate-700 dark:text-zinc-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
              >
                <option value="All">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Religion</label>
              <select
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
                className="w-full bg-slate-50/50 dark:bg-zinc-900/50 border border-rose-50/50 dark:border-zinc-900 text-slate-700 dark:text-zinc-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
              >
                <option value="All">All Religions</option>
                {religions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Wants Kids</label>
              <select
                value={wantsKids}
                onChange={(e) => setWantsKids(e.target.value)}
                className="w-full bg-slate-50/50 dark:bg-zinc-900/50 border border-rose-50/50 dark:border-zinc-900 text-slate-700 dark:text-zinc-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
              >
                <option value="All">All Choices</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Open">Open</option>
              </select>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Marital Status</label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full bg-slate-50/50 dark:bg-zinc-900/50 border border-rose-50/50 dark:border-zinc-900 text-slate-700 dark:text-zinc-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
              >
                <option value="All">All Statuses</option>
                <option value="Never Married">Never Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Awaiting Divorce">Awaiting Divorce</option>
              </select>
            </div>

          </div>
        </div>

        {/* Client Grid display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full py-20 bg-white dark:bg-zinc-900/30 rounded-3xl border border-rose-100/50 dark:border-zinc-900 text-center space-y-3">
              <AlertCircle className="h-10 w-10 text-rose-300 mx-auto" />
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  No matching clients found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Adjust filters or clear your search text to view profiles.
                </p>
              </div>
            </div>
          ) : (
            filtered.map((profile) => (
              <CustomerCard
                key={profile.id}
                customer={profile}
                topMatchScore={getMockTopScore(profile.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Global In-App Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-zinc-900 border border-zinc-800 text-white rounded-2xl p-4 shadow-xl flex items-center gap-3 w-80 max-w-sm"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <div className="text-xs flex-1">
              <p className="font-semibold text-zinc-100">Action Successful</p>
              <p className="text-zinc-400 mt-0.5 leading-relaxed">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
