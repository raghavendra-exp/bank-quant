import React, { useState } from 'react';
import { 
  BookOpen, Lightbulb, AlertTriangle, Zap, CheckCircle2, 
  ArrowRight, Search, FileText, Save, ExternalLink 
} from 'lucide-react';
import { getTopicNotes, saveTopicNotes } from '../../utils/dataManager';

export default function ConceptLearner({ topics = [], onPracticeTopic, onOpenVisualizer }) {
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0]?.id || 'simplification');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [personalNotes, setPersonalNotes] = useState(() => getTopicNotes(selectedTopicId));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  // Update notes when active topic changes
  const handleSelectTopic = (id) => {
    setSelectedTopicId(id);
    setPersonalNotes(getTopicNotes(id));
    setSavedSuccess(false);
  };

  const handleSaveNotes = () => {
    saveTopicNotes(selectedTopicId, personalNotes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Categories
  const categories = ['all', 'Speed Math & Foundation', 'Core Arithmetic', 'Modern Math', 'Data Interpretation', 'Mains Special'];

  const filteredTopics = topics.filter(t => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.hindiName && t.hindiName.includes(searchQuery));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Category Pills & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All 32 Topics' : cat}
            </button>
          ))}
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search topics e.g. SI/CI, Ratio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>

      {/* Main Split View: Topic List (left) + Deep Dive (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topic List Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm max-h-[700px] overflow-y-auto space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">
            Topics ({filteredTopics.length})
          </span>

          {filteredTopics.map((t) => {
            const isSelected = selectedTopicId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTopic(t.id)}
                className={`w-full p-3 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-950 dark:text-white shadow-sm'
                    : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{t.name}</span>
                  <span className="text-[10px] text-slate-400 font-sans">{t.hindiName}</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span>{t.category}</span>
                  <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                    {t.weightagePrelims}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Concept Reader (8 cols) */}
        {activeTopic && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {activeTopic.category}
                  </span>
                  {activeTopic.hindiName && (
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {activeTopic.hindiName}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {activeTopic.name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {activeTopic.visualizerId && (
                  <button
                    onClick={() => onOpenVisualizer(activeTopic.visualizerId)}
                    className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-100"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Visualizer</span>
                  </button>
                )}
                <button
                  onClick={() => onPracticeTopic(activeTopic.id)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <span>Practice Questions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Exam Weightage Callout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Prelims Weightage</span>
                <strong className="text-slate-900 dark:text-white font-mono">{activeTopic.weightagePrelims}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Mains Weightage</span>
                <strong className="text-slate-900 dark:text-white font-mono">{activeTopic.weightageMains}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Time</span>
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{activeTopic.targetTimeSec}s / Question</strong>
              </div>
            </div>

            {/* Why This Matters */}
            {activeTopic.why && (
              <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  Why This Matters in Banking Exams:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeTopic.why}
                </p>
              </div>
            )}

            {/* Core Mathematical Concept */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Core Concept & Theory</span>
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeTopic.concept}
              </p>
            </div>

            {/* Key Formulas */}
            {activeTopic.keyFormulas && activeTopic.keyFormulas.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Key Formulas & Topper Rules</span>
                </h3>
                <div className="space-y-2">
                  {activeTopic.keyFormulas.map((formula, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 font-mono text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2"
                    >
                      <span className="text-indigo-600 font-bold shrink-0">#{i + 1}</span>
                      <span>{formula}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Traps */}
            {activeTopic.commonTraps && activeTopic.commonTraps.length > 0 && (
              <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900/30">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Common Exam Traps to Avoid:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {activeTopic.commonTraps.map((trap, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold shrink-0">•</span>
                      <span>{trap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Personal Notes Section */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>My Personal Notes & Mnemonics for this Topic:</span>
                </span>
                {savedSuccess && (
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Saved!
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                placeholder="Jot down your custom tricks, personal reminder formulas, or questions you struggled with..."
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
