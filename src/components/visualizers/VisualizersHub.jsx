import React, { useState } from 'react';
import { Percent, Sparkles, Target, TrendingUp, Scale, Calculator } from 'lucide-react';
import FractionPercentVisualizer from './FractionPercentVisualizer';
import VedicMathVisualizer from './VedicMathVisualizer';
import QuadraticVisualizer from './QuadraticVisualizer';
import InterestCurveVisualizer from './InterestCurveVisualizer';
import AlligationVisualizer from './AlligationVisualizer';
import InteractiveCalculator from './InteractiveCalculator';

const TABS = [
  { id: 'fraction', name: 'Fraction ↔ % Wheel', icon: Percent, desc: '1/1 to 1/20 instant converter' },
  { id: 'vedic', name: 'Vedic Math Sutras', icon: Sparkles, desc: 'Criss-cross, Base 100, Ending in 5' },
  { id: 'quadratic', name: 'Quadratic Sign Method', icon: Target, desc: '5-second sign-flip & CND rule' },
  { id: 'interest', name: 'CI vs SI Growth Curve', icon: TrendingUp, desc: 'Compounding & 2-year difference' },
  { id: 'alligation', name: 'Alligation Cross Solver', icon: Scale, desc: 'Diagonal mixture ratio solver' },
  { id: 'calculator', name: 'Virtual Exam Calculator', icon: Calculator, desc: 'Scratchpad with history tape' }
];

export default function VisualizersHub({ initialTab = 'fraction' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="space-y-6">
      {/* Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl text-center transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-bold leading-tight">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Component */}
      <div>
        {activeTab === 'fraction' && <FractionPercentVisualizer />}
        {activeTab === 'vedic' && <VedicMathVisualizer />}
        {activeTab === 'quadratic' && <QuadraticVisualizer />}
        {activeTab === 'interest' && <InterestCurveVisualizer />}
        {activeTab === 'alligation' && <AlligationVisualizer />}
        {activeTab === 'calculator' && <InteractiveCalculator />}
      </div>
    </div>
  );
}
