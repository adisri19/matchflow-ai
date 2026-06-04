"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import Sidebar from "@/components/Sidebar";
import NotesEditor from "@/components/NotesEditor";
import MatchesPanel from "@/components/MatchesPanel";
import { ProfileService } from "@/services/profileService";
import { Profile } from "@/types";
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Sliders,
  User, 
  Mail, 
  Phone, 
  Languages, 
  Clock, 
  ChevronRight,
  Heart,
  Loader2,
  CheckCircle2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // AI Profile Summary states
  const [aiSummary, setAiSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(true);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Active Tab
  const [activeTab, setActiveTab] = useState<"personal" | "professional" | "family" | "notes">("personal");

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      
      setLoading(true);
      const all = await ProfileService.getAllProfiles();
      setAllProfiles(all);
      
      const found = await ProfileService.getProfileById(id);
      setProfile(found);
      setLoading(false);
    }
    loadData();
  }, [id]);

  // Load AI Summary once profile is loaded
  useEffect(() => {
    if (!profile) return;
    const currentProfile = profile;

    async function fetchSummary() {
      setLoadingSummary(true);
      try {
        const response = await fetch("/api/ai/profile-summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profile: currentProfile }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setAiSummary(data.summary);
      } catch (err) {
        console.error(err);
        // Fallback summary
        setAiSummary(
          `A highly educated ${currentProfile.gender.toLowerCase()} professional residing in ${currentProfile.city}. Values family relationships, holds an impressive designation at ${currentProfile.company}, and seeks a partner sharing modern yet grounded matrimonial values.`
        );
      } finally {
        setLoadingSummary(false);
      }
    }

    fetchSummary();
  }, [profile]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64 pt-20 md:pt-8 p-4 md:p-8 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 text-rose-500 animate-spin mx-auto" />
            <p className="text-sm text-slate-500">Loading client workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64 pt-20 md:pt-8 p-4 md:p-8">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl text-center space-y-4 max-w-md mx-auto mt-20">
            <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-lg">Profile Not Found</h3>
            <p className="text-xs text-muted-foreground">The specified client profile does not exist.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-gradient-rose-peach text-white rounded-xl text-xs font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 pt-20 md:pt-8 p-4 md:p-8 space-y-6">
        
        {/* Back navigation & Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 bg-white dark:bg-zinc-900 border border-rose-100/50 dark:border-zinc-800 rounded-xl hover:bg-rose-50/30 text-slate-500 hover:text-rose-500 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1.5 font-medium">
            <span>Clients</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600 dark:text-zinc-400 font-bold">{profile.firstName} {profile.lastName}</span>
          </div>
        </div>

        {/* Profile Card Header with AI Summary */}
        <div className="bg-white dark:bg-zinc-950 border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-rose-50/50 dark:border-zinc-900/50">
            
            <div className="flex items-center gap-5">
              {/* Photo */}
              <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-white dark:border-zinc-900 shadow-md flex-shrink-0">
                <img
                  src={profile.profileImage}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">
                  {profile.firstName} {profile.lastName}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-zinc-400">
                  <span className="bg-slate-100 dark:bg-zinc-900 px-2 py-0.5 rounded-lg font-medium">ID: {profile.id}</span>
                  <span>•</span>
                  <span>{profile.age} years old</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3 text-rose-400" />
                    {profile.city}, {profile.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex items-center gap-3">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Active Client
              </span>
            </div>

          </div>

          {/* AI-Generated Profile Summary Widget */}
          <div className="bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/30 dark:border-rose-900/20 rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
              <Sparkles className="h-4.5 w-4.5 text-rose-500 fill-rose-500/10" />
              <span>AI Consultant Summary Profile</span>
            </div>

            {loadingSummary ? (
              <div className="space-y-2 py-1.5">
                <div className="h-3.5 bg-rose-200/50 dark:bg-rose-900/30 rounded-full animate-pulse w-full" />
                <div className="h-3.5 bg-rose-200/50 dark:bg-rose-900/30 rounded-full animate-pulse w-[80%]" />
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-slate-700 dark:text-zinc-300 font-medium italic">
                &ldquo;{aiSummary}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Detail grid: Left Info Tab, Right Suggested Matches */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Core Profile Fields & Notes */}
          <div className="xl:col-span-7 space-y-6">
            
            {/* Tabs Selector */}
            <div className="flex border-b border-rose-100/50 dark:border-zinc-900 pb-px">
              {(["personal", "professional", "family", "notes"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 border-b-2 font-bold text-xs capitalize tracking-wide transition-all cursor-pointer ${
                    activeTab === tab
                      ? "border-rose-500 text-rose-600 dark:text-rose-400"
                      : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                  }`}
                >
                  {tab === "personal" ? "Personal Info" : tab === "professional" ? "Education & Career" : tab === "family" ? "Family & Preferences" : "Consultant Notes"}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="bg-white dark:bg-zinc-950 border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-6 shadow-sm">
              
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
                      <User className="h-4.5 w-4.5 text-rose-400" />
                      Biographical Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">First Name</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.firstName}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Last Name</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.lastName}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Gender</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.gender}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Date of Birth</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.dob}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Height</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.height} cm</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Marital Status</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.maritalStatus}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 dark:border-zinc-900 pt-5">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
                      <Mail className="h-4.5 w-4.5 text-rose-400" />
                      Contact & Location
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Email Address</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200 truncate">{profile.email}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Phone Number</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">City / State</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.city}, {profile.state}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Country</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 dark:border-zinc-900 pt-5 space-y-2">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                      <Languages className="h-4.5 w-4.5 text-rose-400" />
                      Bio & Languages
                    </h4>
                    <div className="text-xs space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Spoken Languages</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.languages.join(", ")}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Client Bio Statement</span>
                        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed bg-slate-50/50 dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-900">
                          {profile.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "professional" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4.5 w-4.5 text-rose-400" />
                      Educational Profile
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">College / Institution</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.college}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Academic Degree</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.degree}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 dark:border-zinc-900 pt-5">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
                      <Briefcase className="h-4.5 w-4.5 text-rose-400" />
                      Employment & Financials
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Designation / Role</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.designation}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Employer / Company</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.company}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Annual Income</span>
                        <p className="font-bold text-rose-600 dark:text-rose-400">{profile.income} LPA (INR)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "family" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
                      <Users className="h-4.5 w-4.5 text-rose-400" />
                      Family Background
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Religion</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.religion}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Caste / Sub-caste</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.caste}</p>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <span className="text-[10px] text-slate-400 font-medium">Siblings Description</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.siblings}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 dark:border-zinc-900 pt-5">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
                      <Sliders className="h-4.5 w-4.5 text-rose-400" />
                      Lifestyle Preferences
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Desires Children?</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.wantsKids}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Open to Relocation?</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.openToRelocate}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-medium">Open to Pets?</span>
                        <p className="font-semibold text-slate-800 dark:text-zinc-200">{profile.openToPets}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 dark:border-zinc-900 pt-5 grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hobbies</span>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.hobbies.map((h, idx) => (
                          <span key={idx} className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/30 px-2.5 py-1 rounded-xl text-[10px] font-semibold">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Relationship Values</span>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.values.map((v, idx) => (
                          <span key={idx} className="bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 px-2.5 py-1 rounded-xl text-[10px] font-semibold">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="p-0">
                  <NotesEditor
                    profileId={profile.id}
                    initialNotes={profile.notes || ""}
                    onSaveToast={triggerToast}
                  />
                </div>
              )}

            </div>
          </div>

          {/* Right Column - suggested matches */}
          <div className="xl:col-span-5">
            <div className="bg-white dark:bg-zinc-950 border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-6 shadow-sm">
              <MatchesPanel
                customer={profile}
                allProfiles={allProfiles}
                onSuccessToast={triggerToast}
              />
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
              <p className="font-semibold text-zinc-100">Action Dispatched</p>
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
