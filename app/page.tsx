'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Loader2, Database, Trash2, Shield, Calendar, ArrowUpRight, Zap, Folder, FileText } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Note {
  id: string;
  content: string;
  title: string;
  similarity?: number;
  createdAt: string;
}

const STORAGE_KEY = 'semantic-vault-notes';

const IndustrialBorder = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("border border-industrial-700 bg-black/40 backdrop-blur-md p-4 transition-all hover:border-industrial-500", className)}>
    {children}
  </div>
);

const ZenithButton = ({ onClick, disabled, children, variant = 'primary', className }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode; variant?: 'primary' | 'outline' | 'ghost'; className?: string }) => {
  const baseStyles = "px-4 py-2 font-mono flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs border";
  const variants = {
    primary: "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 active:translate-y-0.5",
    outline: "bg-transparent border-industrial-700 text-industrial-400 hover:border-industrial-400",
    ghost: "bg-transparent border-transparent text-industrial-500 hover:text-industrial-300"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={cn(baseStyles, variants[variant], className)}>
      {children}
    </button>
  );
};

const ZenithInput = ({ value, onChange, placeholder, className, type = 'text', icon: Icon }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder: string; className?: string; type?: 'text' | 'textarea'; icon?: any }) => {
  const baseStyles = "w-full bg-industrial-950 border border-industrial-800 p-3 font-mono text-industrial-300 placeholder:text-industrial-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20";
  if (type === 'textarea') {
    return (
      <div className="relative w-full">
        <textarea value={value} onChange={onChange} placeholder={placeholder} className={cn(baseStyles, "min-h-[120px]", className)} />
      </div>
    );
  }
  return (
    <div className="relative w-full">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-industrial-600" />}
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} className={cn(baseStyles, Icon && "pl-10", className)} />
    </div>
  );
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchNotes();
  }, []);

  const fetchNotes = async (q?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = q ? `/api/notes?q=${encodeURIComponent(q)}` : '/api/notes';
      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok && Array.isArray(data)) {
        setNotes(data);
      } else {
        const errorMsg = data.error || 'Unknown error occurred';
        setError(errorMsg);
        setNotes([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch:', err);
      setError('Connection failed. Check if API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const debounceSearch = useCallback((q: string) => {
    const handler = setTimeout(() => {
      fetchNotes(q);
    }, 500);
    return () => clearTimeout(handler);
  }, []);

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        fetchNotes(query);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [query, mounted]);

  const handleSaveNote = async () => {
    if (!newNote.content) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });
      const data = await res.json();
      if (res.ok) {
        setNewNote({ title: '', content: '' });
        fetchNotes();
      } else {
        setError(data.error || 'Failed to save note');
      }
    } catch (err: any) {
      console.error('Failed to save:', err);
      setError('Failed to reach server during save');
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-industrial-300 font-mono p-4 md:p-8 space-y-8 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-industrial-800 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            <span className="p-1 bg-emerald-500 rounded-sm">
                <Database className="w-6 h-6 text-black" />
            </span>
            Semantic Vault
          </h1>
          <p className="text-xs text-industrial-500 mt-2 tracking-widest uppercase">
            System Protocol 2.5: Meaning-Based Indexed Storage
          </p>
        </div>
        <div className="text-[10px] text-industrial-600 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Vectored Node Online
          </div>
          <div>Status: Ready for Injection</div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          <IndustrialBorder className="space-y-4">
            <div className="flex items-center gap-2 border-b border-industrial-800 pb-2 mb-4">
              <Plus className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">Add Snippet</h2>
            </div>
            
            <div className="space-y-4">
              <ZenithInput 
                value={newNote.title} 
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} 
                placeholder="Protocol Name (Title)" 
              />
              <ZenithInput 
                type="textarea"
                value={newNote.content} 
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} 
                placeholder="Enter semantic content or raw data..." 
              />
              <ZenithButton 
                onClick={handleSaveNote} 
                disabled={isSaving || !newNote.content} 
                className="w-full"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Store in Vault
              </ZenithButton>
            </div>
          </IndustrialBorder>

          <IndustrialBorder className="p-4 bg-emerald-950/20 border-emerald-500/20">
             <div className="flex items-center gap-2 text-emerald-400 text-xs mb-2">
                <Shield className="w-3 h-3" />
                <span className="uppercase font-bold tracking-widest">Security Note</span>
             </div>
             <p className="text-[10px] leading-relaxed text-industrial-500 uppercase">
                All data is indexed using local meaning-vectors. Keywords do not limit your recall.
             </p>
          </IndustrialBorder>
        </div>

        {/* Right Column: Search & Results */}
        <div className="lg:col-span-7 space-y-6">
             <div className="relative">
             <ZenithInput 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search by meaning... (e.g. 'Project ideas' or 'Bug fixes')"
              icon={Search}
             />
             {isLoading && (
               <div className="absolute right-3 top-1/2 -translate-y-1/2">
                 <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
               </div>
             )}
           </div>

           {error && (
             <div className="border border-red-500/50 bg-red-500/10 p-4 text-red-400 text-xs font-mono uppercase tracking-widest flex items-center gap-3">
               <Shield className="w-4 h-4" />
               <span>Vault Error: {error}</span>
             </div>
           )}

           <div className="space-y-4 min-h-[400px]">
             {notes.length === 0 && !isLoading && (
               <div className="h-full flex flex-col items-center justify-center border border-dashed border-industrial-800 p-12 text-center">
                 <Folder className="w-12 h-12 text-industrial-800 mb-4" />
                 <p className="text-sm text-industrial-600 uppercase tracking-widest">Vault is empty</p>
                 <p className="text-[10px] text-industrial-700 mt-2">Initialize by uploading a snippet</p>
               </div>
             )}

             <AnimatePresence mode="popLayout">
               {notes.map((note, index) => (
                 <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                 >
                   <IndustrialBorder className="relative group overflow-hidden">
                     <div className="flex justify-between items-start mb-2">
                       <h3 className="text-sm font-bold text-white uppercase tracking-tight truncate flex-1 pr-4">{note.title}</h3>
                       {note.similarity !== undefined && (
                         <span className="text-[10px] px-2 py-0.5 border border-industrial-700 text-emerald-400 bg-emerald-500/5">
                           {(note.similarity * 100).toFixed(0)}% MATCH
                         </span>
                       )}
                     </div>
                     <p className="text-xs text-industrial-400 leading-relaxed mb-4 whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                        {note.content}
                     </p>
                     <div className="flex items-center justify-between pt-3 border-t border-industrial-900 mt-auto">
                        <div className="flex items-center gap-4 text-[10px] text-industrial-600">
                           <span className="flex items-center gap-1 uppercase tracking-widest">
                             <Calendar className="w-3 h-3" />
                             {new Date(note.createdAt).toLocaleDateString()}
                           </span>
                           <span className="flex items-center gap-1 uppercase tracking-widest">
                             <FileText className="w-3 h-3" />
                             {note.content.length} B
                           </span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:text-emerald-400 transition-colors">
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                     </div>
                   </IndustrialBorder>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </main>
  );
}
