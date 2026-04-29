"use client";

import { motion } from "framer-motion";

/* Reusable animated floating medical SVG */
function FloatingSVG({ children, className, duration, delay, xRange, yRange }: {
  children: React.ReactNode; className: string; duration: number; delay?: number;
  xRange?: [number, number, number]; yRange?: [number, number, number];
}) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={{
        y: yRange || [-15, 15, -15],
        x: xRange || [0, 8, 0],
        rotate: [0, 5, -3, 0],
      }}
      transition={{ duration, repeat: Infinity, delay: delay || 0, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Animated mesh gradients */}
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent)" }}
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[50%] -left-[15%] w-[45vw] h-[45vw] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1), transparent)" }}
      />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -60, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] rounded-full blur-[80px]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent)" }}
      />

      {/* ============ SYRINGE / INJECTION ============ */}
      <FloatingSVG className="top-[8%] left-[5%] opacity-[0.07]" duration={11} delay={0}>
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2l4 4"/><path d="M7.5 20.5L2 22l1.5-5.5"/><path d="M15.5 4.5l4 4"/><path d="M14.5 5.5l-10 10"/><path d="M18.5 9.5l-10 10"/>
          <line x1="9" y1="11" x2="12" y2="14"/>
        </svg>
      </FloatingSVG>

      {/* ============ STETHOSCOPE ============ */}
      <FloatingSVG className="top-[22%] right-[6%] opacity-[0.06]" duration={13} delay={2} yRange={[-20, 20, -20]}>
        <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/>
          <path d="M8 15v1a6 6 0 006 6h.87a2 2 0 001.42-.59L18 19.88"/>
          <circle cx="20" cy="16" r="2"/>
        </svg>
      </FloatingSVG>

      {/* ============ HEARTBEAT / PULSE ============ */}
      <FloatingSVG className="top-[45%] left-[3%] opacity-[0.06]" duration={9} delay={1} xRange={[-5, 12, -5]}>
        <svg width="100" height="50" viewBox="0 0 100 50" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            d="M0 25 L20 25 L28 10 L36 40 L44 15 L52 35 L58 25 L100 25"
            initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </FloatingSVG>

      {/* ============ HEART ORGAN ============ */}
      <FloatingSVG className="top-[60%] right-[8%] opacity-[0.05]" duration={10} delay={3}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>
          <motion.path d="M12 5l0 14" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="2 3"
            animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </svg>
      </FloatingSVG>

      {/* ============ MEDICAL CROSS / SHIELD ============ */}
      <FloatingSVG className="top-[15%] left-[45%] opacity-[0.04]" duration={14} delay={4} yRange={[-10, 18, -10]}>
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      </FloatingSVG>

      {/* ============ PILL / CAPSULE ============ */}
      <FloatingSVG className="bottom-[30%] left-[15%] opacity-[0.06]" duration={12} delay={5} xRange={[-8, 10, -8]}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.5 1.5H8A6.5 6.5 0 001.5 8v0A6.5 6.5 0 008 14.5h2.5"/>
          <path d="M13.5 1.5H16A6.5 6.5 0 0122.5 8v0A6.5 6.5 0 0116 14.5h-2.5"/>
          <line x1="12" y1="1.5" x2="12" y2="14.5"/>
        </svg>
      </FloatingSVG>

      {/* ============ DNA HELIX ============ */}
      <FloatingSVG className="top-[35%] right-[18%] opacity-[0.05]" duration={16} delay={2}>
        <svg width="50" height="100" viewBox="0 0 50 100" fill="none" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round">
          <motion.path d="M10 0 C10 15, 40 15, 40 30 C40 45, 10 45, 10 60 C10 75, 40 75, 40 90"
            animate={{ pathLength: [0, 1] }} transition={{ duration: 4, repeat: Infinity }} />
          <motion.path d="M40 0 C40 15, 10 15, 10 30 C10 45, 40 45, 40 60 C40 75, 10 75, 10 90"
            animate={{ pathLength: [0, 1] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} />
          {[15, 30, 45, 60, 75].map((y, i) => (
            <motion.line key={i} x1="15" y1={y} x2="35" y2={y} strokeWidth="0.6" stroke="rgba(59,130,246,0.3)"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
          ))}
        </svg>
      </FloatingSVG>

      {/* ============ DOCTOR / PERSON ============ */}
      <FloatingSVG className="bottom-[15%] right-[4%] opacity-[0.05]" duration={11} delay={6} yRange={[-12, 12, -12]}>
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="3"/>
          <path d="M12 8v4"/><path d="M6 21v-3a6 6 0 0112 0v3"/>
          <line x1="12" y1="11" x2="12" y2="15"/><line x1="10" y1="13" x2="14" y2="13"/>
        </svg>
      </FloatingSVG>

      {/* ============ THERMOMETER ============ */}
      <FloatingSVG className="bottom-[45%] left-[42%] opacity-[0.04]" duration={13} delay={7}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>
          <motion.circle cx="11.5" cy="17.5" r="1.5" fill="rgba(245,158,11,0.3)"
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </svg>
      </FloatingSVG>

      {/* ============ CLIPBOARD / HEALTH RECORD ============ */}
      <FloatingSVG className="top-[70%] left-[8%] opacity-[0.05]" duration={10} delay={3} xRange={[0, 15, 0]}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 2h6v3H9z"/>
          <line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="13" y2="14"/>
        </svg>
      </FloatingSVG>

      {/* ============ MICROSCOPE ============ */}
      <FloatingSVG className="top-[5%] right-[35%] opacity-[0.04]" duration={15} delay={8}>
        <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 100-14h-1"/>
          <path d="M9 14h2"/><path d="M9 12a2 2 0 01-2-2V6l3-3 3 3v4a2 2 0 01-2 2z"/>
        </svg>
      </FloatingSVG>

      {/* ============ FLOATING PARTICLES ============ */}
      {[...Array(18)].map((_, i) => (
        <motion.div key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${2 + (i % 4) * 1.5}px`,
            height: `${2 + (i % 4) * 1.5}px`,
            left: `${3 + i * 5.3}%`,
            top: `${8 + (i * 19) % 82}%`,
            background: i % 3 === 0 ? "rgba(6,182,212,0.5)" : i % 3 === 1 ? "rgba(59,130,246,0.35)" : "rgba(139,92,246,0.3)",
            boxShadow: `0 0 ${4 + i % 3 * 2}px ${i % 3 === 0 ? "rgba(6,182,212,0.3)" : "rgba(59,130,246,0.2)"}`,
          }}
          animate={{
            y: [0, -(20 + i * 3), 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{ duration: 5 + i * 0.6, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* ============ ANIMATED PULSE RINGS ============ */}
      <motion.div className="absolute top-[25%] left-[25%] w-3 h-3 rounded-full bg-cyan-500/30"
        animate={{ scale: [1, 3, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }} />
      <motion.div className="absolute top-[55%] right-[25%] w-2 h-2 rounded-full bg-blue-500/30"
        animate={{ scale: [1, 4, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }} />
      <motion.div className="absolute bottom-[20%] left-[50%] w-2 h-2 rounded-full bg-violet-500/20"
        animate={{ scale: [1, 3.5, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 2 }} />

      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')" }}
      />
    </div>
  );
}
