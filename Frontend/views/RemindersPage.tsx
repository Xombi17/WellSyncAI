'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReminders, useDependents, useToggleReminder, useCreateReminder } from '../lib/hooks';
import { useAuthStore } from '../lib/auth-store';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { Bell, CheckCircle2, Circle, Volume2, Plus, X } from 'lucide-react';

export default function RemindersPage() {
  const { data: remindersData, isLoading } = useReminders();
  const { data: dependentsData } = useDependents();
  const { isDemoMode } = useAuthStore();
  const toggleMutation = useToggleReminder();
  const createMutation = useCreateReminder();
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDep, setNewDep] = useState('');
  const [speaking, setSpeaking] = useState<string | null>(null);

  const reminders = remindersData ?? [];
  const dependents = dependentsData ?? [];

  const filtered = filter === 'all' ? reminders : filter === 'pending' ? reminders.filter((r: any) => !r.done) : reminders.filter((r: any) => r.done);
  const getDepName = (id: string) => dependents.find((d: any) => d.id === id)?.name || '';
  const getDepAvatar = (id: string) => dependents.find((d: any) => d.id === id)?.avatar || '';

  const catColor = (c: string) => {
    if (c === 'vaccine') return 'text-teal-400 bg-teal-500/10';
    if (c === 'medicine') return 'text-navy-300 bg-navy-500/10';
    if (c === 'checkup') return 'text-warm-400 bg-warm-500/10';
    return 'text-sage-400 bg-sage-500/10';
  };

  const speak = (text: string, id: string) => {
    setSpeaking(id);
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.onend = () => setSpeaking(null);
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => setSpeaking(null), 2000);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    createMutation.mutate({
      title: newTitle,
      description: newDesc,
      time: new Date().toISOString(),
      for_dependent: newDep || dependents[0]?.id || '',
      done: false,
      category: 'checkup',
    });
    setShowAdd(false); setNewTitle(''); setNewDesc('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-800 text-2xl text-white mb-1">Reminders</h1>
          <p className="text-sm text-white/35">{reminders.filter((r: any) => !r.done).length} pending actions</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-surface-950 font-heading font-700 text-sm rounded-xl">
          {showAdd ? <X size={16} /> : <Plus size={16} />} {showAdd ? 'Cancel' : 'Add'}
        </button>
      </motion.div>

      {/* Add Form */}
      {showAdd && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleAdd}
          className="bg-surface-800/40 border border-white/[0.06] rounded-2xl p-5 mb-6 space-y-3">
          <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Reminder title" required
            className="w-full px-4 py-3 bg-surface-800/40 border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-teal-500/30 text-sm" />
          <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)"
            className="w-full px-4 py-3 bg-surface-800/40 border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-teal-500/30 text-sm" />
          <div className="flex flex-wrap gap-2">
            {dependents.map(d => (
              <button key={d.id} type="button" onClick={() => setNewDep(d.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${newDep === d.id ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20' : 'bg-surface-800/40 text-white/35 border border-white/[0.06]'}`}>
                {d.avatar} {d.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <button type="submit" className="w-full py-3 bg-teal-500 text-surface-950 font-heading font-700 rounded-xl text-sm">Add Reminder</button>
        </motion.form>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[{ key: 'all' as const, label: 'All' }, { key: 'pending' as const, label: 'Pending' }, { key: 'done' as const, label: 'Done' }].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f.key ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20' : 'bg-surface-800/40 text-white/35 border border-white/[0.06]'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filtered.map((rem, i) => (
          <motion.div key={rem.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${rem.done ? 'bg-surface-800/20 border-white/[0.03]' : 'bg-surface-800/40 border-white/[0.06]'}`}>
            <button onClick={() => toggleMutation.mutate(rem.id)} className="mt-0.5 flex-shrink-0">
              {rem.done ? <CheckCircle2 size={20} className="text-teal-500" /> : <Circle size={20} className="text-white/20 hover:text-teal-400 transition-colors" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${rem.done ? 'text-white/30 line-through' : 'text-white'}`}>{rem.title}</p>
              {rem.description && <p className="text-xs text-white/25 mt-0.5">{rem.description}</p>}
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-white/20">{getDepAvatar(rem.for_dependent)} {getDepName(rem.for_dependent)}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${catColor(rem.category)}`}>{rem.category}</span>
              </div>
            </div>
            <button onClick={() => speak(`${rem.title}. ${rem.description}`, rem.id)}
              className={`p-2 rounded-lg flex-shrink-0 transition-colors ${speaking === rem.id ? 'bg-teal-500/15 text-teal-400' : 'bg-white/[0.04] text-white/20 hover:text-teal-400'}`} title="Read aloud">
              <Volume2 size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Bell size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30">No reminders found.</p>
        </div>
      )}
    </div>
  );
}
