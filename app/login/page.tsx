"use client";

import { useActionState, useState, startTransition } from "react";
import { login } from "../actions/auth";
import Link from "next/link";
import { Heart, Sparkles, Lock, Mail, Loader2, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, {});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleDemoClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoadingDemo(true);
    setEmail("demo@tdc.com");
    setPassword("Demo@123");
    
    // Create form data programmatically and submit via formAction
    const formData = new FormData();
    formData.append("email", "demo@tdc.com");
    formData.append("password", "Demo@123");
    
    // Trigger Server Action inside transition
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row relative overflow-hidden font-sans">
      
      {/* LEFT PANEL: Sexy branding, animated mesh, floating stats (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden border-r border-zinc-900 bg-zinc-950 select-none">
        {/* Glow Spheres */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-2xl bg-gradient-rose-peach flex items-center justify-center shadow-lg shadow-rose-500/30">
            <Heart className="h-5 w-5 text-white fill-white/20" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white tracking-tight flex items-center gap-1.5">
              MatchFlow
              <span className="text-[10px] bg-rose-950 text-rose-400 font-semibold px-2 py-0.5 rounded-full border border-rose-900/50">
                AI
              </span>
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Relationship CRM</p>
          </div>
        </div>

        {/* Visual Composition: Connection Lines and Floating Avatars */}
        <div className="my-auto relative z-10 py-10 flex flex-col justify-center items-center">
          <div className="max-w-md text-left space-y-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] bg-gradient-to-r from-white via-zinc-100 to-rose-200 bg-clip-text text-transparent"
            >
              Elevate human pairing with algorithmic precision.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm text-zinc-400 leading-relaxed"
            >
              The industry-standard internal dashboard designed for elite matrimonial advisors, relationship planners, and matchmaking experts.
            </motion.p>
          </div>

          {/* Connected Avatars Graphics */}
          <div className="relative w-full max-w-sm h-48 mt-12 flex items-center justify-center">
            {/* Pulsing circles */}
            <div className="absolute w-36 h-36 border border-zinc-900 rounded-full flex items-center justify-center animate-pulse opacity-20" />
            <div className="absolute w-56 h-56 border border-zinc-900 rounded-full flex items-center justify-center animate-pulse opacity-10" />

            {/* Connecting line */}
            <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 300 200">
              <path 
                d="M 60,100 C 120,50 180,150 240,100" 
                fill="none" 
                stroke="url(#line-grad)" 
                strokeWidth="2" 
                strokeDasharray="6 4"
                className="animate-[dash_8s_linear_infinite]"
              />
              <defs>
                <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#fb923c" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Avatar 1 */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl flex items-center gap-2"
            >
              <div className="h-8 w-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-xs text-blue-400 font-bold">
                M
              </div>
              <div className="text-[10px] text-zinc-350 pr-1">
                <p className="font-bold">Aarav Sharma</p>
                <p className="text-zinc-500">Software Eng.</p>
              </div>
            </motion.div>

            {/* Avatar 2 */}
            <motion.div 
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl flex items-center gap-2"
            >
              <div className="h-8 w-8 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-xs text-rose-400 font-bold">
                F
              </div>
              <div className="text-[10px] text-zinc-350 pr-1">
                <p className="font-bold">Priya Patel</p>
                <p className="text-zinc-500">Data Analyst</p>
              </div>
            </motion.div>

            {/* Compatibility Badge floating in center */}
            <motion.div 
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute bg-gradient-rose-peach text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg shadow-rose-500/30 border border-rose-400/30 z-20 flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3 fill-white/20" />
              <span>91% MATCH</span>
            </motion.div>
          </div>
        </div>

        {/* Left Panel Footer Stats */}
        <div className="grid grid-cols-3 gap-6 relative z-10 border-t border-zinc-900 pt-8">
          <div className="space-y-1">
            <p className="text-lg font-bold text-white tracking-tight">12,400+</p>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Unions Made</p>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-rose-400 tracking-tight">86.2%</p>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Pairing Accuracy</p>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-white tracking-tight">&lt; 1.4s</p>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">AI Evaluation</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Glowing dark responsive auth card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-zinc-950 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Logo Header (Visible on Mobile Only) */}
          <div className="text-center space-y-2 lg:hidden">
            <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-rose-peach items-center justify-center shadow-lg shadow-rose-500/20">
              <Heart className="h-6 w-6 text-white fill-white/10" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Welcome back to MatchFlow
            </h2>
            <p className="text-sm text-zinc-400">
              Elite Relationship Consulting & CRM
            </p>
          </div>

          {/* Desktop welcome header */}
          <div className="hidden lg:block space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-zinc-100 to-rose-200 bg-clip-text text-transparent">
              Access the Workspace
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Log in to view client dossiers, verify compatibility scoring curves, and dispatch proposal emails.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/80 rounded-[32px] p-8 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Card inner decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-500/5 to-transparent rounded-bl-3xl pointer-events-none" />

            <form action={formAction} className="space-y-5">
              
              {/* Error Message */}
              {state?.error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-2xl text-xs font-semibold leading-relaxed text-center flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-rose-500 flex-shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Matchmaker Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 transition-colors duration-200" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@tdc.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-rose-500/50 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500/30 text-white placeholder-zinc-600 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Password
                  </label>
                  <Link href="#" className="text-[10px] font-bold text-rose-450 hover:text-rose-400 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 transition-colors duration-200" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 focus:border-rose-500/50 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500/30 text-white placeholder-zinc-600 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending || loadingDemo}
                className="w-full py-4 px-4 bg-gradient-rose-peach hover:shadow-lg hover:shadow-rose-500/20 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                {isPending && !loadingDemo ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <>
                    <span>Enter Platform Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800/80" />
                </div>
                <span className="relative px-3 bg-zinc-950 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                  Quick Access
                </span>
              </div>

              {/* Demo Access Button styled as helper */}
              <button
                onClick={handleDemoClick}
                type="button"
                disabled={isPending || loadingDemo}
                className="w-full py-4 px-4 bg-zinc-950/40 hover:bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer disabled:opacity-50"
              >
                {loadingDemo ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-rose-400" />
                    <span className="text-rose-400">Instantiating Mock Mode...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4.5 w-4.5 text-rose-400 fill-rose-400/10" />
                    <span>Run in Consultant Demo Mode</span>
                  </>
                )}
              </button>
            </form>

            {/* Recruiter helper box */}
            <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 space-y-2 relative overflow-hidden">
              <div className="absolute right-3 top-3">
                <HeartHandshake className="h-4 w-4 text-rose-500/20" />
              </div>
              <h4 className="text-[9px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
                Recruiter Credentials (Auto-filled)
              </h4>
              <div className="text-[11px] text-zinc-400 grid grid-cols-2 gap-2">
                <p><span className="font-semibold text-zinc-500 block text-[9px] uppercase tracking-wider">Email</span>demo@tdc.com</p>
                <p><span className="font-semibold text-zinc-500 block text-[9px] uppercase tracking-wider">Password</span>Demo@123</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-zinc-500">
            Authorized consultants only. Need credentials?{" "}
            <Link href="/signup" className="text-rose-400 hover:underline font-semibold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
