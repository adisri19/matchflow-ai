"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import CustomerCard from "@/components/CustomerCard";
import { ProfileService } from "@/services/profileService";
import { Profile, CompatibilityResult } from "@/types";
import { calculateCompatibility } from "@/lib/matchingEngine";
import { 
  Search, 
  Filter, 
  Sparkles, 
  Users, 
  Heart, 
  CheckCircle2, 
  X,
  FileSpreadsheet,
  AlertCircle,
  Layers,
  Grid,
  MapPin,
  Briefcase,
  ThumbsUp,
  AlertTriangle,
  ArrowUpRight,
  RotateCcw,
  UserCheck,
  Undo,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

// Helper Swipe Card Component
interface SwipeCardProps {
  candidate: Profile;
  focusClient: Profile;
  compatibility: CompatibilityResult;
  onSwipe: (direction: "left" | "right") => void;
  onViewProfile: (id: string) => void;
}

function SwipeCard({ candidate, focusClient, compatibility, onSwipe, onViewProfile }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -120, 0, 120, 200], [0.6, 1, 1, 1, 0.6]);
  
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  return (
    <motion.div
      key={candidate.id}
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => {
        const threshold = 120;
        if (info.offset.x > threshold) {
          onSwipe("right");
        } else if (info.offset.x < -threshold) {
          onSwipe("left");
        }
      }}
      className="absolute inset-0 bg-white dark:bg-zinc-900 border border-rose-100/50 dark:border-zinc-800 rounded-[32px] shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing flex flex-col z-10"
    >
      {/* Visual Drag Overlays */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 left-8 border-4 border-emerald-500 text-emerald-500 font-extrabold uppercase text-xs px-4 py-1.5 rounded-xl rotate-[-10deg] z-30 bg-white dark:bg-zinc-950 pointer-events-none tracking-wider"
      >
        Compatible
      </motion.div>

      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 right-8 border-4 border-rose-500 text-rose-500 font-extrabold uppercase text-xs px-4 py-1.5 rounded-xl rotate-[10deg] z-30 bg-white dark:bg-zinc-950 pointer-events-none tracking-wider"
      >
        Pass
      </motion.div>

      {/* Main Body - Split Image & Info */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto select-none">
        
        {/* Left Side: Photo & Quick Tags */}
        <div className="w-full md:w-[40%] bg-slate-50 dark:bg-zinc-950 border-r border-rose-50/50 dark:border-zinc-900 flex flex-col relative h-[250px] md:h-auto">
          <div className="flex-1 relative overflow-hidden">
            <img
              src={candidate.profileImage}
              alt={`${candidate.firstName} ${candidate.lastName}`}
              className="absolute inset-0 w-full h-full object-cover"
              draggable="false"
            />
            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Floating Compatibility circle on image */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-rose-500/30">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] text-zinc-350 font-bold uppercase tracking-wider">
                {compatibility.compatibilityScore}% Compatibility
              </span>
            </div>
          </div>
          
          {/* Quick Stats list */}
          <div className="p-4 space-y-2 text-xs bg-slate-50 dark:bg-zinc-950">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
              <MapPin className="h-3.5 w-3.5 text-rose-400 flex-shrink-0" />
              <span className="truncate">{candidate.city}, {candidate.state}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
              <Briefcase className="h-3.5 w-3.5 text-rose-400 flex-shrink-0" />
              <span className="truncate">{candidate.designation} at {candidate.company}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-rose-100/30 dark:border-zinc-900/50 text-[10px] text-slate-400 font-medium">
              <div>
                <p>INCOME</p>
                <p className="font-bold text-slate-800 dark:text-zinc-200">{candidate.income} LPA</p>
              </div>
              <div>
                <p>HEIGHT</p>
                <p className="font-bold text-slate-800 dark:text-zinc-200">{candidate.height} cm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Dossier Details, Flags */}
        <div className="flex-1 p-6 md:p-8 space-y-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            
            {/* Header info */}
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
                  {candidate.firstName} {candidate.lastName}
                </h3>
                <span className="text-sm font-semibold text-slate-400 dark:text-zinc-500">
                  {candidate.age} yrs • {candidate.gender}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-bold mt-0.5">
                {candidate.religion} • {candidate.caste} • {candidate.maritalStatus}
              </p>
            </div>

            {/* About Bio */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Advisor Bio Summary</span>
              <p className="text-xs text-slate-600 dark:text-zinc-355 leading-relaxed font-medium">
                &ldquo;{candidate.bio}&rdquo;
              </p>
            </div>

            {/* Matrix Parameters grid */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-zinc-900/40 p-3 rounded-2xl border border-rose-50/20 dark:border-zinc-900/40 text-[10px]">
              <div>
                <span className="text-slate-450 block">Wants Kids</span>
                <span className="font-bold text-slate-700 dark:text-zinc-200">{candidate.wantsKids}</span>
              </div>
              <div>
                <span className="text-slate-455 block">Relocate</span>
                <span className="font-bold text-slate-700 dark:text-zinc-200">{candidate.openToRelocate}</span>
              </div>
              <div>
                <span className="text-slate-450 block">Open to Pets</span>
                <span className="font-bold text-slate-700 dark:text-zinc-200">{candidate.openToPets}</span>
              </div>
            </div>

            {/* Hobbies / Interests */}
            <div className="space-y-1">
              <span className="text-[9px] text-slate-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">Hobbies &amp; Interests</span>
              <div className="flex flex-wrap gap-1">
                {candidate.hobbies.map((h, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-2 py-0.5 rounded-lg border border-slate-200/30 dark:border-zinc-800">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Green Flags vs Warning Flags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-rose-50/50 dark:border-zinc-900/50">
              
              {/* Green Flags */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">Compatibility Strengths</span>
                <div className="space-y-1">
                  {compatibility.matchReasons.slice(0, 3).map((r, i) => (
                    <div key={i} className="flex items-start gap-1 text-[10px] text-slate-600 dark:text-zinc-350">
                      <ThumbsUp className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning Flags */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">Potential Friction Points</span>
                <div className="space-y-1">
                  {compatibility.warningFlags.length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic">None identified</p>
                  ) : (
                    compatibility.warningFlags.slice(0, 3).map((w, i) => (
                      <div key={i} className="flex items-start gap-1 text-[10px] text-slate-550 dark:text-zinc-400">
                        <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{w}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Bottom controls inside card */}
          <div className="flex items-center justify-between border-t border-rose-50/50 dark:border-zinc-900/50 pt-4 text-xs font-semibold text-slate-450">
            <span>Client ID: {candidate.id}</span>
            <button
              onClick={() => onViewProfile(candidate.id)}
              className="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-0.5 cursor-pointer bg-transparent border-none"
            >
              <span>View Full Dossier</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filtered, setFiltered] = useState<Profile[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [religions, setReligions] = useState<string[]>([]);

  // Page View Mode (Swiper vs Directory list)
  const [viewMode, setViewMode] = useState<"swiper" | "directory">("swiper");

  // Swiper focus states
  const [focusClient, setFocusClient] = useState<Profile | null>(null);
  const [searchFocusQuery, setSearchFocusQuery] = useState("");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [swipedCandidateHistory, setSwipedCandidateHistory] = useState<Record<string, string[]>>({});
  const [localProposalsCount, setLocalProposalsCount] = useState(0);

  // Directory Filter States
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

      // Auto-set the first profile as default focus client
      if (allProfiles.length > 0) {
        setFocusClient(allProfiles[0]);
      }

      const uniqueCities = await ProfileService.getUniqueCities();
      setCities(uniqueCities);

      const uniqueReligions = await ProfileService.getUniqueReligions();
      setReligions(uniqueReligions);
    }
    loadData();

    // Load local proposals count
    const savedProposals = localStorage.getItem("matchflow_proposals");
    if (savedProposals) {
      const list = JSON.parse(savedProposals);
      setLocalProposalsCount(list.length);
    }
  }, []);

  // Handle Filtering on change (Directory mode)
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

  // Mock Top Match scores for clients
  const getMockTopScore = (id: string) => {
    const num = parseInt(id.replace(/\D/g, "")) || 0;
    return 70 + (num % 26);
  };

  // Calculate candidates for Swiper
  const getSwiperCandidates = () => {
    if (!focusClient) return [];
    
    // Filter opposite gender
    const oppositeGenderPool = profiles.filter(
      (p) => p.id !== focusClient.id && p.gender !== focusClient.gender
    );

    // Compute compatibility scores
    const evaluated = oppositeGenderPool.map((p) => {
      const compatibility = calculateCompatibility(focusClient, p);
      return {
        ...p,
        compatibility,
      };
    });

    // Sort by compatibility descending
    const sorted = evaluated.sort(
      (a, b) => b.compatibility.compatibilityScore - a.compatibility.compatibilityScore
    );

    // Exclude swiped candidates
    const focusSwipedHistory = swipedCandidateHistory[focusClient.id] || [];
    return sorted.filter((c) => !focusSwipedHistory.includes(c.id));
  };

  const candidates = getSwiperCandidates();
  const currentCandidate = candidates[activeCardIndex];
  const nextCandidate = candidates[activeCardIndex + 1];

  const handleRecordProposal = (candidate: Profile) => {
    if (!focusClient) return;
    const matchPairKey = `${focusClient.id}_to_${candidate.id}`;
    
    const savedProposals = localStorage.getItem("matchflow_proposals");
    const proposalsList = savedProposals ? JSON.parse(savedProposals) : [];
    if (!proposalsList.includes(matchPairKey)) {
      proposalsList.push(matchPairKey);
      localStorage.setItem("matchflow_proposals", JSON.stringify(proposalsList));
      setLocalProposalsCount(proposalsList.length);
    }
    
    showToast(`Proposal Sent! match proposed between ${focusClient.firstName} and ${candidate.firstName}.`);
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (!focusClient || !currentCandidate) return;

    // Save swiped candidate history locally
    const focusSwiped = swipedCandidateHistory[focusClient.id] || [];
    const updatedHistory = {
      ...swipedCandidateHistory,
      [focusClient.id]: [...focusSwiped, currentCandidate.id]
    };
    setSwipedCandidateHistory(updatedHistory);

    if (direction === "right") {
      handleRecordProposal(currentCandidate);
    }

    // Reset card translation value/index increments
    setActiveCardIndex(0);
  };

  const resetSwipes = () => {
    if (!focusClient) return;
    setSwipedCandidateHistory({
      ...swipedCandidateHistory,
      [focusClient.id]: []
    });
    setActiveCardIndex(0);
    showToast(`Swiping pool restarted for ${focusClient.firstName}!`);
  };

  // Filter Focus Clients List based on sidebar search
  const filteredFocusClients = profiles.filter((p) => {
    const term = `${p.firstName} ${p.lastName} ${p.designation} ${p.company} ${p.city} ${p.religion}`.toLowerCase();
    return term.includes(searchFocusQuery.toLowerCase());
  });

  const handleViewProfile = (id: string) => {
    window.open(`/dashboard/profile/${id}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8 space-y-8 flex flex-col min-h-screen">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-rose-100/50 dark:border-zinc-900 shadow-sm relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-rose-100/30 dark:from-rose-950/10 to-transparent rounded-full pointer-events-none" />
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
              <Sparkles className="h-4.5 w-4.5 fill-rose-500/10 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Consultant Workspace</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
              Elite Matrimonial Matching Center
            </h2>
            <p className="text-xs text-muted-foreground">
              Review relationship profiles, analyze algorithmic compatibility, and manage active match proposals.
            </p>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            {/* View Mode Toggle Pill */}
            <div className="bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-2xl inline-flex gap-1 border border-rose-100/10">
              <button
                onClick={() => setViewMode("swiper")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "swiper"
                    ? "bg-white dark:bg-zinc-800 text-rose-500 shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200"
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Swipe Matcher</span>
              </button>
              <button
                onClick={() => setViewMode("directory")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "directory"
                    ? "bg-white dark:bg-zinc-800 text-rose-500 shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200"
                }`}
              >
                <Grid className="h-4 w-4" />
                <span>All Dossiers</span>
              </button>
            </div>

            <button 
              onClick={() => showToast("Exporting client log spreadsheet...")}
              className="px-4 py-3 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-850 text-slate-700 dark:text-zinc-300 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          
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
              <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Matches Proposed</span>
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-zinc-950 flex items-center justify-center text-rose-500">
                <Heart className="h-4.5 w-4.5 fill-rose-550/10" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-zinc-100">
                {74 + localProposalsCount}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Real-time proposals active</p>
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

        {/* SWIPER MODE VIEW */}
        {viewMode === "swiper" && (
          <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[500px]">
            
            {/* Left Panel: Searchable Focus Clients list */}
            <div className="w-full lg:w-[320px] shrink-0 bg-white dark:bg-zinc-900/40 border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-4 flex flex-col h-[300px] lg:h-[620px] overflow-hidden">
              <div className="pb-3 border-b border-rose-50 dark:border-zinc-900/50 space-y-2 shrink-0">
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                  Select Focus Client
                </span>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search focus clients..."
                    value={searchFocusQuery}
                    onChange={(e) => setSearchFocusQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50/50 dark:bg-zinc-900 border border-rose-50/30 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-400 text-slate-800 dark:text-zinc-200"
                  />
                </div>
              </div>

              {/* Scrollable Focus Clients */}
              <div className="flex-1 overflow-y-auto pt-3 space-y-1.5 pr-1">
                {filteredFocusClients.map((client) => {
                  const isFocus = focusClient?.id === client.id;
                  return (
                    <button
                      key={client.id}
                      onClick={() => {
                        setFocusClient(client);
                        setActiveCardIndex(0);
                      }}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                        isFocus
                          ? "bg-rose-50/55 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50 shadow-sm"
                          : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-zinc-900/50"
                      }`}
                    >
                      <div className="h-9 w-9 rounded-xl overflow-hidden shadow-sm relative shrink-0">
                        <img
                          src={client.profileImage}
                          alt={`${client.firstName}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex justify-between items-baseline">
                          <p className={`text-xs font-bold truncate ${isFocus ? 'text-rose-600 dark:text-rose-455' : 'text-slate-700 dark:text-zinc-200'}`}>
                            {client.firstName} {client.lastName}
                          </p>
                          <span className="text-[9px] text-slate-400 dark:text-zinc-550 shrink-0 font-medium">
                            {client.age} • {client.gender[0]}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate mt-0.5">
                          {client.designation}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Panel: Tinder Swiper Workspace */}
            <div className="flex-1 bg-white dark:bg-zinc-900/40 border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-6 flex flex-col justify-between h-[600px] lg:h-[620px] relative overflow-hidden">
              
              {/* Focus Banner */}
              {focusClient && (
                <div className="flex items-center justify-between pb-3 border-b border-rose-50/50 dark:border-zinc-900/50 shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-450 dark:text-zinc-400 uppercase tracking-wider block">
                      Pairing Candidates For:
                    </span>
                    <span className="text-xs font-bold text-rose-500 dark:text-rose-400 bg-rose-50/55 dark:bg-rose-950/40 px-3 py-1 rounded-xl border border-rose-100/30 dark:border-rose-900/20">
                      {focusClient.firstName} {focusClient.lastName} ({focusClient.age} yrs • {focusClient.gender})
                    </span>
                  </div>

                  <button
                    onClick={() => handleViewProfile(focusClient.id)}
                    className="text-xs font-bold text-slate-500 hover:text-rose-500 flex items-center gap-0.5 cursor-pointer bg-transparent border-none"
                  >
                    <span>Edit Profile Notes</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Swiper Stack */}
              <div className="flex-1 flex items-center justify-center py-6 relative">
                {focusClient && currentCandidate ? (
                  <div className="relative w-full max-w-[620px] h-full">
                    {/* Depth Card 2 */}
                    {nextCandidate && (
                      <div className="absolute inset-0 bg-white dark:bg-zinc-900 border border-rose-100/20 dark:border-zinc-800/80 rounded-[32px] shadow-lg select-none pointer-events-none scale-[0.96] translate-y-3 opacity-60 flex z-0 overflow-hidden">
                        <div className="w-[40%] bg-slate-100/40 dark:bg-zinc-950/60 border-r border-rose-50/10 h-full" />
                        <div className="flex-1 p-6 space-y-4" />
                      </div>
                    )}

                    {/* Active Swiping Card */}
                    <SwipeCard
                      key={currentCandidate.id}
                      candidate={currentCandidate}
                      focusClient={focusClient}
                      compatibility={currentCandidate.compatibility}
                      onSwipe={handleSwipe}
                      onViewProfile={handleViewProfile}
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-4 max-w-sm">
                    <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center text-rose-500 mx-auto border border-rose-150/40 dark:border-rose-900/30 animate-pulse">
                      <Heart className="h-8 w-8 fill-rose-500/10" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-sm">
                        No Candidates Left in Swiper Stack
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {focusClient 
                          ? `You have swiped through all available opposite-gender candidates for ${focusClient.firstName}.`
                          : "Please select a focus client from the left menu to view candidate profiles."
                        }
                      </p>
                    </div>
                    {focusClient && (
                      <button
                        onClick={resetSwipes}
                        className="px-4 py-2 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto transition-all cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Restart Swiping Pool</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Swipe Action Buttons below Stack */}
              {focusClient && currentCandidate && (
                <div className="flex justify-center items-center gap-6 shrink-0 py-2">
                  
                  {/* Pass Button (Swipe Left) */}
                  <button
                    onClick={() => handleSwipe("left")}
                    className="h-12 w-12 rounded-full border border-rose-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center transition-all cursor-pointer"
                    title="Pass (Swipe Left)"
                  >
                    <X className="h-6 w-6 stroke-[2.5px]" />
                  </button>

                  {/* Reset Pool Button */}
                  <button
                    onClick={resetSwipes}
                    className="h-10 w-10 rounded-full border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center transition-all cursor-pointer"
                    title="Reset swiped history for this client"
                  >
                    <RotateCcw className="h-4.5 w-4.5" />
                  </button>

                  {/* Match Button (Swipe Right) */}
                  <button
                    onClick={() => handleSwipe("right")}
                    className="h-12 w-12 rounded-full bg-gradient-rose-peach text-white hover:shadow-lg hover:shadow-rose-500/30 hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
                    title="Compatible (Swipe Right)"
                  >
                    <Heart className="h-6 w-6 fill-white/10 stroke-[2.5px]" />
                  </button>

                </div>
              )}

            </div>
          </div>
        )}

        {/* DOSSIER DIRECTORY VIEW (GRID LIST) */}
        {viewMode === "directory" && (
          <div className="space-y-6">
            
            {/* Filters and Controls Panel */}
            <div className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-rose-100/50 dark:border-zinc-900 shadow-sm space-y-4 shrink-0">
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
                  <label className="text-[10px] font-bold text-slate-405 dark:text-zinc-500 uppercase tracking-wider">Gender</label>
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
                  <label className="text-[10px] font-bold text-slate-405 dark:text-zinc-500 uppercase tracking-wider">City</label>
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
                  <label className="text-[10px] font-bold text-slate-405 dark:text-zinc-500 uppercase tracking-wider">Religion</label>
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
                  <label className="text-[10px] font-bold text-slate-450 dark:text-zinc-500 uppercase tracking-wider">Wants Kids</label>
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
                  <label className="text-[10px] font-bold text-slate-405 dark:text-zinc-500 uppercase tracking-wider">Marital Status</label>
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
        )}

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
              <p className="font-semibold text-zinc-100">Action Complete</p>
              <p className="text-zinc-450 mt-0.5 leading-relaxed">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-zinc-500 hover:text-zinc-300 cursor-pointer bg-transparent border-none"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
