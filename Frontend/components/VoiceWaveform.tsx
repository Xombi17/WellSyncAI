'use client';
import { motion } from 'framer-motion';

interface VoiceWaveformProps {
  bars?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export default function VoiceWaveform({ bars = 5, size = 'md', color = 'bg-teal-400', className = '' }: VoiceWaveformProps) {
  const heights = {
    sm: { min: 8, max: 20 },
    md: { min: 12, max: 32 },
    lg: { min: 16, max: 48 },
  };
  const widths = { sm: 2, md: 3, lg: 4 };
  const gaps = { sm: 'gap-[2px]', md: 'gap-[3px]', lg: 'gap-1' };

  return (
    <div className={`flex items-center ${gaps[size]} ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className={`${color} rounded-full`}
          style={{ width: widths[size] }}
          animate={{ height: [heights[size].min, heights[size].max, heights[size].min] }}
          transition={{ duration: 1 + (i % 3) * 0.2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
