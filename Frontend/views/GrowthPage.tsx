'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDependents, useGrowthRecords, useAddGrowthRecord } from '../lib/hooks';
import { PageSkeleton, CardSkeleton } from '../components/LoadingSkeleton';
import { Baby, Ruler, Weight, Star, TrendingUp, Plus } from 'lucide-react';

export default function GrowthPage() {
  const params = useParams();
  const id = (params?.id as string | undefined) || (params?.dependent_id as string | undefined);
  const { data: dependents, isLoading: depsLoading } = useDependents();
  const deps = dependents ?? [];
  const children = deps.filter((d: any) => d.type === 'child');
  const selected = id ? deps.find((d: any) => d.id === id) : children[0];
  const childId = selected?.id;
  const { data: growthData, isLoading: growthLoading } = useGrowthRecords(childId);
  const addRecord = useAddGrowthRecord();
  
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    height_cm: '',
    weight_kg: '',
    milestone_achieved: '',
    recorded_date: new Date().toISOString().split('T')[0],
  });

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childId) return;
    
    setIsSubmitting(true);
    try {
      await addRecord.mutateAsync({
        depId: childId,
        data: {
          ...formData,
          height_cm: formData.height_cm ? parseFloat(formData.height_cm) : undefined,
          weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : undefined,
        }
      });
      setShowModal(false);
      setFormData({
        height_cm: '',
        weight_kg: '',
        milestone_achieved: '',
        recorded_date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Failed to add growth record:', err);
      alert('Failed to save record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (depsLoading) return <PageSkeleton />;

  if (!selected && children.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <h1 className="font-heading font-800 text-2xl text-white mb-4">Growth Tracking</h1>
        <div className="text-center py-20">
          <Baby size={48} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30">No children registered. Add a child to start tracking growth.</p>
        </div>
      </div>
    );
  }

  const child = selected || children[0];
  const records = (growthData ?? []) as any[];
  const latest = records[0]; // Records are sorted desc by recorded_date in backend

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start mb-6">
        <div>
          <h1 className="font-heading font-800 text-2xl text-white mb-1">Growth Tracking</h1>
          <p className="text-sm text-white/35">Monitor developmental milestones and measurements</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-teal-500 hover:bg-teal-400 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-95"
        >
          <Plus size={20} />
        </button>
      </motion.div>

      {/* Child Selector */}
      {children.length > 1 && (
        <div className="flex gap-2 mb-6">
          {children.map(c => (
            <Link key={c.id} href={`/growth/${c.id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${child.id === c.id ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20' : 'bg-surface-800/40 text-white/35 border border-white/[0.06]'}`}>
              <span>{c.avatar}</span> {c.name}
            </Link>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Height', value: latest?.height_cm ? `${latest.height_cm} cm` : 'N/A', icon: Ruler, color: 'teal' },
          { label: 'Weight', value: latest?.weight_kg ? `${latest.weight_kg} kg` : 'N/A', icon: Weight, color: 'navy' },
          { label: 'Latest Milestone', value: latest?.milestone_achieved || 'N/A', icon: Star, color: 'warm' },
          { label: 'Records', value: `${records.length}`, icon: TrendingUp, color: 'sage' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`bg-${s.color}-500/[0.06] border border-${s.color}-500/15 rounded-2xl p-4`}>
            <s.icon size={16} className={`text-${s.color}-400 mb-2`} />
            <p className="font-heading font-700 text-sm text-white truncate">{s.value}</p>
            <p className="text-xs text-white/30">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Growth Chart Visualization */}
      {records.length > 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-surface-800/40 border border-white/[0.06] rounded-2xl p-5 mb-6">
          <h2 className="font-heading font-700 text-sm text-white mb-4">Growth Trend</h2>
          <div className="flex items-end gap-3 h-40">
            {records.slice(0, 7).reverse().map((r, i) => {
              const weights = records.map(x => x.weight_kg).filter(Boolean);
              const maxW = weights.length > 0 ? Math.max(...weights) : 10;
              const h = r.weight_kg ? (r.weight_kg / maxW) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-white/40">{r.weight_kg}kg</span>
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg"
                  />
                  <span className="text-[9px] text-white/20 truncate w-full text-center">{new Date(r.recorded_date).toLocaleDateString('en-IN', { month: 'short' })}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Milestone Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-surface-800/40 border border-white/[0.06] rounded-2xl p-5">
        <h2 className="font-heading font-700 text-sm text-white mb-4">Measurement Log</h2>
        <div className="space-y-3">
          {records.map((r, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02]">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                <Baby size={16} className="text-teal-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white">{r.height_cm} cm</span>
                  <span className="text-white/10">|</span>
                  <span className="text-sm text-white">{r.weight_kg} kg</span>
                </div>
                {r.milestone_achieved && <p className="text-xs text-warm-400 mt-0.5">🌟 {r.milestone_achieved}</p>}
              </div>
              <span className="text-xs text-white/20">{new Date(r.recorded_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add Record Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-900 border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading font-800 text-xl text-white">Add Measurement</h2>
              <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5 ml-1">Height (cm)</label>
                  <input
                    type="number" step="0.1"
                    value={formData.height_cm}
                    onChange={e => setFormData({...formData, height_cm: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-teal-500/50 outline-none transition-all"
                    placeholder="75.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5 ml-1">Weight (kg)</label>
                  <input
                    type="number" step="0.1"
                    value={formData.weight_kg}
                    onChange={e => setFormData({...formData, weight_kg: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-teal-500/50 outline-none transition-all"
                    placeholder="9.2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5 ml-1">Date of Measurement</label>
                <input
                  type="date"
                  value={formData.recorded_date}
                  onChange={e => setFormData({...formData, recorded_date: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-teal-500/50 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5 ml-1">Milestone (Optional)</label>
                <input
                  type="text"
                  value={formData.milestone_achieved}
                  onChange={e => setFormData({...formData, milestone_achieved: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-teal-500/50 outline-none transition-all"
                  placeholder="Started walking, first tooth, etc."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white/60 font-medium hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-teal-500 text-white font-bold hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/20"
                >
                  {isSubmitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
