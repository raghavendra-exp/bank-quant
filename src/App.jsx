import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Zap, Compass, Trophy, TrendingUp, 
  ShieldCheck, Sparkles, AlertCircle, Bookmark, Calendar, 
  Database, Moon, Sun, Search, Menu, X, ChevronRight, Activity,
  Table, Layers
} from 'lucide-react';

import Dashboard from './components/dashboard/Dashboard';
import PracticeArena from './components/practice/PracticeArena';
import SpeedLab from './components/practice/SpeedLab';
import QuestionSelectionTrainer from './components/practice/QuestionSelectionTrainer';
import ExamSimulator from './components/mock/ExamSimulator';
import ConceptLearner from './components/learn/ConceptLearner';
import VisualizersHub from './components/visualizers/VisualizersHub';
import SpeedReferenceCharts from './components/tools/SpeedReferenceCharts';
import VedicMathSuite from './components/tools/VedicMathSuite';
import FiveBooksCompendium from './components/tools/FiveBooksCompendium';
import PyqAnalytics from './components/analytics/PyqAnalytics';
import ExamPatternDashboard from './components/tools/ExamPatternDashboard';
import MindTricksLibrary from './components/tools/MindTricksLibrary';
import RevisionMistakes from './components/tools/RevisionMistakes';
import BookmarksViewer from './components/tools/BookmarksViewer';
import StudyPlans from './components/tools/StudyPlans';
import QuestionImporter from './components/tools/QuestionImporter';
import GlobalSearchModal from './components/common/GlobalSearchModal';

import { getAllQuestions, getQuantReadinessScore, storage } from './utils/dataManager';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeVisualizerTab, setActiveVisualizerTab] = useState('fraction');
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [readiness, setReadiness] = useState({ score: 35 });
  const [darkMode, setDarkMode] = useState(() => storage.get('bq_dark_mode', false));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storage.set('bq_dark_mode', darkMode);
  }, [darkMode]);

  // Load initial data
  useEffect(() => {
    fetch('./data/topics.json')
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(err => console.error('Failed to load topics.json', err));

    getAllQuestions().then(q => setQuestions(q));
    setReadiness(getQuantReadinessScore());
  }, []);

  // Global Ctrl+K shortcut listener
  useEffect(() => {
    function handleGlobalKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  function handleNavigate(view, extra) {
    setCurrentView(view);
    if (view === 'visualizers' && extra) {
      setActiveVisualizerTab(extra);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const navGroups = [
    {
      group: 'Core Preparation',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'learn', label: '32 Topics Concept Hub', icon: BookOpen },
        { id: 'charts', label: 'Master Charts (1-100)', icon: Table },
        { id: 'vedic', label: 'Vedic Maths Suite', icon: Sparkles },
        { id: 'books', label: '5 Quant Books Guide', icon: BookOpen },
        { id: 'visualizers', label: 'Interactive Visualizers', icon: Zap }
      ]
    },
    {
      group: 'Practice & Mocks',
      items: [
        { id: 'practice', label: 'Practice Arena (Dual Sol.)', icon: Trophy },
        { id: 'speedlab', label: 'Speed Conditioning Lab', icon: Zap },
        { id: 'selection', label: '5-Min Selection Trainer', icon: Compass },
        { id: 'mock', label: 'Full Mock Simulator', icon: Trophy }
      ]
    },
    {
      group: 'Intelligence & Revision',
      items: [
        { id: 'pyq', label: '2020-2026 PYQ Trends', icon: TrendingUp },
        { id: 'patterns', label: 'Official Exam Patterns', icon: ShieldCheck },
        { id: 'tricks', label: 'Mind Tricks & Human Calc', icon: Sparkles },
        { id: 'mistakes', label: 'Revise My Mistakes', icon: AlertCircle },
        { id: 'bookmarks', label: 'Saved Questions', icon: Bookmark },
        { id: 'plans', label: 'Study Plans (30/60/90D)', icon: Calendar },
        { id: 'importer', label: 'JSON Importer / Backup', icon: Database }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div 
              onClick={() => handleNavigate('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-black text-lg shadow-md">
                Q
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight block text-slate-900 dark:text-white leading-none">
                  Bank Quant Master
                </span>
                <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                  SBI • IBPS • RRB Prelims & Mains
                </span>
              </div>
            </div>
          </div>

          {/* Center Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-2 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl max-w-sm w-full transition-all"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="truncate">Search 32 topics, formulas, tricks...</span>
            <kbd className="ml-auto font-mono text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-slate-500">
              Ctrl K
            </kbd>
          </button>

          {/* Right Controls: Readiness Badge & Dark Mode */}
          <div className="flex items-center gap-3">
            {/* Quant Readiness Badge */}
            <div 
              onClick={() => handleNavigate('dashboard')}
              className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50"
              title="Quant Readiness Score"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
                Readiness: {readiness.score}/100
              </span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
                {group.group}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex">
            <div className="w-72 bg-white dark:bg-slate-900 h-full p-6 space-y-6 overflow-y-auto border-r border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm">Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {navGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                    {group.group}
                  </span>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {currentView === 'dashboard' && (
            <Dashboard 
              onNavigate={handleNavigate} 
              topics={topics} 
            />
          )}

          {currentView === 'practice' && (
            <PracticeArena 
              questions={questions} 
              topics={topics} 
            />
          )}

          {currentView === 'speedlab' && (
            <SpeedLab 
              questions={questions} 
            />
          )}

          {currentView === 'selection' && (
            <QuestionSelectionTrainer />
          )}

          {currentView === 'mock' && (
            <ExamSimulator 
              questions={questions} 
            />
          )}

          {currentView === 'learn' && (
            <ConceptLearner 
              topics={topics}
              onPracticeTopic={(topicId) => {
                setCurrentView('practice');
              }}
              onOpenVisualizer={(visId) => {
                handleNavigate('visualizers', visId);
              }}
            />
          )}

          {currentView === 'visualizers' && (
            <VisualizersHub 
              initialTab={activeVisualizerTab} 
            />
          )}

          {currentView === 'charts' && (
            <SpeedReferenceCharts />
          )}

          {currentView === 'vedic' && (
            <VedicMathSuite />
          )}

          {currentView === 'books' && (
            <FiveBooksCompendium 
              onNavigate={handleNavigate} 
            />
          )}

          {currentView === 'pyq' && (
            <PyqAnalytics />
          )}

          {currentView === 'patterns' && (
            <ExamPatternDashboard />
          )}

          {currentView === 'tricks' && (
            <MindTricksLibrary />
          )}

          {currentView === 'mistakes' && (
            <RevisionMistakes />
          )}

          {currentView === 'bookmarks' && (
            <BookmarksViewer />
          )}

          {currentView === 'plans' && (
            <StudyPlans />
          )}

          {currentView === 'importer' && (
            <QuestionImporter />
          )}
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        topics={topics}
        onSelectTopic={(topicId) => {
          setCurrentView('learn');
        }}
        onNavigate={(view) => {
          handleNavigate(view);
        }}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 bg-white dark:bg-slate-900 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong>Bank Quant Master</strong> • 100% Client-Side Exam Conditioning Platform
          </div>
          <div className="flex items-center gap-4">
            <span>SBI Clerk (JA)</span>
            <span>•</span>
            <span>IBPS Clerk / CSA</span>
            <span>•</span>
            <span>IBPS RRB Office Assistant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
