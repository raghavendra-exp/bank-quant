import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Sparkles, Zap, Award, Search, ArrowRight, 
  CheckCircle2, Clock, ShieldCheck, Flame, ChevronRight,
  ExternalLink, Layers
} from 'lucide-react';
import { FIVE_BOOKS_DATA } from '../../data/fiveBooksData';

export default function FiveBooksCompendium({ onNavigate }) {
  const [selectedBookId, setSelectedBookId] = useState('m-tyra');
  const [searchQuery, setSearchQuery] = useState('');

  const currentBook = useMemo(() => {
    return FIVE_BOOKS_DATA.find(b => b.id === selectedBookId) || FIVE_BOOKS_DATA[0];
  }, [selectedBookId]);

  // Search across all books' signature formulas
  const allFilteredFormulas = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    const results = [];
    FIVE_BOOKS_DATA.forEach(book => {
      book.signatureFormulas.forEach(f => {
        if (
          f.title.toLowerCase().includes(query) ||
          f.formula.toLowerCase().includes(query) ||
          f.application.toLowerCase().includes(query) ||
          f.example.toLowerCase().includes(query) ||
          book.name.toLowerCase().includes(query)
        ) {
          results.push({ ...f, bookName: book.name, bookAuthor: book.author, bookId: book.id });
        }
      });
    });
    return results;
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Canonical Banking Quant Books Synthesis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Top 5 Quant Books Master Compendium
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
            A comprehensive, unified synthesis of the 5 legendary books that power 99% of SBI, IBPS, and RRB toppers' speed, shortcuts, and conceptual foundations.
          </p>
        </div>

        {/* Global Formula Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search all 5 books' formulas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Global Search Results if Active */}
      {allFilteredFormulas ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Search Results ({allFilteredFormulas.length} formulas found for "{searchQuery}")
            </h3>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Clear Search
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allFilteredFormulas.map((f, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                    {f.bookName} ({f.bookAuthor.split(' ')[0]})
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    ⚡ Saves {f.timeSaved}
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {f.title}
                </h4>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  {f.formula}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong>Example:</strong> {f.example}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Normal 5 Books Browser */
        <div className="space-y-6">
          {/* Books Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {FIVE_BOOKS_DATA.map((book) => {
              const isSelected = selectedBookId === book.id;
              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBookId(book.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-indigo-600 shadow-lg scale-102 ring-2 ring-indigo-500'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-900 dark:text-white'
                  }`}
                >
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                      isSelected ? 'text-amber-300' : 'text-slate-400'
                    }`}>
                      {book.badge}
                    </span>
                    <h3 className="font-black text-sm leading-snug">
                      {book.name}
                    </h3>
                    <p className={`text-[11px] mt-1 line-clamp-1 ${
                      isSelected ? 'text-indigo-200' : 'text-slate-500'
                    }`}>
                      {book.author}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[11px] font-bold">
                    <span className={isSelected ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}>
                      {book.signatureFormulas.length} Shortcuts
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Book Deep Dive Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Book Meta Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded uppercase tracking-wider">
                    {currentBook.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {currentBook.author}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {currentBook.name}
                </h3>
                <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                  {currentBook.tagline}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
                  {currentBook.overview}
                </p>
              </div>

              {/* Action Button */}
              {onNavigate && (
                <button
                  onClick={() => onNavigate('practice')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
                >
                  <span>Practice Questions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Core Strengths */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Core Methodological Pillars & Exam Hallmarks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentBook.coreStrengths.map((str, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature Formulas & Shortcuts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Signature Formulas, Derivations & Speed Hacks
                </h4>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                  {currentBook.signatureFormulas.length} Exam Shortcuts
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentBook.signatureFormulas.map((f, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded uppercase tracking-wider">
                          {f.application}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                          ⚡ Saves {f.timeSaved}
                        </span>
                      </div>

                      <h5 className="font-bold text-base text-slate-900 dark:text-white mt-2">
                        {f.title}
                      </h5>

                      <div className="mt-2.5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {f.formula}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                        <strong>Exam Walkthrough:</strong> {f.example}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
