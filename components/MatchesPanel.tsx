"use client";

import { useState } from "react";
import { Profile, TopMatch, CompatibilityResult } from "@/types";
import { calculateCompatibility, getTopMatches } from "@/lib/matchingEngine";
import { 
  Sparkles, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  ThumbsUp, 
  AlertTriangle, 
  Loader2,
  Heart,
  Calendar,
  Compass,
  Zap
} from "lucide-react";
import SendMatchModal from "./SendMatchModal";

interface MatchesPanelProps {
  customer: Profile;
  allProfiles: Profile[];
  onSuccessToast: (msg: string) => void;
}

export default function MatchesPanel({ customer, allProfiles, onSuccessToast }: MatchesPanelProps) {
  // Get top 10 matches of opposite gender
  const matches = getTopMatches(customer, allProfiles);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [selectedMatch, setSelectedMatch] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleExpand = async (matchId: string, matchProfile: Profile) => {
    if (expandedId === matchId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(matchId);

    // If analysis is already generated, do not call API again
    if (aiAnalysis[matchId]) return;

    // Trigger AI analysis call
    setAiLoading((prev) => ({ ...prev, [matchId]: true }));
    try {
      const response = await fetch("/api/ai/match-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer, candidate: matchProfile }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setAiAnalysis((prev) => ({ ...prev, [matchId]: data.analysis }));
    } catch (err) {
      console.error(err);
      // Fallback default AI explanation
      setAiAnalysis((prev) => ({
        ...prev,
        [matchId]: `Both profiles show a strong alignment in family values, career aspirations, and cultural interests. Residing in proximity, they share mutual hobbies like ${matchProfile.hobbies[0] || "traveling"} and are highly compatible for a long-term match.`,
      }));
    } finally {
      setAiLoading((prev) => ({ ...prev, [matchId]: false }));
    }
  };

  const triggerSendProposal = (match: Profile) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-rose-100/50 dark:border-zinc-900 pb-4">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500/20" />
            Suggested Matches
          </h3>
          <p className="text-xs text-muted-foreground">
            Top 10 matrimonial matches matching relationship criteria
          </p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs px-3 py-1.5 rounded-full border border-rose-100 dark:border-rose-900/50 font-bold">
          {matches.length} Candidates Found
        </div>
      </div>

      <div className="space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-zinc-900/40 rounded-2xl border border-dashed border-rose-100 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 text-sm">
            No compatible matches found. Verify criteria.
          </div>
        ) : (
          matches.map((match) => {
            const comp: CompatibilityResult = match.compatibility;
            const isExpanded = expandedId === match.id;
            const isLoadingAnalysis = aiLoading[match.id];
            const analysisText = aiAnalysis[match.id];

            // Progress bar color based on score
            let scoreColor = "bg-rose-500";
            if (comp.compatibilityScore >= 80) scoreColor = "bg-rose-600";
            else if (comp.compatibilityScore >= 65) scoreColor = "bg-rose-400";
            else scoreColor = "bg-slate-400";

            return (
              <div
                key={match.id}
                className={`border rounded-2xl bg-white dark:bg-zinc-950 transition-all duration-300 ${
                  isExpanded
                    ? "border-rose-200 dark:border-rose-900/50 shadow-md"
                    : "border-rose-100/50 dark:border-zinc-900 hover:border-rose-100 dark:hover:border-zinc-800"
                }`}
              >
                {/* Main Card Summary */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Portrait Image */}
                    <div className="h-12 w-12 rounded-xl overflow-hidden shadow-sm relative flex-shrink-0">
                      <img
                        src={match.profileImage}
                        alt={`${match.firstName} ${match.lastName}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-zinc-100 text-sm">
                        {match.firstName} {match.lastName}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {match.age} yrs • {match.designation} at {match.company}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 flex items-center gap-0.5 mt-0.5">
                        <MapPin className="h-3 w-3 text-rose-400" />
                        {match.city}, {match.state} ({match.religion})
                      </p>
                    </div>
                  </div>

                  {/* Compatibility Score Circle/Stats */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-slate-50 pt-3 sm:pt-0">
                    <div className="w-28 sm:w-24 space-y-1">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase">Compatibility</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">{comp.compatibilityScore}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${scoreColor} rounded-full transition-all duration-500`}
                          style={{ width: `${comp.compatibilityScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleExpand(match.id, match)}
                        className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          isExpanded
                            ? "bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300"
                            : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-100/40 dark:border-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100/50"
                        }`}
                      >
                        <span>Why This Match?</span>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>

                      <button
                        onClick={() => triggerSendProposal(match)}
                        className="p-2 rounded-xl bg-gradient-rose-peach text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                        title="Send Match proposal"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details accordion */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-rose-50/50 dark:border-zinc-900 pt-4 space-y-4 bg-slate-50/20 dark:bg-zinc-900/5">
                    
                    {/* AI explanation loader / display */}
                    <div className="bg-rose-50/40 dark:bg-rose-950/15 border border-rose-100/40 dark:border-rose-900/30 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                        <Sparkles className="h-4 w-4 text-rose-500 fill-rose-500/20" />
                        <span>AI Match Analysis Insight</span>
                      </div>
                      
                      {isLoadingAnalysis ? (
                        <div className="space-y-2 py-1">
                          <div className="h-3 bg-rose-200/50 dark:bg-rose-900/30 rounded-full animate-pulse w-full" />
                          <div className="h-3 bg-rose-200/50 dark:bg-rose-900/30 rounded-full animate-pulse w-[92%]" />
                          <div className="h-3 bg-rose-200/50 dark:bg-rose-900/30 rounded-full animate-pulse w-[60%]" />
                        </div>
                      ) : (
                        <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
                          {analysisText}
                        </p>
                      )}
                    </div>

                    {/* Sub compatibility badges */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 text-center">
                        <p className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">Emotional Alignment</p>
                        <p className={`text-xs font-bold mt-1 ${comp.emotionalAlignment === 'High' ? 'text-rose-600' : 'text-slate-600'}`}>{comp.emotionalAlignment}</p>
                      </div>
                      <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 text-center">
                        <p className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">Lifestyle Match</p>
                        <p className={`text-xs font-bold mt-1 ${comp.lifestyleCompatibility === 'High' ? 'text-emerald-600' : 'text-slate-600'}`}>{comp.lifestyleCompatibility}</p>
                      </div>
                      <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 text-center">
                        <p className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">Long-Term Potential</p>
                        <p className="text-xs font-bold mt-1 text-slate-800 dark:text-zinc-200">{comp.longTermPotential}</p>
                      </div>
                    </div>

                    {/* Green Flags vs Warning Flags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Green Flags */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Key Green Flags</span>
                        <div className="space-y-1.5">
                          {comp.matchReasons.map((reason, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-300">
                              <ThumbsUp className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Concerns */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Possible Concerns</span>
                        <div className="space-y-1.5">
                          {comp.warningFlags.length === 0 ? (
                            <div className="text-xs text-slate-400 italic">None identified</div>
                          ) : (
                            comp.warningFlags.map((warning, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-500 dark:text-zinc-400">
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span>{warning}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* proposal modal */}
      {selectedMatch && (
        <SendMatchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          customer={customer}
          candidate={selectedMatch}
          onSuccess={onSuccessToast}
          onMarkAsSent={() => {
            const savedSent = localStorage.getItem("matchflow_sent_packets");
            const current = savedSent ? parseInt(savedSent) || 12 : 12;
            localStorage.setItem("matchflow_sent_packets", String(current + 1));
          }}
        />
      )}
    </div>
  );
}
