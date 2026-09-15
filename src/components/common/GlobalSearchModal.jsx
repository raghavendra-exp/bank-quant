import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Zap, Trophy, Lightbulb, ArrowRight } from 'lucide-react';

export default function GlobalSearchModal({ isOpen, onClose, onSelectTopic, onNavigate, topics = [] }) {
  const [query, setQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedTopics = topics.filter(t => 
    t.name.toLowerCase().includes(query.toLowerCase()) || 
    (t.hindiName && t.hindiName.includes(query)) ||
    (t.category && t.category.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 6);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 z-50 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Search input bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search all 32 topics, formulas, tricks... (Press Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-1">
          {matchedTopics.length > 0 ? (
            matchedTopics.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTopic(t.id);
                  onClose();
                }}
                className="w-full p-3 rounded-xl text-left hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center justify-between group transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</span>
                    {t.hindiName && <span className="text-xs text-slate-400 font-sans">{t.hindiName}</span>}
                  </div>
                  <span className="text-xs text-slate-500 ml-6">{t.category} • {t.weightagePrelims}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100" />
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching topics found for "{query}".
            </div>
          )}

          {/* Quick Shortcuts Navigation */}
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Actions
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { onNavigate('speedlab'); onClose(); }}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">Speed Lab</span>
              </button>

              <button
                onClick={() => { onNavigate('tricks'); onClose(); }}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">Mind Tricks</span>
              </button>

              <button
                onClick={() => { onNavigate('mock'); onClose(); }}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span className="truncate">Mock Simulator</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
