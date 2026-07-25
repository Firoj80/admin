'use client';

import { useState } from 'react';
import { Dices, Plus, Edit3, Check, X, ShieldAlert, Eye, EyeOff, Sparkles, Layers } from 'lucide-react';

interface GameCategory {
  id: string;
  name: string;
  is_active: boolean;
  display_order: number;
  icon: string;
  description: string;
  activePoolsCount?: number;
}

const initialCategories: GameCategory[] = [
  { id: 'ludo_king', name: 'Ludo King', is_active: true, display_order: 1, icon: '🎲', description: 'Classic 1v1 Ludo board matches with room code pairing', activePoolsCount: 4 },
  { id: 'carrom', name: 'Carrom', is_active: true, display_order: 2, icon: '🎯', description: 'Realtime 1v1 Carrom board clashes and tournaments', activePoolsCount: 2 },
  { id: 'chess', name: 'Chess', is_active: true, display_order: 3, icon: '♟️', description: 'Speed Blitz Chess battles with timed clock moves', activePoolsCount: 1 },
];

export default function GamesManagerPage() {
  const [categories, setCategories] = useState<GameCategory[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<GameCategory | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('🎮');
  const [formDescription, setFormDescription] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  const toggleCategoryStatus = (id: string) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, is_active: !cat.is_active } : cat));
  };

  const openAddModal = () => {
    setFormId('');
    setFormName('');
    setFormIcon('🎮');
    setFormDescription('');
    setFormIsActive(true);
    setShowAddModal(true);
  };

  const openEditModal = (cat: GameCategory) => {
    setEditingCategory(cat);
    setFormId(cat.id);
    setFormName(cat.name);
    setFormIcon(cat.icon);
    setFormDescription(cat.description);
    setFormIsActive(cat.is_active);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? {
        ...c,
        name: formName,
        icon: formIcon,
        description: formDescription,
        is_active: formIsActive
      } : c));
      setEditingCategory(null);
    } else {
      const newCat: GameCategory = {
        id: formId.toLowerCase().replace(/\s+/g, '_') || `game_${Date.now()}`,
        name: formName,
        icon: formIcon,
        description: formDescription,
        is_active: formIsActive,
        display_order: categories.length + 1,
        activePoolsCount: 0
      };
      setCategories([...categories, newCat]);
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Dices size={24} className="text-indigo-600" />
            Game Category & App Visibility Manager
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold border border-indigo-200/60">
              {categories.filter(c => c.is_active).length} / {categories.length} Enabled in App
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Control which game categories are enabled or hidden inside the native mobile application home screen.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={16} /> Add New Game Category
        </button>
      </div>

      {/* Info Notice Box */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-800">
        <Sparkles size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-amber-900 block mb-0.5">Mobile App Realtime Synchronization:</strong>
          The native Android app dynamically fetches categories where <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono font-bold">is_active = true</code>. Disabling a category here instantly hides its banner and match selection list from all players.
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className={`bg-white border rounded-xl p-5 shadow-sm space-y-4 transition-all flex flex-col justify-between ${
              cat.is_active ? 'border-slate-200 hover:border-indigo-300' : 'border-slate-200/60 bg-slate-50/60 opacity-80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{cat.icon}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                    title="Edit Category Details"
                  >
                    <Edit3 size={14} />
                  </button>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleCategoryStatus(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 transition-all shadow-2xs ${
                      cat.is_active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                    }`}
                  >
                    {cat.is_active ? (
                      <>
                        <Eye size={13} /> Enabled
                      </>
                    ) : (
                      <>
                        <EyeOff size={13} /> Hidden
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  {cat.name}
                  <span className="text-[10px] text-slate-400 font-mono font-normal">({cat.id})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Layers size={14} className="text-indigo-600" /> Active Contest Pools: <strong className="text-slate-800">{cat.activePoolsCount || 0}</strong>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                cat.is_active ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-200 text-slate-600'
              }`}>
                {cat.is_active ? 'Live in App' : 'Disabled'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {(showAddModal || editingCategory) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Dices size={18} className="text-indigo-600" /> 
                {editingCategory ? `Edit Game Category (${editingCategory.name})` : 'Add New Game Category'}
              </span>
              <button 
                onClick={() => { setShowAddModal(false); setEditingCategory(null); }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
              {!editingCategory && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category Slug ID</label>
                  <input 
                    type="text"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="e.g., ludo_king"
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Display Title Name</label>
                <input 
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Ludo King"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Icon Emoji / Symbol</label>
                <input 
                  type="text"
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  placeholder="e.g., 🎲 or 🎯"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xl text-center"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Description</label>
                <textarea 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief description displayed under category banner in mobile app..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox"
                  id="cat-active"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="cat-active" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Enable Category (Visible in Native Mobile App)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingCategory(null); }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check size={14} /> Save Game Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
