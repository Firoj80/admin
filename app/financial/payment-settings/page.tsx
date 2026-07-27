'use client';

import { useState, useEffect } from 'react';
import { Wallet, QrCode, Building2, Layers, Save, Plus, Trash2, CheckCircle2, RefreshCw, AlertCircle, Upload, Loader2 } from 'lucide-react';

interface PaymentConfigData {
  upiIds: string[];
  qrCodes: string[];
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolder: string;
  depositBundles: number[];
  minWithdrawal: number;
  maxWithdrawal: number;
}

export default function PaymentSettingsPage() {
  const [config, setConfig] = useState<PaymentConfigData>({
    upiIds: ['khiladihub1@okaxis', 'paykhiladi@ibl', 'gaminghub@ybl'],
    qrCodes: [
      'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=khiladihub1@okaxis&pn=KhiladiHub',
      'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=paykhiladi@ibl&pn=KhiladiHub',
      'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=gaminghub@ybl&pn=KhiladiHub',
      'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=khiladihub1@okaxis&pn=KhiladiHub',
      'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=paykhiladi@ibl&pn=KhiladiHub'
    ],
    bankName: 'HDFC Bank',
    accountNumber: '50200054896231',
    ifscCode: 'HDFC0001234',
    accountHolder: 'KhiladiHub Gaming Pvt Ltd',
    depositBundles: [100, 200, 500, 1000, 2000, 5000],
    minWithdrawal: 100,
    maxWithdrawal: 100000
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [newBundleInput, setNewBundleInput] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const handleFileUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIdx(idx);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('index', String(idx + 1));

      const res = await fetch('/api/admin/upload-qr', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (json.success && json.url) {
        handleQrChange(idx, json.url);
        setSaveSuccess(`QR Code #${idx + 1} uploaded to Supabase Storage! Remember to click Save Configuration.`);
        setTimeout(() => setSaveSuccess(''), 5000);
      } else {
        alert(json.error || 'Failed to upload QR Code image to Supabase Storage.');
      }
    } catch (err) {
      console.warn('QR Upload error:', err);
      alert('An error occurred during QR image upload.');
    } finally {
      setUploadingIdx(null);
    }
  };

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/payment-config');
      const json = await res.json();
      if (json.success && json.data) {
        setConfig(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch payment config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess('');
      const res = await fetch('/api/admin/payment-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess('Payment configuration and deposit bundles updated successfully!');
        setTimeout(() => setSaveSuccess(''), 5000);
      }
    } catch (err) {
      console.warn('Error saving config:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpiChange = (index: number, val: string) => {
    const updated = [...config.upiIds];
    updated[index] = val;
    setConfig({ ...config, upiIds: updated });
  };

  const handleQrChange = (index: number, val: string) => {
    const updated = [...config.qrCodes];
    updated[index] = val;
    setConfig({ ...config, qrCodes: updated });
  };

  const handleAddBundle = () => {
    const amount = Number(newBundleInput);
    if (amount > 0 && !config.depositBundles.includes(amount)) {
      const updated = [...config.depositBundles, amount].sort((a, b) => a - b);
      setConfig({ ...config, depositBundles: updated });
      setNewBundleInput('');
    }
  };

  const handleRemoveBundle = (amount: number) => {
    const updated = config.depositBundles.filter(b => b !== amount);
    setConfig({ ...config, depositBundles: updated });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Wallet Payment & Deposit Bundle Settings
          </h1>
          <p className="text-sm text-slate-500">
            Configure 3 rotating UPI IDs, 5 rotating QR codes, Bank Transfer details, and exact Deposit Amount Bundles.
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
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-md transition-colors inline-flex items-center gap-2"
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
          <span className="text-sm font-semibold">{saveSuccess}</span>
        </div>
      )}

      {/* 1. UPI ID Rotation Pool (3 UPI IDs) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Wallet size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Rotating UPI IDs (3 IDs)</h2>
              <p className="text-xs text-slate-500">
                The Android app randomly picks 1 of these 3 UPI IDs each time a user initiates a deposit.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                UPI ID #{idx + 1}
              </label>
              <input
                type="text"
                value={config.upiIds[idx] || ''}
                onChange={(e) => handleUpiChange(idx, e.target.value)}
                placeholder={`e.g. upi${idx + 1}@okaxis`}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. QR Code URL Pool (5 QR Codes) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <QrCode size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">2. Rotating QR Code Images (5 QRs)</h2>
              <p className="text-xs text-slate-500">
                Provide image URLs for 5 QR codes. The Android app rotates through these randomly for users.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50/70 border border-slate-200/80 rounded-lg">
              <span className="text-xs font-bold text-slate-600 uppercase w-20 shrink-0">
                QR Code #{idx + 1}
              </span>
              <input
                type="text"
                value={config.qrCodes[idx] || ''}
                onChange={(e) => handleQrChange(idx, e.target.value)}
                placeholder="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
              />
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 rounded-lg text-xs font-semibold transition-colors shrink-0">
                {uploadingIdx === idx ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={13} /> Upload QR
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(idx, e)}
                  disabled={uploadingIdx === idx}
                  className="hidden"
                />
              </label>
              {config.qrCodes[idx] && (
                <div className="w-9 h-9 shrink-0 rounded border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
                  <img
                    src={config.qrCodes[idx]}
                    alt={`QR ${idx + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=error';
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Deposit Amount Bundles (Fixed Bundles, No Custom Amount) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">3. Deposit Amount Bundles</h2>
              <p className="text-xs text-slate-500">
                Set exact deposit amounts users can choose from. Custom amount input is removed in the app.
              </p>
            </div>
          </div>
        </div>

        {/* Display Current Bundles */}
        <div className="flex flex-wrap items-center gap-2">
          {config.depositBundles.map((amount) => (
            <div
              key={amount}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm"
            >
              <span>₹{amount.toLocaleString()}</span>
              {config.depositBundles.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveBundle(amount)}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove bundle"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Bundle Amount */}
        <div className="flex items-center gap-2 max-w-sm pt-2">
          <input
            type="number"
            value={newBundleInput}
            onChange={(e) => setNewBundleInput(e.target.value)}
            placeholder="Enter bundle amount (e.g. 1000)"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="button"
            onClick={handleAddBundle}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors inline-flex items-center gap-1 shrink-0"
          >
            <Plus size={14} /> Add Bundle
          </button>
        </div>
      </div>

      {/* 4. Withdrawal Limits */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Wallet size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">4. Withdrawal Limits</h2>
              <p className="text-xs text-slate-500">
                Configure the minimum and maximum amount a user can withdraw at once.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Withdrawal Amount (₹)</label>
            <input
              type="number"
              value={config.minWithdrawal}
              onChange={(e) => setConfig({ ...config, minWithdrawal: Number(e.target.value) || 100 })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
              min={1}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Withdrawal Amount (₹)</label>
            <input
              type="number"
              value={config.maxWithdrawal}
              onChange={(e) => setConfig({ ...config, maxWithdrawal: Number(e.target.value) || 100000 })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
              min={1}
            />
          </div>
        </div>
      </div>

      {/* Section 4: Bank Transfer Details */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Building2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">5. Bank Transfer Details</h2>
              <p className="text-xs text-slate-500">
                Shown to users who choose the Bank Transfer (NEFT/IMPS) deposit method.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
            <input
              type="text"
              value={config.bankName}
              onChange={(e) => setConfig({ ...config, bankName: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
            <input
              type="text"
              value={config.accountNumber}
              onChange={(e) => setConfig({ ...config, accountNumber: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">IFSC Code</label>
            <input
              type="text"
              value={config.ifscCode}
              onChange={(e) => setConfig({ ...config, ifscCode: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Holder Name</label>
            <input
              type="text"
              value={config.accountHolder}
              onChange={(e) => setConfig({ ...config, accountHolder: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
