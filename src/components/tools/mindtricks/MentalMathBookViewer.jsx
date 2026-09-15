import React, { useState } from 'react';
import { 
  BookOpen, Brain, CheckCircle, ChevronRight, Zap, Shield, Sparkles, 
  Lightbulb, ArrowRight, Award, Compass, Search, Filter, PlayCircle
} from 'lucide-react';
import { MENTAL_MATH_BOOK } from '../../../data/mentalMathData';

export default function MentalMathBookViewer({ onOpenLab, onOpenExercise }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedChapterId, setSelectedChapterId] = useState(2); // Default to DS Method
  const [searchQuery, setSearchQuery] = useState('');

  const chapters = MENTAL_MATH_BOOK.chapters;

  const filteredChapters = chapters.filter(ch => {
    const matchesCat = selectedCategory === 'all' || ch.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeChapter = chapters.find(ch => ch.id === selectedChapterId) || chapters[0];

  return (
    <div className="space-y-6">
      {/* Book Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-900/50 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Book Course • {MENTAL_MATH_BOOK.metadata.edition}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {MENTAL_MATH_BOOK.metadata.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            By <span className="text-indigo-400 font-semibold">{MENTAL_MATH_BOOK.metadata.author}</span>. {MENTAL_MATH_BOOK.metadata.overview}
          </p>
          <div className="pt-2 flex flex-wrap gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Brain className="w-4 h-4 text-emerald-400" /> LR Working Memory Model</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-amber-400" /> DS & DD Verification</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-indigo-400" /> 17 Practice Workbooks</span>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {MENTAL_MATH_BOOK.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search book chapters, tricks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Main Grid: Chapter List Drawer & Chapter Detail Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Chapter Index */}
        <div className="lg:col-span-4 space-y-2 max-h-[750px] overflow-y-auto pr-1">
          {filteredChapters.map((ch) => {
            const isSelected = ch.id === activeChapter.id;
            return (
              <div
                key={ch.id}
                onClick={() => setSelectedChapterId(ch.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 text-left ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 shadow-sm ring-1 ring-indigo-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Chapter {ch.number}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {ch.readTime}
                  </span>
                </div>
                <h4 className={`text-sm font-bold line-clamp-1 ${isSelected ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-900 dark:text-white'}`}>
                  {ch.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {ch.subtitle}
                </p>
                {ch.badge && (
                  <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    {ch.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Active Chapter Deep Dive */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Chapter Header */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Chapter {activeChapter.number} • {activeChapter.category.toUpperCase()}
              </span>
              <div className="flex items-center gap-2">
                {activeChapter.hasInteractive && (
                  <button
                    onClick={() => onOpenLab && onOpenLab(activeChapter.interactiveType)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20 transition-all"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Open in Lab</span>
                  </button>
                )}
                {activeChapter.exerciseId && (
                  <button
                    onClick={() => onOpenExercise && onOpenExercise(activeChapter.exerciseId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-500/20 transition-all"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Practice Exercises</span>
                  </button>
                )}
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {activeChapter.title}
            </h3>
            <p className="text-sm font-medium text-indigo-600/90 dark:text-indigo-400/90 mt-1">
              {activeChapter.subtitle}
            </p>
          </div>

          {/* Chapter Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white block mb-1">Concept Summary:</strong>
            {activeChapter.summary}
          </div>

          {/* Cognitive Science / RAM Notes */}
          {activeChapter.cognitiveScience && (
            <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 flex items-start gap-3 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200">
              <Brain className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-indigo-950 dark:text-indigo-100">Working Memory Insight:</strong>
                {activeChapter.cognitiveScience}
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          {activeChapter.keyTakeaways && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Core Principles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeChapter.keyTakeaways.map((point, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules Section */}
          {activeChapter.rules && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">The Rules & Steps</h4>
              <div className="space-y-2">
                {activeChapter.rules.map((rule, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col gap-1 text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{rule.name}</span>
                    <span className="text-slate-700 dark:text-slate-300">{rule.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operations / Methods Section */}
          {activeChapter.operations && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Operations Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeChapter.operations.map((op, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 space-y-2 text-xs">
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{op.op}</span>
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                        {op.example}
                      </span>
                    </div>
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">{op.rule}</p>
                    <div className="space-y-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      {op.steps.map((s, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Table (DS vs DD) */}
          {activeChapter.comparisonTable && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{activeChapter.comparisonTable.title}</h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    <tr>
                      {activeChapter.comparisonTable.headers.map((h, i) => (
                        <th key={i} className="p-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {activeChapter.comparisonTable.rows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        {r.map((cell, cIdx) => (
                          <td key={cIdx} className={`p-3 ${cIdx === 0 ? 'font-medium text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Worked Examples */}
          {activeChapter.examples && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Official Worked Examples from the Book</h4>
              <div className="space-y-3">
                {activeChapter.examples.map((ex, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 text-xs font-mono space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-amber-400 font-bold font-sans">
                      <span>Example {idx + 1}: {ex.problem}</span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                        Mental Steps
                      </span>
                    </div>
                    {ex.breakdown && (
                      <p className="text-slate-300 font-mono">{ex.breakdown}</p>
                    )}
                    {ex.steps && (
                      <div className="space-y-1 pt-1">
                        {ex.steps.map((st, sIdx) => (
                          <div key={sIdx} className="text-slate-300 flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">›</span>
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Techniques / Methods */}
          {activeChapter.techniques && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Methodologies</h4>
              <div className="space-y-3">
                {activeChapter.techniques.map((tech, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{tech.name}</span>
                      {tech.formula && (
                        <code className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                          {tech.formula}
                        </code>
                      )}
                    </div>
                    {tech.desc && <p className="text-slate-600 dark:text-slate-300">{tech.desc}</p>}
                    {tech.examples && (
                      <div className="space-y-1 pt-1 font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                        {tech.examples.map((ex, exIdx) => (
                          <div key={exIdx}>• {ex}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Methods (Chapter 9 LR Multiplication) */}
          {activeChapter.methods && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Methods Breakdown</h4>
              <div className="space-y-2">
                {activeChapter.methods.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 text-xs">
                    <strong className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">{m.name}</strong>
                    <p className="text-slate-700 dark:text-slate-300">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Breakthrough / Special Psychology Card */}
          {activeChapter.breakthroughTechnique && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-xs space-y-1.5 text-amber-950 dark:text-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                <Lightbulb className="w-4 h-4" />
                <span>{activeChapter.breakthroughTechnique.title}</span>
              </div>
              <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                {activeChapter.breakthroughTechnique.content}
              </p>
            </div>
          )}

          {/* Habits Card */}
          {activeChapter.habits && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Daily Mastery Habits</h4>
              <div className="space-y-2">
                {activeChapter.habits.map((h, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs">
                    <strong className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">{h.name}</strong>
                    <p className="text-slate-700 dark:text-slate-300">{h.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Limitations Warning Alert */}
          {activeChapter.limitations && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <strong className="font-bold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-600" />
                Auditor Notice & Edge Cases:
              </strong>
              <p>{activeChapter.limitations}</p>
            </div>
          )}

          {/* Finger Tip / Pro-tip */}
          {activeChapter.fingerTip && (
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-2">
              <Zap className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Finger-Pacing Speed Tip:</strong>
                <span>{activeChapter.fingerTip}</span>
              </div>
            </div>
          )}

          {/* Footer Jump CTA */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Chapter {activeChapter.number} of {chapters.length}
            </div>
            <div className="flex items-center gap-2">
              {activeChapter.hasInteractive && (
                <button
                  onClick={() => onOpenLab && onOpenLab(activeChapter.interactiveType)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Launch Live Simulator</span>
                </button>
              )}
              {activeChapter.exerciseId && (
                <button
                  onClick={() => onOpenExercise && onOpenExercise(activeChapter.exerciseId)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Solve Practice Set</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
