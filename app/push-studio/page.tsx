'use client';

import { useState } from 'react';
import { Send, Bell, CheckCircle2 } from 'lucide-react';

export default function PushStudioPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [segment, setSegment] = useState('ALL_USERS');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendBroadcast = () => {
    if (!title || !body) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setTitle('');
      setBody('');
    }, 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">FCM Push Notification Broadcast Studio</h1>
        <p className="text-sm text-slate-400">Compose and broadcast instant push notifications to user segments via Firebase Admin SDK.</p>
      </div>

      {sentSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 size={16} /> Broadcast sent successfully to {segment.replace('_', ' ')}!
        </div>
      )}

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Target User Segment</label>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm font-semibold rounded-xl p-3 focus:outline-none focus:border-amber-400"
            >
              <option value="ALL_USERS">All Registered Players</option>
              <option value="ACTIVE_TODAY">Active Today Players</option>
              <option value="HIGH_ROLLERS">High Rollers (Deposits &gt; ₹1,000)</option>
              <option value="INACTIVE_7_DAYS">Inactive &gt; 7 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Push Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 🏆 Mega Ludo Tournament Tonight!"
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm font-semibold rounded-xl p-3 focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Push Message Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="e.g. Deposit ₹100 and get ₹20 bonus cash free! Limited slots remaining."
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm font-semibold rounded-xl p-3 focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSendBroadcast}
            disabled={!title || !body}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-amber-400/20"
          >
            <Send size={16} /> Broadcast FCM Push Notification
          </button>
        </div>
      </div>
    </div>
  );
}
