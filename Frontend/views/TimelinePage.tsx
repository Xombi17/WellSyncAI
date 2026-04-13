'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../lib/auth-store';
import { useDependents, useTimeline, useAllTimelines, useCompleteEvent } from '../lib/hooks';
import { CardSkeleton } from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import { CalendarClock, Pill, Baby, Heart, Sparkles, X, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

type Category = 'all' | 'vaccine' | 'medicine' | 'growth' | 'pregnancy' | 'checkup';

export default function TimelinePage() {
  const params = useParams();
  const depId = (params?.depId as string | undefined) || (params?.dependent_id as string | undefined);
  const [filter, setFilter] = useState<Category>('all');
  const [aiOpen, setAiOpen] = useState<string | null>(null);
  const { data: deps } = useDependents();
  const { data: depTimeline, isLoading: depLoading, error: depError, refetch: refetchDep } = useTimeline(depId);
  const { data: allTimelines, isLoading: allLoading, error: allError, refetch: refetchAll } = useAllTimelines();
  const completeMutation = useCompleteEvent();

  const dep = depId ? (deps ?? []).find((d: any) => d.id === depId) : null;
  const isLoading = depId ? depLoading : allLoading;
  const error = depId ? depError : allError;
  const refetch = depId ? refetchDep : refetchAll;

  const rawEvents = depId
    ? (depTimeline ?? []).map((e: any) => ({ ...e, dep_name: dep?.name, dep_avatar: dep?.avatar, dep_id: depId }))
    : (allTimelines ?? []);

  const allEvents = [...rawEvents].sort((a: any, b: any) => {
    const order: Record<string, number> = { overdue: 0, due: 1, upcoming: 2, completed: 3 };
    return (order[a.status] ?? 4) - (order[b.status] ?? 4) || new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const filtered = filter === 'all' ? allEvents : allEvents.filter((e: any) => e.category === filter);

  if (error) return <div className="p-8"><ErrorState message="Failed to load timeline" onRetry={() => refetch()} /></div>;

  const statusConfig = (s: string) => {
    if (s === 'overdue') return { color: 'bg-coral-500', border: 'border-coral-500/30', text: 'text-coral-400', bg: 'bg-coral-500/10', icon: AlertTriangle };
    if (s === 'due') return { color: 'bg-warm-500', border: 'border-warm-500/30', text: 'text-warm-400', bg: 'bg-warm-500/10', icon: Clock };
    if (s === 'completed') return { color: 'bg-teal-500', border: 'border-teal-500/30', text: 'text-teal-400', bg: 'bg-teal-500/10', icon: CheckCircle2 };
    return { color: 'bg-navy-400', border: 'border-navy-400/30', text: 'text-navy-300', bg: 'bg-navy-500/10', icon: CalendarClock };
  };

  const catIcon = (c: string) => {
    if (c === 'vaccine') return CalendarClock;
    if (c === 'medicine') return Pill;
    if (c === 'growth') return Baby;
    return Heart;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        {dep ? (
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">{dep.avatar}</span>
            <div>
              <h1 className="font-heading font-800 text-2xl text-white">{dep.name}</h1>
              <p className="text-sm text-white/35 capitalize">{dep.relation} · DOB: {new Date(dep.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        ) : (
          <>
            <h1 className="font-heading font-800 text-2xl text-white mb-1">Health Timeline</h1>
            <p className="text-sm text-white/35">All health events for your family</p>
          </>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2 mb-6">
        {[{ key: 'all' as Category, label: 'All' }, { key: 'vaccine' as Category, label: 'Vaccines' }, { key: 'medicine' as Category, label: 'Medicines' }, { key: 'growth' as Category, label: 'Growth' }, { key: 'pregnancy' as Category, label: 'Pregnancy' }, { key: 'checkup' as Category, label: 'Checkups' }].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f.key ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20' : 'bg-surface-800/40 text-white/35 border border-white/[0.06] hover:text-white/60'}`}>
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Timeline */}
      {isLoading ? <CardSkeleton count={5} /> : (
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/[0.06]" />
        <div className="space-y-4">
          {filtered.map((event, i) => {
            const sc = statusConfig(event.status);
            const Icon = catIcon(event.category);
            return (
              <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="relative pl-12">
                <div className={`absolute left-3.5 top-4 w-3 h-3 rounded-full ${sc.color} border-2 border-surface-950 z-10`} />
                <div className={`bg-surface-800/40 border border-white/[0.06] rounded-2xl p-4 hover:bg-surface-800/60 transition-colors`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-9 h-9 rounded-xl ${sc.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={16} className={sc.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-white">{event.title}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${sc.text} ${sc.bg} ${sc.border}`}>{event.status}</span>
                        </div>
                        <p className="text-xs text-white/30 mt-0.5">{event.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {!depId && <span className="text-xs text-white/40">{event.dep_avatar} {event.dep_name}</span>}
                          <span className="text-xs text-white/20">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {event.ai_explanation && (
                        <button onClick={() => setAiOpen(aiOpen === event.id ? null : event.id)} className="p-1.5 rounded-lg bg-warm-500/10 text-warm-400 hover:bg-warm-500/20 transition-colors" title="AI Explanation">
                          <Sparkles size={14} />
                        </button>
                      )}
                      {(event.status === 'due' || event.status === 'overdue') && (
                        <button onClick={() => completeMutation.mutate(event.id)} disabled={completeMutation.isPending} className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors disabled:opacity-50" title="Mark Complete">
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {aiOpen === event.id && event.ai_explanation && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-3 pt-3 border-t border-white/[0.06]">
                          <div className="flex items-start gap-2">
                            <Sparkles size={14} className="text-warm-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-warm-400 mb-1">AI Explanation</p>
                              <p className="text-xs text-white/50 leading-relaxed">{event.ai_explanation}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <CalendarClock size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30">No events found for this filter.</p>
        </div>
      )}
    </div>
  );
}
