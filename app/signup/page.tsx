"use client";

import { useActionState, useState } from "react";
import { signup, AuthState } from "../actions/auth";
import Link from "next/link";
import { isAllowed } from "@/lib/allowedUsers";
import { Heart, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signup, {});
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Client-side validation for allowlist before submitting
    if (!isAllowed(email)) {
      e.preventDefault();
      setLocalError("Access restricted to authorized matchmakers.");
      return;
    }
    setLocalError(null);
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
            Apply for Consultant Access
          </h2>
          <p className="text-sm text-muted-foreground">
            Join our elite matchmaking consultation network
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-8 shadow-xl shadow-rose-100/10">
          <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Message */}
            {(localError || state?.error) && (
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400 p-3.5 rounded-2xl text-xs font-semibold leading-relaxed text-center">
                {localError || state?.error}
              </div>
            )}

            {state?.success && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-2xl text-xs font-semibold leading-relaxed text-center">
                Account created successfully! Redirecting...
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                Authorized Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@tdc.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLocalError(null);
                  }}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-zinc-900/50 border border-rose-50 dark:border-zinc-900 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 dark:focus:ring-rose-900 text-slate-800 dark:text-zinc-200"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-relaxed">
                *Only pre-approved team domains/addresses in our directory list can register.
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-zinc-900/50 border border-rose-50 dark:border-zinc-900 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 dark:focus:ring-rose-900 text-slate-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-type password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 dark:bg-zinc-900/50 border border-rose-50 dark:border-zinc-900 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-rose-400 dark:focus:ring-rose-900 text-slate-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-4 bg-gradient-rose-peach hover:shadow-lg hover:shadow-rose-500/20 text-white rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <>
                  <span>Submit Application</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Secure System Notice */}
          <div className="mt-6 border-t border-slate-100 dark:border-zinc-900 pt-4 flex gap-3 text-slate-400 dark:text-zinc-500">
            <ShieldCheck className="h-5 w-5 text-rose-400 flex-shrink-0" />
            <div className="text-[10px] leading-relaxed">
              <p className="font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Secure Access Control</p>
              <p>Authentication logs and access key codes are audited by MatchFlow system security. Unauthorized login attempts are restricted.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 dark:text-zinc-400">
          Already have consultant access?{" "}
          <Link href="/login" className="text-rose-500 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
