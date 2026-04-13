'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDependents, useGrowthRecords } from '../lib/hooks';
import { PageSkeleton, CardSkeleton } from '../components/LoadingSkeleton';
import { Baby, Ruler, Weight, Star, TrendingUp, Plus } from 'lucide-react';

export default function GrowthPage() {
  const params = useParams();
  const id = (params?.id as string | undefined) || (params?.dependent_id as string | undefined);
  const { data: dependents, isLoading: depsLoading } = useDependents();
  const deps = dependents ?? [];
  const children = deps.filter((d: any) => d.relation === 'child');
  const selected = id ? deps.find((d: any) => d.id === id) : children[0];
  const childId = selected?.id;
  const { data: growthData, isLoading: growthLoading } = useGrowthRecords(childId);

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
  const latest = records[records.length - 1];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-800 text-2xl text-white mb-1">Growth Tracking</h1>
        <p className="text-sm text-white/35 mb-6">Monitor developmental milestones and measurements</p>
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
          { label: 'Height', value: latest ? `${latest.height} cm` : 'N/A', icon: Ruler, color: 'teal' },
          { label: 'Weight', value: latest ? `${latest.weight} kg` : 'N/A', icon: Weight, color: 'navy' },
          { label: 'Latest Milestone', value: latest?.milestone || 'N/A', icon: Star, color: 'warm' },
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
            {records.map((r, i) => {
              const maxW = Math.max(...records.map(x => x.weight));
              const h = (r.weight / maxW) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-white/40">{r.weight}kg</span>
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg"
                  />
                  <span className="text-[9px] text-white/20 truncate w-full text-center">{new Date(r.date).toLocaleDateString('en-IN', { month: 'short' })}</span>
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
          {[...records].reverse().map((r, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02]">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                <Baby size={16} className="text-teal-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white">{r.height} cm</span>
                  <span className="text-white/10">|</span>
                  <span className="text-sm text-white">{r.weight} kg</span>
                </div>
                {r.milestone && <p className="text-xs text-warm-400 mt-0.5">🌟 {r.milestone}</p>}
              </div>
              <span className="text-xs text-white/20">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
