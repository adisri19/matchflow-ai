"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/types";
import { X, Sparkles, Send, AlertCircle, Loader2, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SendMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Profile;
  candidate: Profile;
  onSuccess: (message: string) => void;
  onMarkAsSent: () => void;
}

export default function SendMatchModal({
  isOpen,
  onClose,
  customer,
  candidate,
  onSuccess,
  onMarkAsSent,
}: SendMatchModalProps) {
  const [loading, setLoading] = useState(true);
  const [introText, setIntroText] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchIntro() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/ai/generate-intro", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customer, candidate }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to generate AI introduction.");
        }

        const text = data.intro;
        const subjectMatch = text.match(/Subject:\s*(.*)/i);
        if (subjectMatch) {
          setSubject(subjectMatch[1]);
          setIntroText(text.replace(/Subject:\s*.*\n*/i, "").trim());
        } else {
          setSubject(`Match Introduction: ${candidate.firstName} & ${customer.firstName}`);
          setIntroText(text);
        }
      } catch (err: any) {
        console.error(err);
        // Fallback introduction if API fails (e.g. no API key configured)
        setSubject(`Premium Matrimonial Recommendation: Introducing ${candidate.firstName}`);
        setIntroText(
          `Dear ${customer.firstName},\n\nI hope this email finds you well. As your relationship consultant, I have identified a match that aligns beautifully with your aspirations. \n\n${candidate.firstName} (${candidate.age}, ${candidate.city}) is a talented ${candidate.designation} at ${candidate.company}. Upon review, we believe both of you align exceptionally well on family values, career aspirations, and hobbies like ${candidate.hobbies[0]}.\n\nI would love to arrange a brief introductory call if you are open to this. Let me know your thoughts.\n\nWarm regards,\nYour Matchmaking Consultant`
        );
        setError("Could not load AI generation (using default consultant draft).");
      } finally {
        setLoading(false);
      }
    }

    fetchIntro();
  }, [isOpen, customer, candidate]);

  const handleCopy = () => {
    const textToCopy = `Subject: ${subject}\n\n${introText}`;
    navigator.clipboard.writeText(textToCopy);
    onSuccess("Proposal email copied to clipboard!");
  };

  const handleMarkAsSent = () => {
    onMarkAsSent();
    onSuccess(`Match proposal marked as sent to ${customer.firstName} and ${candidate.firstName}!`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-zinc-950 rounded-3xl border border-rose-100 dark:border-zinc-800 shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-rose-50 dark:border-zinc-900 flex items-center justify-between bg-gradient-to-r from-rose-50/30 to-peach-50/20 dark:from-zinc-900/30">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <Sparkles className="h-4.5 w-4.5 text-rose-505" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-zinc-100">
                  AI Match Proposal Review
                </h3>
                <p className="text-xs text-muted-foreground">
                  Review & dispatch customized match email
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-rose-50 dark:hover:bg-zinc-900 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="relative flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-rose-500 animate-spin" />
                  <Heart className="h-4 w-4 text-rose-300 absolute animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    Drafting personalized proposal...
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Our AI is analyzing profiles to generate a warm, customized relationship introduction.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Error Banner / Notification if fallback used */}
                {error && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-2xl p-4 flex gap-3 text-amber-800 dark:text-amber-400">
                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold">Demo Notice</p>
                      <p className="text-[11px] leading-relaxed">{error}</p>
                    </div>
                  </div>
                )}

                {/* Email Client Mockup */}
                <div className="border border-rose-100 dark:border-zinc-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-zinc-900/10">
                  <div className="bg-slate-50 dark:bg-zinc-900 p-4 border-b border-rose-50 dark:border-zinc-800 space-y-2 text-xs">
                    <div className="flex">
                      <span className="w-16 text-slate-400 dark:text-zinc-500 font-medium">To:</span>
                      <span className="font-semibold text-slate-700 dark:text-zinc-200">
                        {customer.firstName} {customer.lastName} ({customer.email})
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-16 text-slate-400 dark:text-zinc-500 font-medium">Cc:</span>
                      <span className="font-medium text-slate-500 dark:text-zinc-400">
                        matchmaker-records@tdc.com
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-16 text-slate-400 dark:text-zinc-500 font-medium">Subject:</span>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none font-semibold text-slate-800 dark:text-zinc-100 p-0 focus:ring-0"
                      />
                    </div>
                  </div>
                  <div className="p-5">
                    <textarea
                      value={introText}
                      onChange={(e) => setIntroText(e.target.value)}
                      rows={10}
                      className="w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed text-slate-700 dark:text-zinc-300 p-0 focus:ring-0 font-sans focus:outline-none"
                    />
                  </div>
                </div>

                {/* Match Summary Indicator */}
                <div className="flex items-center gap-4 bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/30 dark:border-rose-900/20 rounded-2xl p-4">
                  <div className="flex -space-x-3 flex-shrink-0">
                    <img
                      src={customer.profileImage}
                      alt={customer.firstName}
                      className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-zinc-950"
                    />
                    <img
                      src={candidate.profileImage}
                      alt={candidate.firstName}
                      className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-zinc-950"
                    />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-700 dark:text-zinc-300">
                      Sending compatibility packet
                    </p>
                    <p className="text-muted-foreground mt-0.5">
                      Both candidates will be notified and sent each other&apos;s formatted bios.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-rose-50 dark:border-zinc-900 flex justify-end gap-3 bg-slate-50/50 dark:bg-zinc-900/10">
            <button
              onClick={handleCopy}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-rose-100 dark:border-zinc-800 text-rose-600 dark:text-rose-455 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>Copy Email</span>
            </button>
            <button
              onClick={handleMarkAsSent}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-rose-peach hover:shadow-lg hover:shadow-rose-500/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none border-none"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Mark as Sent</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
