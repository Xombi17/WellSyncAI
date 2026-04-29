"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Pill, Heart, Activity, Brain, Syringe, 
  ClipboardList, Smile, Tablet, Phone, HeartPulse 
} from "lucide-react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"text" | "done">("text");
  const brandName = "VaxiBabu";

  const splashStickers = [
    { Icon: Heart, color: "text-rose-400", bg: "bg-rose-500/20", top: "15%", left: "10%", delay: 0 },
    { Icon: Brain, color: "text-purple-400", bg: "bg-purple-500/20", top: "40%", left: "5%", delay: 1 },
    { Icon: Syringe, color: "text-cyan-400", bg: "bg-cyan-500/20", bottom: "15%", left: "12%", delay: 0.5 },
    { Icon: ClipboardList, color: "text-emerald-400", bg: "bg-emerald-500/20", top: "10%", right: "10%", delay: 1.5 },
    { Icon: HeartPulse, color: "text-blue-400", bg: "bg-blue-500/20", bottom: "35%", right: "8%", delay: 2 },
    { Icon: Smile, color: "text-amber-400", bg: "bg-amber-500/20", top: "60%", left: "18%", delay: 0.8 },
    { Icon: Tablet, color: "text-indigo-400", bg: "bg-indigo-500/20", bottom: "20%", right: "20%", delay: 1.2 },
    { Icon: Phone, color: "text-teal-400", bg: "bg-teal-500/20", bottom: "10%", right: "5%", delay: 0.3 },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 200);
    const t2 = setTimeout(() => setPhase("done"), 3200);
    const t3 = setTimeout(() => onComplete(), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" ? null : null}
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "radial-gradient(ellipse at center, #0a1628 0%, #020817 70%)" }}
      >
        {/* DNA Helixes on sides */}
        {[0, 1].map((side) => (
          <motion.div
            key={`dna-${side}`}
            className="absolute top-0 bottom-0 w-8 opacity-20"
            style={{ [side === 0 ? "left" : "right"]: "2%" }}
          >
            <svg width="32" height="100%" viewBox="0 0 32 800" preserveAspectRatio="none">
              {[...Array(20)].map((_, i) => (
                <motion.g key={i}>
                  <motion.circle
                    cx={16 + Math.sin(i + 0) * 12}
                    cy={i * 40}
                    r="3"
                    fill="#06b6d4"
                    animate={{ cx: [16 + Math.sin(i) * 12, 16 - Math.sin(i) * 12, 16 + Math.sin(i) * 12] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                  />
                  <motion.circle
                    cx={16 - Math.sin(i + 0) * 12}
                    cy={i * 40}
                    r="3"
                    fill="#3b82f6"
                    animate={{ cx: [16 - Math.sin(i) * 12, 16 + Math.sin(i) * 12, 16 - Math.sin(i) * 12] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                  />
                  <motion.line
                    x1={16 + Math.sin(i) * 12} y1={i * 40}
                    x2={16 - Math.sin(i) * 12} y2={i * 40}
                    stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                    animate={{ 
                      x1: [16 + Math.sin(i) * 12, 16 - Math.sin(i) * 12, 16 + Math.sin(i) * 12],
                      x2: [16 - Math.sin(i) * 12, 16 + Math.sin(i) * 12, 16 - Math.sin(i) * 12]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                  />
                </motion.g>
              ))}
            </svg>
          </motion.div>
        ))}

        {/* Flowing Stickers for Splash */}
        {splashStickers.map((s, i) => (
          <motion.div
            key={i}
            className={`absolute p-4 rounded-3xl ${s.bg} border-2 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-md`}
            style={{ top: s.top, bottom: s.bottom, left: s.left, right: s.right }}
            initial={{ opacity: 0, scale: 0, rotate: -20 }}
            animate={{ 
              opacity: 0.8, 
              scale: 1,
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [-20, 10, -20]
            }}
            transition={{ 
              duration: 8 + i, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: s.delay 
            }}
          >
            <s.Icon className={s.color} size={48} strokeWidth={2} />
          </motion.div>
        ))}

        {/* Background particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? "rgba(6,182,212,0.3)" : "rgba(59,130,246,0.2)",
            }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}

        {/* Radial background glow */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Brand name - typewriter effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase === "text" || phase === "done" ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative text-center"
        >
          <h1 className="text-8xl sm:text-[10rem] font-bold italic tracking-tighter"
            style={{ fontFamily: "'Dancing Script', cursive" }}>
            {brandName.split("").map((char, i) => (
              <motion.span key={i}
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={phase === "text" || phase === "done" ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "backOut" }}
                className={i < 4 ? "text-white" : ""}
                style={i >= 4 ? {
                  background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                } : {}}
              >
                {char}
              </motion.span>
            ))}
          </h1>

          {/* Typewriter cursor */}
          <motion.span
            className="inline-block w-[3px] h-10 bg-cyan-400 ml-1 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ verticalAlign: "middle" }}
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={phase === "text" || phase === "done" ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center text-sm text-white/30 mt-3 font-medium tracking-widest uppercase"
          >
            Voice-First Healthcare
          </motion.p>
        </motion.div>

        {/* Loading bar at bottom */}
        <motion.div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #06b6d4, #3b82f6)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.8, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
