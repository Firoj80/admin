'use client';

import { useState } from 'react';
import { Dices, Save, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface WheelSlice {
  id: number;
  label: string;
  bonusAmount: number;
  probabilityPercent: number;
}

const initialSlices: WheelSlice[] = [
  { id: 1, label: '₹2 Bonus', bonusAmount: 2, probabilityPercent: 40 },
  { id: 2, label: '₹5 Bonus', bonusAmount: 5, probabilityPercent: 30 },
  { id: 3, label: '₹10 Bonus', bonusAmount: 10, probabilityPercent: 15 },
  { id: 4, label: '₹15 Bonus', bonusAmount: 15, probabilityPercent: 10 },
  { id: 5, label: '₹20 Mega Bonus', bonusAmount: 20, probabilityPercent: 5 },
];

export default function SpinWheelConfigPage() {
  const [slices, setSlices] = useState<WheelSlice[]>(initialSlices);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const totalProbability = slices.reduce((acc, curr) => acc + curr.probabilityPercent, 0);
  const isValidProbability = totalProbability === 100;

  const handleProbChange = (id: number, val: number) => {
    setSlices(prev => prev.map(s => s.id === id ? { ...s, probabilityPercent: Math.max(0, val) } : s));
  };

  const handleAmountChange = (id: number, val: number) => {
    setSlices(prev => prev.map(s => s.id === id ? { ...s, bonusAmount: Math.max(0, val), label: `₹${val} Bonus` } : s));
  };

  const handleSave = () => {
    if (!isValidProbability) return;
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Daily Spin & Win Wheel Configurator
            <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-semibold border border-purple-200/60">
              {slices.length} Reward Slices
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Configure gamified daily spin wheel bonus cash payouts and slice probability weights.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!isValidProbability}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save size={16} /> Save Wheel Config
        </button>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-semibold text-xs rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 size={18} className="text-emerald-600" /> Daily Spin Wheel configuration successfully updated and published live!
        </div>
      )}

      {/* Total Probability Validation Bar */}
      <div className={`p-4 rounded-xl border flex items-center justify-between shadow-xs ${
        isValidProbability 
          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
          : 'bg-rose-50/60 border-rose-200 text-rose-900'
      }`}>
        <div className="flex items-center gap-2.5 text-xs font-semibold">
          {isValidProbability ? (
            <CheckCircle2 size={18} className="text-emerald-600" />
          ) : (
            <AlertCircle size={18} className="text-rose-600" />
          )}
          <span>Total Probability Weight Distribution: <strong className="font-mono text-sm">{totalProbability}%</strong></span>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-current shadow-2xs">
          {isValidProbability ? 'Valid (100%)' : `Must Equal 100% (Diff: ${100 - totalProbability}%)`}
        </span>
      </div>

      {/* Slices Configurator Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Wheel Slice Probability Distribution</h3>
            <p className="text-xs text-slate-500">Set the bonus cash reward and probability percentage for each slice.</p>
          </div>
          <button 
            onClick={() => setSlices(initialSlices)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <RefreshCw size={12} /> Reset Defaults
          </button>
        </div>

        <div className="divide-y divide-slate-100 p-6 space-y-4">
          {slices.map((slice, index) => (
            <div key={slice.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-200">
                  #{index + 1}
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{slice.label}</span>
                  <span className="text-xs text-slate-500 font-medium">Daily Spin Slice Token #{slice.id}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Bonus Cash:</span>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={slice.bonusAmount}
                      onChange={(e) => handleAmountChange(slice.id, Number(e.target.value))}
                      className="w-20 pl-6 pr-2 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Weight:</span>
                  <input
                    type="number"
                    value={slice.probabilityPercent}
                    onChange={(e) => handleProbChange(slice.id, Number(e.target.value))}
                    className="w-20 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-center"
                  />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
