'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDependents, useScanMedicine, useCreateMedicine } from '../lib/hooks';
import { useAuthStore } from '../lib/auth-store';
import { Camera, Upload, Sparkles, Pill, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function MedicineScannerPage() {
  const router = useRouter();
  const { data: dependents } = useDependents();
  const scanMutation = useScanMedicine();
  const createMutation = useCreateMedicine();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [safety, setSafety] = useState<'safe' | 'caution' | 'avoid'>('safe');
  const [forDep, setForDep] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const deps = dependents ?? [];
  if (!forDep && deps.length > 0 && deps[0].id) {
    // Will be set on first render
  }

  const handleScan = async (file?: File) => {
    if (!file) {
      return;
    }
    setScanning(true);
    scanMutation.mutate(file, {
      onSuccess: (data) => {
        setName(data.name);
        setDosage(data.dosage);
        setFrequency(data.frequency);
        setSafety(data.safety as any);
        setScanning(false);
        setScanned(true);
      },
      onError: () => {
        setScanning(false);
      },
    });
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedFile(file);
        handleScan(file);
      }
    };
    input.click();
  };

  const handleAdd = () => {
    if (!name) return;
    const depTarget = forDep || deps[0]?.id || '';
    createMutation.mutate({
      depId: depTarget,
      data: {
        name, dosage, frequency, for_dependent: depTarget, safety, active: true,
        start_date: new Date().toISOString().split('T')[0],
        doses_taken: 0, total_doses: frequency.includes('5 days') ? 15 : 30,
      },
    }, {
      onSuccess: () => router.push('/medicines'),
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => router.push('/medicines')} className="flex items-center gap-2 text-white/40 hover:text-white/60 text-sm mb-6">
          <ArrowLeft size={16} /> Back to Medicines
        </button>

        <h1 className="font-heading font-800 text-2xl text-white mb-1">Add Medicine</h1>
        <p className="text-sm text-white/35 mb-8">Scan a medicine strip or enter details manually</p>

        {/* Scanner Area */}
        {!scanned && (
          <div className="bg-surface-800/40 border border-white/[0.06] rounded-2xl p-6 mb-6">
            <div className="border-2 border-dashed border-white/[0.08] rounded-xl p-8 text-center">
              {scanning ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={32} className="text-teal-400 animate-spin" />
                  <p className="text-sm text-teal-400">Scanning with AI Vision...</p>
                  <p className="text-xs text-white/30">Extracting medicine name, dosage & safety info</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                    <Camera size={28} className="text-teal-400" />
                  </div>
                  <p className="text-sm text-white/60">Snap a photo of the medicine strip or prescription</p>
                  <div className="flex gap-3">
                    <button onClick={handleFileSelect} className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 text-surface-950 font-heading font-700 text-sm rounded-xl">
                      <Camera size={14} /> Scan Medicine
                    </button>
                    <button onClick={handleFileSelect} className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] text-white/60 border border-white/[0.08] font-medium text-sm rounded-xl">
                      <Upload size={14} /> Upload Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
            {!scanning && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-warm-500/[0.06] border border-warm-500/15 rounded-xl">
                <Sparkles size={14} className="text-warm-400 flex-shrink-0" />
                <p className="text-xs text-white/40">AI-powered OCR extracts medicine details automatically, reducing manual typing for low-literacy users.</p>
              </div>
            )}
          </div>
        )}

        {/* Scanned / Manual Form */}
        {scanned && (
          <div className="bg-teal-500/[0.06] border border-teal-500/15 rounded-xl p-3 mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-teal-400" />
            <p className="text-xs text-teal-400">AI extracted medicine details. Please verify and edit if needed.</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Medicine Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Amoxicillin 250mg"
              className="w-full px-4 py-3 bg-surface-800/40 border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-teal-500/30 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Dosage</label>
              <input type="text" value={dosage} onChange={e => setDosage(e.target.value)} placeholder="e.g. 5ml"
                className="w-full px-4 py-3 bg-surface-800/40 border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-teal-500/30 text-sm" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1.5 block">Safety</label>
              <div className="flex gap-2">
                {(['safe', 'caution', 'avoid'] as const).map(s => (
                  <button key={s} onClick={() => setSafety(s)}
                    className={`flex-1 py-3 rounded-xl text-xs font-medium capitalize transition-all ${safety === s ? (s === 'safe' ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20' : s === 'caution' ? 'bg-warm-500/15 text-warm-400 border border-warm-500/20' : 'bg-coral-500/15 text-coral-400 border border-coral-500/20') : 'bg-surface-800/40 text-white/35 border border-white/[0.06]'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Frequency</label>
            <input type="text" value={frequency} onChange={e => setFrequency(e.target.value)} placeholder="e.g. Twice daily after meals"
              className="w-full px-4 py-3 bg-surface-800/40 border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-teal-500/30 text-sm" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">For Family Member</label>
            <div className="flex flex-wrap gap-2">
              {deps.map((d: any) => (
                <button key={d.id} onClick={() => setForDep(d.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${(forDep || deps[0]?.id) === d.id ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20' : 'bg-surface-800/40 text-white/40 border border-white/[0.06]'}`}>
                  <span>{d.avatar ?? '\ud83d\udc64'}</span> {d.name}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleAdd} disabled={createMutation.isPending} className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-surface-950 font-heading font-700 rounded-xl transition-all mt-4 disabled:opacity-60">
            Add Medicine
          </button>
        </div>
      </motion.div>
    </div>
  );
}
