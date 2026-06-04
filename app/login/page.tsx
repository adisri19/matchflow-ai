"use client";

import { useActionState, useState, useEffect, startTransition } from "react";
import { login, AuthState } from "../actions/auth";
import Link from "next/link";
import { Heart, Sparkles, User, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
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
    <main className="min-h-screen bg-gradient-peach-rose-light flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Rings/Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-rose-200/20 dark:bg-rose-950/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-peach-200/20 dark:bg-amber-950/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Logo Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-rose-peach items-center justify-center shadow-lg shadow-rose-500/20">
            <Heart className="h-6 w-6 text-white fill-white/10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
            Welcome back to MatchFlow
          </h2>
          <p className="text-sm text-muted-foreground">
            Elite Relationship Consulting & CRM
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-8 shadow-xl shadow-rose-100/10">
          <form action={formAction} className="space-y-4">
            
            {/* Error Message */}
            {state?.error && (
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400 p-3.5 rounded-2xl text-xs font-semibold leading-relaxed text-center">
                {state.error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                Matchmaker Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@tdc.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-zinc-900/50 border border-rose-50 dark:border-zinc-900 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 dark:focus:ring-rose-900 text-slate-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                  Password
                </label>
                <Link href="#" className="text-[10px] font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-zinc-900/50 border border-rose-50 dark:border-zinc-900 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 dark:focus:ring-rose-900 text-slate-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || loadingDemo}
              className="w-full py-3.5 px-4 bg-gradient-rose-peach hover:shadow-lg hover:shadow-rose-500/20 text-white rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending && !loadingDemo ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <>
                  <span>Sign In to CRM</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative py-2 flex items-center">
              <div className="flex-grow border-t border-slate-100 dark:border-zinc-900" />
              <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                Or Quick Test
              </span>
              <div className="flex-grow border-t border-slate-100 dark:border-zinc-900" />
            </div>

            {/* Demo Access Button */}
            <button
              onClick={handleDemoClick}
              type="button"
              disabled={isPending || loadingDemo}
              className="w-full py-3.5 px-4 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-rose-100/50 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loadingDemo ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin text-rose-500" />
                  <span className="text-rose-500">Launching Demo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5 text-rose-500" />
                  <span>Continue with Demo Account</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Card */}
          <div className="mt-6 bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/30 rounded-2xl p-4 space-y-1.5">
            <h4 className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              Recruiter Demo Access
            </h4>
            <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-0.5">
              <p><span className="font-semibold w-16 inline-block text-slate-400">Email:</span> demo@tdc.com</p>
              <p><span className="font-semibold w-16 inline-block text-slate-400">Password:</span> Demo@123</p>
            </div>
            <p className="text-[9px] text-slate-400 dark:text-zinc-500 pt-1 leading-relaxed">
              *The demo account is automatically registered on first launch.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 dark:text-zinc-400">
          Authorized team only. Need an account?{" "}
          <Link href="/signup" className="text-rose-500 hover:underline font-semibold">
            Apply Access
          </Link>
        </p>
      </div>
    </main>
  );
}
