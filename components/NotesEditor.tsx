"use client";

import { useState, useEffect } from "react";
import { Save, ClipboardSignature, FileText, CheckCircle2 } from "lucide-react";

interface NotesEditorProps {
  profileId: string;
  initialNotes?: string;
  onSaveToast: (msg: string) => void;
}

export default function NotesEditor({ profileId, initialNotes = "", onSaveToast }: NotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load note from local storage if available
    const savedNote = localStorage.getItem(`matchmaker_note_${profileId}`);
    if (savedNote !== null) {
      setNotes(savedNote);
    } else {
      setNotes(initialNotes);
    }
  }, [profileId, initialNotes]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem(`matchmaker_note_${profileId}`, notes);
      setIsSaving(false);
      onSaveToast("Matchmaker notes updated successfully!");
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-rose-100/60 dark:border-zinc-900 rounded-3xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-zinc-900 flex items-center justify-center">
            <ClipboardSignature className="h-4.5 w-4.5 text-rose-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
              Matchmaker Consultation Notes
            </h4>
            <p className="text-[10px] text-muted-foreground">
              Internal comments, personality insights, and constraints
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-100/50 dark:border-rose-900/30 transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <span className="h-3 w-3 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          <span>Save Notes</span>
        </button>
      </div>

      <div className="flex-1 relative">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Type client insights, relationship preferences, family expectations, or red flags discovered during calls..."
          className="w-full h-48 md:h-full min-h-[180px] p-4 text-sm bg-slate-50/50 dark:bg-zinc-900/10 border border-rose-50 dark:border-zinc-900 rounded-2xl focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-all leading-relaxed resize-none text-slate-700 dark:text-zinc-300"
        />
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500">
        <FileText className="h-3.5 w-3.5 text-slate-300 dark:text-zinc-600" />
        <span>Only visible to relationship managers. Notes are autosaved locally.</span>
      </div>
    </div>
  );
}
