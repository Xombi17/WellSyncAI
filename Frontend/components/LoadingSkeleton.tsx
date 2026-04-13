'use client';
import { motion } from 'framer-motion';

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.08 }}
          className="bg-surface-800/30 border border-white/[0.04] rounded-2xl p-5 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04]" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-2/3 bg-white/[0.04] rounded-lg" />
              <div className="h-2.5 w-1/2 bg-white/[0.03] rounded-lg" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-surface-800/30 border border-white/[0.04] animate-pulse">
          <div className="w-5 h-5 bg-white/[0.04] rounded mb-3" />
          <div className="h-6 w-12 bg-white/[0.06] rounded-lg mb-1" />
          <div className="h-2.5 w-16 bg-white/[0.03] rounded" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto animate-pulse">
      <div className="h-7 w-48 bg-white/[0.04] rounded-lg mb-2" />
      <div className="h-4 w-64 bg-white/[0.03] rounded mb-8" />
      <CardSkeleton count={4} />
    </div>
  );
}
