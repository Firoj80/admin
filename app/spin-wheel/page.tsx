'use client';

import { useState, useEffect } from 'react';
import { Dices, Save, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface WheelSlice {
  id: number;
  label: string;
  bonusAmount: number;
  probabilityPercent: number;
}

const defaultSlices: WheelSlice[] = [
  { id: 1, label: '₹2 Bonus', bonusAmount: 2, probabilityPercent: 40 },
  { id: 2, label: '₹5 Bonus', bonusAmount: 5, probabilityPercent: 30 },
  { id: 3, label: '₹10 Bonus', bonusAmount: 10, probabilityPercent: 15 },
  { id: 4, label: '₹15 Bonus', bonusAmount: 15, probabilityPercent: 10 },
  { id: 5, label: '₹20 Mega Bonus', bonusAmount: 20, probabilityPercent: 5 },
];

export default function SpinWheelConfigPage() {
  const [slices, setSlices] = useState<WheelSlice[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalProbability = slices.reduce((acc, curr) => acc + curr.probabilityPercent, 0);
  const isValidProbability = totalProbability === 100;

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/spin-wheel');
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setSlices(json.data.map((s: any) => ({
          id: s.id,
          label: s.label,
          bonusAmount: Number(s.bonus_amount),
          probabilityPercent: Number(s.probability_percent),
        })));
      } else {
        // Use defaults if no config exists in DB yet
        setSlices(defaultSlices);
      }
    } catch (err) {
      console.warn('Failed to fetch spin wheel config:', err);
      setSlices(defaultSlices);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleProbChange = (id: number, val: number) => {
    setSlices(prev => prev.map(s => s.id === id ? { ...s, probabilityPercent: Math.max(0, val) } : s));
  };

  const handleAmountChange = (id: number, val: number) => {
    setSlices(prev => prev.map(s => s.id === id ? { ...s, bonusAmount: Math.max(0, val), label: `₹${val} Bonus` } : s));
  };

  const addSlice = () => {
    const newId = slices.length > 0 ? Math.max(...slices.map(s => s.id)) + 1 : 1;
    setSlices([...slices, { id: newId, label: '₹1 Bonus', bonusAmount: 1, probabilityPercent: 0 }]);
  };

  const removeSlice = (id: number) => {
    if (slices.length <= 2) return;
    setSlices(prev => prev.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    if (!isValidProbability || saving) return;
    try {
      setSaving(true);
      const res = await fetch('/api/admin/spin-wheel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SAVE_CONFIG', slices })
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      } else {
        console.error('Save failed:', json.error);
      }
    } catch (err) {
      console.warn('Failed to save spin wheel config:', err);
    } finally {
      setSaving(false);
    }
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
        <div className="flex items-center gap-2">
          <button
            onClick={fetchConfig}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-indigo-600' : ''} /> Refresh
          </button>
          <button
            onClick={addSlice}
            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Slice
          </button>
          <button
            onClick={handleSave}
            disabled={!isValidProbability || saving}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save to Supabase'}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-semibold text-xs rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 size={18} className="text-emerald-600" /> Spin wheel configuration saved to Supabase and published live!
        </div>
      )}

      {/* Loading State */}
      {loading && slices.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">Loading spin wheel config from Supabase...</p>
        </div>
      )}

      {/* Total Probability Validation Bar */}
      {slices.length > 0 && (
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
      )}

      {/* Slices Configurator Card */}
      {slices.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Wheel Slice Probability Distribution</h3>
              <p className="text-xs text-slate-500">Set the bonus cash reward and probability percentage for each slice.</p>
            </div>
            <button 
              onClick={() => setSlices(defaultSlices)}
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

                  <button
                    onClick={() => removeSlice(slice.id)}
                    disabled={slices.length <= 2}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-colors disabled:opacity-30"
                    title="Remove Slice"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
