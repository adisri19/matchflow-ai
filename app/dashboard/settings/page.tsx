"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { 
  Settings, 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  User, 
  KeyRound, 
  Plus, 
  Trash2,
  CheckCircle2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  // Sliders state
  const [weights, setWeights] = useState({
    age: 15,
    height: 15,
    religion: 20,
    location: 10,
    hobbies: 5,
  });

  // OpenAI Model selection
  const [model, setModel] = useState("gpt-4o-mini");

  // Local state for allowlist emails
  const [allowedList, setAllowedList] = useState(["demo@tdc.com", "admin@tdc.com", "test@tdc.com"]);
  const [newEmail, setNewEmail] = useState("");

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    if (allowedList.includes(newEmail.trim().toLowerCase())) {
      showToast("Email address is already in the allowlist.");
      return;
    }

    setAllowedList([...allowedList, newEmail.trim().toLowerCase()]);
    setNewEmail("");
    showToast("Email successfully added to local session allowlist!");
  };

  const handleRemoveEmail = (email: string) => {
    if (email === "demo@tdc.com") {
      showToast("Cannot remove default demo credentials.");
      return;
    }
    setAllowedList(allowedList.filter((e) => e !== email));
    showToast("Email removed from local session allowlist.");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 pt-20 md:pt-8 p-4 md:p-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-rose-100/50 dark:border-zinc-900 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-rose-100/30 dark:from-rose-950/10 to-transparent rounded-full pointer-events-none" />
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
              <Settings className="h-4.5 w-4.5" />
              <span className="text-xs font-bold uppercase tracking-wider">System Administration</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
              CRM Matchmaker Settings
            </h2>
            <p className="text-xs text-muted-foreground">
              Configure system matching variables, edit allowlist registries, and check third-party API keys.
            </p>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Matchmaker details & Rules adjustment */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Consultant Profile Details */}
            <div className="bg-white dark:bg-zinc-950 border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-rose-50 dark:border-zinc-900/50">
                <User className="h-4.5 w-4.5 text-rose-500" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Consultant Account</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Profile Role</span>
                  <p className="font-semibold text-slate-800 dark:text-zinc-200">Relationship Consultant</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Assigned Branch</span>
                  <p className="font-semibold text-slate-800 dark:text-zinc-200">Mumbai Head Office</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">System Privilege</span>
                  <p className="font-semibold text-emerald-500">Authorized Manager</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Dossier Access</span>
                  <p className="font-semibold text-slate-800 dark:text-zinc-200">Full Directory (Read/Write)</p>
                </div>
              </div>
            </div>

            {/* Matchmaker Engine Weight adjusters */}
            <div className="bg-white dark:bg-zinc-950 border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-rose-50 dark:border-zinc-900/50">
                <div className="flex items-center gap-2">
                  <Sliders className="h-4.5 w-4.5 text-rose-500" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Matching Engine Weights</h4>
                </div>
                <button
                  onClick={() => showToast("Matching engine weightings updated locally!")}
                  className="px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-100 dark:border-rose-900/50 transition-all cursor-pointer"
                >
                  Save Config
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    <span>Age Matching Weight</span>
                    <span className="text-rose-500">{weights.age} pts</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={weights.age}
                    onChange={(e) => setWeights({ ...weights, age: parseInt(e.target.value) })}
                    className="w-full h-1 bg-rose-100 dark:bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    <span>Height Matching Weight</span>
                    <span className="text-rose-500">{weights.height} pts</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={weights.height}
                    onChange={(e) => setWeights({ ...weights, height: parseInt(e.target.value) })}
                    className="w-full h-1 bg-rose-100 dark:bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    <span>Religion &amp; Caste Alignment</span>
                    <span className="text-rose-500">{weights.religion} pts</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={weights.religion}
                    onChange={(e) => setWeights({ ...weights, religion: parseInt(e.target.value) })}
                    className="w-full h-1 bg-rose-100 dark:bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    <span>Geographic Proximity</span>
                    <span className="text-rose-500">{weights.location} pts</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={weights.location}
                    onChange={(e) => setWeights({ ...weights, location: parseInt(e.target.value) })}
                    className="w-full h-1 bg-rose-100 dark:bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Allowlist & API key */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Allowlist Registry Manager */}
            <div className="bg-white dark:bg-zinc-950 border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-rose-50 dark:border-zinc-900/50">
                <ShieldCheck className="h-4.5 w-4.5 text-rose-500" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">Consultant Allowlist Directory</h4>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddEmail} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email to authorize..."
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-zinc-900 border border-rose-50 dark:border-zinc-800 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-400"
                />
                <button
                  type="submit"
                  className="p-2 bg-gradient-rose-peach rounded-xl text-white hover:shadow-md transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </form>

              {/* Email list */}
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {allowedList.map((email) => (
                  <div key={email} className="flex items-center justify-between p-2.5 bg-slate-50/50 dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900 rounded-xl text-xs">
                    <span className="font-semibold text-slate-700 dark:text-zinc-300">{email}</span>
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                      title="Revoke Access"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* OpenAI API keys verification */}
            <div className="bg-white dark:bg-zinc-950 border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-rose-50 dark:border-zinc-900/50">
                <KeyRound className="h-4.5 w-4.5 text-rose-500" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">OpenAI API Connection</h4>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">Model Priority</span>
                  <select
                    value={model}
                    onChange={(e) => {
                      setModel(e.target.value);
                      showToast(`AI Model priority updated to ${e.target.value}`);
                    }}
                    className="w-full bg-slate-50 dark:bg-zinc-900 border border-rose-50 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400"
                  >
                    <option value="gpt-4o-mini">gpt-4o-mini (Default Fast)</option>
                    <option value="gpt-4o">gpt-4o (Premium Analysis)</option>
                    <option value="o1-mini">o1-mini (Complex Reasoning)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">API Key Status</span>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-900 p-2.5 rounded-xl border border-rose-50 dark:border-zinc-800 text-[10px]">
                    <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                      Fallback Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Global In-App Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-zinc-900 border border-zinc-850 text-white rounded-2xl p-4 shadow-xl flex items-center gap-3 w-80 max-w-sm"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <div className="text-xs flex-1">
              <p className="font-semibold text-zinc-100">Settings Saved</p>
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
