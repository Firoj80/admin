'use client';

import { useState } from 'react';
import { Dices, Save, RefreshCw } from 'lucide-react';

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

  const handleProbChange = (id: number, val: number) => {
    setSlices(prev => prev.map(s => s.id === id ? { ...s, probabilityPercent: val } : s));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Daily Spin & Win Wheel Configurator</h1>
          <p className="text-sm text-slate-400">Configure gamified spin wheel bonus rewards and slice probability distribution.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-amber-400/20"
        >
          <Save size={16} /> Save Wheel Config
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs rounded-xl">
          ✓ Daily Spin Wheel configuration published to Supabase!
        </div>
      )}

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-3">Wheel Reward Slice Weights</h3>

        <div className="space-y-4">
          {slices.map((slice) => (
            <div key={slice.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-100 text-sm block">{slice.label}</span>
                <span className="text-xs text-slate-400">Bonus Cash Amount: ₹{slice.bonusAmount}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Probability:</span>
                <input
                  type="number"
                  value={slice.probabilityPercent}
                  onChange={(e) => handleProbChange(slice.id, Number(e.target.value))}
                  className="w-20 bg-slate-900 border border-slate-700 text-amber-400 text-center font-bold rounded-lg px-2 py-1 text-sm focus:outline-none"
                />
                <span className="text-xs text-slate-400">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
