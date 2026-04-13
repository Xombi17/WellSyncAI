'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMedicines, useDependents } from '../lib/hooks';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { Pill, Plus, ShieldCheck, AlertTriangle, ShieldX, CheckCircle2, StopCircle } from 'lucide-react';

export default function MedicinesPage() {
  const { data: medicines, isLoading } = useMedicines();
  const { data: dependents } = useDependents();
  const [showActive, setShowActive] = useState(true);

  const meds = medicines ?? [];
  const deps = dependents ?? [];
  const displayed = meds.filter((m: any) => m.active === showActive);
  const getDepName = (id: string) => deps.find((d: any) => d.id === id)?.name || 'Unknown';

  const safetyConfig = (s: string) => {
    if (s === 'safe') return { icon: ShieldCheck, color: 'text-teal-400', bg: 'bg-teal-500/10', label: 'Safe' };
    if (s === 'caution') return { icon: AlertTriangle, color: 'text-warm-400', bg: 'bg-warm-500/10', label: 'Caution' };
    return { icon: ShieldX, color: 'text-coral-400', bg: 'bg-coral-500/10', label: 'Avoid' };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-800 text-2xl text-white mb-1">Medicines</h1>
          <p className="text-sm text-white/35">Track medications for your family</p>
        </div>
        <Link href="/medicines/add" className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-surface-950 font-heading font-700 text-sm rounded-xl transition-all">
          <Plus size={16} /> Add Medicine
        </Link>
      </motion.div>

      {/* Toggle */}
      <div className="flex gap-2 mb-6">
        {[true, false].map(active => (
          <button key={String(active)} onClick={() => setShowActive(active)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showActive === active ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20' : 'bg-surface-800/40 text-white/35 border border-white/[0.06]'}`}>
            {active ? 'Active' : 'Completed'} ({meds.filter((m: any) => m.active === active).length})
          </button>
        ))}
      </div>

      {/* Medicine Cards */}
      {isLoading ? <CardSkeleton count={3} /> : (
      <div className="space-y-4">
        {displayed.map((med: any, i: number) => {
          const sc = safetyConfig(med.safety);
          const progress = med.total_doses ? (med.doses_taken / med.total_doses) * 100 : 0;
          return (
            <motion.div key={med.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-surface-800/40 border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-500/10 flex items-center justify-center flex-shrink-0">
                    <Pill size={18} className="text-navy-300" />
                  </div>
                  <div>
                    <p className="text-sm font-heading font-700 text-white">{med.name}</p>
                    <p className="text-xs text-white/30 mt-0.5">{med.dosage} · {med.frequency}</p>
                    <p className="text-xs text-white/20 mt-0.5">For: {getDepName(med.for_dependent)}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${sc.bg}`}>
                  <sc.icon size={12} className={sc.color} />
                  <span className={`text-xs font-medium ${sc.color}`}>{sc.label}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/30">Adherence</span>
                  <span className="text-white/50">{med.doses_taken}/{med.total_doses} doses</span>
                </div>
                <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {med.active && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => {}}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 text-teal-400 rounded-lg text-xs font-medium hover:bg-teal-500/20 transition-colors">
                    <CheckCircle2 size={12} /> Mark Dose Taken
                  </button>
                  <button onClick={() => {}}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-coral-500/10 text-coral-400 rounded-lg text-xs font-medium hover:bg-coral-500/20 transition-colors">
                    <StopCircle size={12} /> Stop Course
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      )}

      {!isLoading && displayed.length === 0 && (
        <div className="text-center py-16">
          <Pill size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30">No {showActive ? 'active' : 'completed'} medicines.</p>
        </div>
      )}
    </div>
  );
}
