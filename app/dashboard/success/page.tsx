"use client";

import Sidebar from "@/components/Sidebar";
import { Heart, Sparkles, Star, Calendar, Quote } from "lucide-react";
import { motion } from "framer-motion";

interface SuccessStory {
  id: string;
  coupleName: string;
  partner1: {
    name: string;
    age: number;
    city: string;
    image: string;
    role: string;
  };
  partner2: {
    name: string;
    age: number;
    city: string;
    image: string;
    role: string;
  };
  compatibility: number;
  matchDate: string;
  story: string;
  testimonial: string;
}

const successStories: SuccessStory[] = [
  {
    id: "story-1",
    coupleName: "Aarav & Kirti",
    partner1: {
      name: "Aarav Sharma",
      age: 25,
      city: "Indore",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
      role: "Software Engineer",
    },
    partner2: {
      name: "Kirti Chawla",
      age: 24,
      city: "Indore",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400",
      role: "Investment Analyst",
    },
    compatibility: 92,
    matchDate: "October 2025",
    story: "Both Aarav and Kirti shared a strong desire to stay close to their roots in Indore, while pursuing high-growth career tracks. Their values matched 100% on family focus and shared lifestyle goals.",
    testimonial: "We were matched by MatchFlow's premium engine within weeks of onboarding. We immediately connected over our shared professional drives and weekend interest in hiking.",
  },
  {
    id: "story-2",
    coupleName: "Aditya & Swati",
    partner1: {
      name: "Aditya Verma",
      age: 28,
      city: "Mumbai",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400",
      role: "Management Consultant",
    },
    partner2: {
      name: "Swati Srivastava",
      age: 26,
      city: "Mumbai",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400",
      role: "Pediatrician",
    },
    compatibility: 88,
    matchDate: "December 2025",
    story: "Aditya and Swati had a high-score overlap in relationship values and city preference. Despite their busy consultant and doctor rosters, their lifestyle compatibility scored Excellent.",
    testimonial: "The AI summary captured exactly what we were seeking in a partner's character. MatchFlow made the introduction easy and we got married 6 months later!",
  },
  {
    id: "story-3",
    coupleName: "Siddharth & Preeti",
    partner1: {
      name: "Siddharth Mehta",
      age: 31,
      city: "Bangalore",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400",
      role: "Lead Product Manager",
    },
    partner2: {
      name: "Preeti Nair",
      age: 29,
      city: "Bangalore",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&h=400",
      role: "UX Design Lead",
    },
    compatibility: 94,
    matchDate: "March 2026",
    story: "Matched over high professional stability and shared artistic interests. The matchmaker notes highlighted a perfect height ratio and language compatibility, which played a key role in parent alignment.",
    testimonial: "It's rare to meet someone who aligns so perfectly on both day-to-day career focus and creative views. We are incredibly grateful to our consultant manager.",
  }
];

export default function SuccessStoriesPage() {
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
              <Star className="h-4.5 w-4.5 fill-rose-500/10" />
              <span className="text-xs font-bold uppercase tracking-wider">Celebrated Pairs</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
              MatchFlow Success Stories
            </h2>
            <p className="text-xs text-muted-foreground">
              A tribute to couples matched by our algorithms and relationship consultants who found lifelong companionship.
            </p>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="space-y-6">
          {successStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white dark:bg-zinc-950 border border-rose-100/50 dark:border-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col lg:flex-row gap-8 items-center relative overflow-hidden"
            >
              {/* Couple Photos & Connection */}
              <div className="flex items-center justify-center gap-4 flex-shrink-0 w-full lg:w-auto relative">
                {/* Photo 1 */}
                <div className="relative group">
                  <div className="h-28 w-28 rounded-2xl overflow-hidden border-4 border-white dark:border-zinc-900 shadow-md">
                    <img src={story.partner1.image} alt={story.partner1.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 bg-slate-900 text-white text-[9px] font-semibold px-2 py-0.5 rounded-lg border border-zinc-800 shadow-sm">
                    {story.partner1.age} • {story.partner1.city}
                  </div>
                </div>

                {/* Heart Connection */}
                <div className="h-10 w-10 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center text-rose-500 shadow-sm z-10">
                  <Heart className="h-5 w-5 fill-rose-500/20 animate-pulse" />
                </div>

                {/* Photo 2 */}
                <div className="relative group">
                  <div className="h-28 w-28 rounded-2xl overflow-hidden border-4 border-white dark:border-zinc-900 shadow-md">
                    <img src={story.partner2.image} alt={story.partner2.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[9px] font-semibold px-2 py-0.5 rounded-lg border border-zinc-800 shadow-sm">
                    {story.partner2.age} • {story.partner2.city}
                  </div>
                </div>
              </div>

              {/* Story Details */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-50/50 dark:border-zinc-900/50">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-lg">
                      {story.coupleName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {story.partner1.role} &amp; {story.partner2.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 rounded-xl px-2.5 py-1 text-center flex items-center gap-1 shadow-sm">
                      <Sparkles className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        {story.compatibility}% Score
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-300" />
                      <span>{story.matchDate}</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="relative pl-7 py-1 text-xs text-slate-600 dark:text-zinc-300 italic font-medium leading-relaxed">
                  <Quote className="h-5 w-5 text-rose-300 fill-rose-100/10 absolute left-0 top-0 -rotate-180" />
                  &ldquo;{story.testimonial}&rdquo;
                </div>

                {/* Case Story */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                    Matchmaker Case Summary
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                    {story.story}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
