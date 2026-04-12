'use client';
import Link from 'next/link';
import { Plus, User, Calendar, Activity, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useDependents } from '@/hooks/use-dependents';

export default function DependentsPage() {
  const { dependents, isLoading, error } = useDependents();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-red-500" size={24} />
            <h3 className="font-black text-red-700 dark:text-red-400">Failed to load dependents</h3>
          </div>
          <p className="text-red-600 dark:text-red-300 text-sm mb-4">
            {error instanceof Error ? error.message : 'An error occurred while loading family members'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Family Members</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">Manage your household dependents.</p>
        </div>
        <Link 
          href="/dependents/new"
          className="bg-blue-400 dark:bg-blue-500 text-white rounded-2xl py-4 px-6 font-black flex items-center justify-center gap-2 transition-all shadow-[6px_6px_12px_rgba(96,165,250,0.3),inset_2px_2px_6px_rgba(255,255,255,0.5),inset_-2px_-2px_6px_rgba(0,0,0,0.1)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,255,255,0.1),inset_-2px_-2px_6px_rgba(0,0,0,0.4)] hover:-translate-y-1 active:translate-y-0.5 active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] dark:active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4)] w-full md:w-auto"
        >
          <Plus size={24} strokeWidth={3} /> Add Member
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dependents.length === 0 ? (
          <div className="col-span-full bg-[#f3f6fd] dark:bg-slate-800 rounded-[2.5rem] p-12 text-center shadow-inner">
            <p className="text-slate-500 font-bold text-xl mb-4">No family members found.</p>
            <Link href="/dependents/new" className="text-blue-500 font-black hover:underline">Add your first member</Link>
          </div>
        ) : (
          dependents.map((dependent) => (
            <Link 
              key={dependent.id} 
              href={`/dashboard?dependent=${dependent.id}`}
              className="bg-[#f3f6fd] dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-[10px_10px_20px_rgba(0,0,0,0.05),-10px_-10px_20px_rgba(255,255,255,0.8)] dark:shadow-[10px_10px_20px_rgba(0,0,0,0.4),-10px_-10px_20px_rgba(255,255,255,0.05)] hover:shadow-[12px_12px_24px_rgba(0,0,0,0.08),-12px_-12px_24px_rgba(255,255,255,0.9),inset_4px_4px_10px_rgba(255,255,255,0.9),inset_-4px_-4px_10px_rgba(0,0,0,0.02)] dark:hover:shadow-[12px_12px_24px_rgba(0,0,0,0.5),-12px_-12px_24px_rgba(255,255,255,0.05),inset_4px_4px_10px_rgba(255,255,255,0.1),inset_-4px_-4px_10px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-20 h-20 rounded-[1.25rem] bg-white dark:bg-slate-700 flex items-center justify-center p-1 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] text-blue-400">
                  <User size={48} strokeWidth={3} />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-slate-600 transition-colors shadow-[4px_4px_8px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-2px_-2px_4px_rgba(0,0,0,0.02)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.4)]">
                  <ChevronRight size={20} strokeWidth={3} />
                </div>
              </div>
              
              <h3 className="font-black text-2xl text-slate-800 dark:text-white mb-1">{dependent.name}</h3>
              
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-[inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-2px_-2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_2px_2px_4px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]">
                  {dependent.type}
                </span>
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-[inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-2px_-2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_2px_2px_4px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]">
                  {dependent.sex}
                </span>
              </div>
  
              <div className="mt-auto space-y-3 bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.02),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400 text-truncate">
                  <Activity size={16} className="text-blue-400 shrink-0" />
                  <span className="truncate">Notes: {dependent.notes || 'None'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400">
                  <Calendar size={16} className="text-blue-400 shrink-0" />
                  <span>DOB: {new Date(dependent.date_of_birth).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
