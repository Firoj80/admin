'use client';

import { useState, useEffect } from 'react';
import { Send, Bell, CheckCircle2, Smartphone, RefreshCw, Clock } from 'lucide-react';

interface SegmentCounts {
  ALL_USERS: number;
  ACTIVE_TODAY: number;
}

interface NotificationHistory {
  id: string;
  title: string;
  body: string;
  segment: string;
  status: string;
  sent_at: string;
}

export default function PushStudioPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [segment, setSegment] = useState('ALL_USERS');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [segments, setSegments] = useState<SegmentCounts>({ ALL_USERS: 0, ACTIVE_TODAY: 0 });
  const [history, setHistory] = useState<NotificationHistory[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/push-notifications');
      const json = await res.json();
      if (json.success && json.data) {
        setSegments(json.data.segments || { ALL_USERS: 0, ACTIVE_TODAY: 0 });
        setHistory(json.data.history || []);
      }
    } catch (err) {
      console.warn('Failed to fetch push notification data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendBroadcast = async () => {
    if (!title || !body || sending) return;
    try {
      setSending(true);
      const res = await fetch('/api/admin/push-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_BROADCAST',
          title,
          body,
          segment
        })
      });
      const json = await res.json();
      if (json.success) {
        setSentSuccess(true);
        setTitle('');
        setBody('');
        fetchData(); // Refresh history
        setTimeout(() => setSentSuccess(false), 3000);
      }
    } catch (err) {
      console.warn('Failed to send broadcast:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            FCM Push Notification Broadcast Studio
            <span className="text-xs bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full font-semibold border border-sky-200/60">
              Firebase Admin SDK
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Compose and broadcast real-time mobile push notifications to targeted user segments.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="px-3 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-indigo-600' : ''} /> Refresh
        </button>
      </div>

      {/* Success Notification */}
      {sentSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-semibold text-xs rounded-xl flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600" /> Broadcast queued & pushed successfully to {segment.replace(/_/g, ' ')} segment!
        </div>
      )}

      {/* Main Grid: Composer & Mobile Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Composer (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Notification Broadcast Composer</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Target Audience Segment</label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="ALL_USERS">All Registered Players ({segments.ALL_USERS.toLocaleString()} players)</option>
                <option value="ACTIVE_TODAY">Active Today ({segments.ACTIVE_TODAY.toLocaleString()} players)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Push Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 🏆 Mega Ludo Tournament Tonight!"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Push Message Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder="e.g. Deposit ₹100 and get ₹20 bonus cash free! Limited slots remaining."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSendBroadcast}
              disabled={!title || !body || sending}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Send size={15} /> {sending ? 'Sending...' : 'Broadcast FCM Push Notification'}
            </button>
          </div>
        </div>

        {/* Live Mobile Notification Card Preview (1 Column) */}
        <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-sm border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider pb-3 border-b border-slate-800">
              <Smartphone size={16} className="text-indigo-400" /> Android Device Preview
            </div>

            {/* Simulated Android Notification Banner */}
            <div className="mt-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    KH
                  </div>
                  <span className="text-xs font-bold text-slate-200">KhiladiHub</span>
                </div>
                <span className="text-[10px] text-slate-400">now</span>
              </div>

              <div className="space-y-1 pt-1">
                <h4 className="font-bold text-sm text-white leading-snug">{title || 'Push Title Preview'}</h4>
                <p className="text-xs text-slate-300 leading-normal line-clamp-3">{body || 'Push message body text will render here...'}</p>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-500 font-medium">
            FCM Token Payload verified • Compatible with Android 14+
          </div>
        </div>

      </div>

      {/* Notification History */}
      {history.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-base">Recent Broadcast History</h3>
            <p className="text-xs text-slate-500">Last {history.length} push notifications sent from this studio</p>
          </div>
          <div className="divide-y divide-slate-100">
            {history.map((notif) => (
              <div key={notif.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200">
                    <Bell size={14} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{notif.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{notif.body}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-semibold">{notif.segment}</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(notif.sent_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
