"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"syringe" | "fluid" | "text" | "done">("syringe");
  const brandName = "VaxiBabu";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fluid"), 800);
    const t2 = setTimeout(() => setPhase("text"), 2200);
    const t3 = setTimeout(() => setPhase("done"), 4200);
    const t4 = setTimeout(() => onComplete(), 4800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
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

        {/* Radial glow behind syringe */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* SYRINGE SVG */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
          className="relative mb-8"
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Syringe body */}
            <motion.rect x="45" y="20" width="30" height="60" rx="4"
              stroke="url(#syringeGrad)" strokeWidth="2.5" fill="rgba(6,182,212,0.05)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 1 }} />
            {/* Plunger */}
            <motion.rect x="52" y="8" width="16" height="8" rx="2"
              fill="rgba(6,182,212,0.3)" stroke="url(#syringeGrad)" strokeWidth="1.5"
              initial={{ y: 8 }}
              animate={phase === "fluid" || phase === "text" ? { y: 22 } : { y: 8 }}
              transition={{ duration: 1.2, ease: "easeInOut" }} />
            <motion.line x1="60" y1="16" x2="60" y2="22"
              stroke="url(#syringeGrad)" strokeWidth="2"
              initial={{ y1: 16 }} animate={phase === "fluid" || phase === "text" ? { y1: 30 } : { y1: 16 }}
              transition={{ duration: 1.2, ease: "easeInOut" }} />
            {/* Needle */}
            <motion.line x1="60" y1="80" x2="60" y2="105"
              stroke="url(#needleGrad)" strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }} />
            {/* Needle tip */}
            <motion.circle cx="60" cy="108" r="2" fill="#06b6d4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }} />
            {/* Fluid inside syringe */}
            <motion.rect x="48" y="40" width="24" height="36" rx="2"
              fill="url(#fluidGrad)"
              initial={{ height: 36, y: 40 }}
              animate={phase === "fluid" || phase === "text" ? { height: 4, y: 72 } : { height: 36, y: 40 }}
              transition={{ duration: 1.4, ease: "easeInOut" }} />
            {/* Measurement lines */}
            {[30, 40, 50, 60, 70].map((y, i) => (
              <motion.line key={i} x1="46" y1={y} x2="50" y2={y}
                stroke="rgba(6,182,212,0.3)" strokeWidth="1"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }} />
            ))}
            {/* Gradients */}
            <defs>
              <linearGradient id="syringeGrad" x1="45" y1="20" x2="75" y2="80">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="needleGrad" x1="60" y1="80" x2="60" y2="108">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <linearGradient id="fluidGrad" x1="48" y1="40" x2="72" y2="76">
                <stop offset="0%" stopColor="rgba(6,182,212,0.6)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0.4)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Fluid drops spraying from needle */}
          <AnimatePresence>
            {(phase === "fluid" || phase === "text") && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div key={`drop-${i}`}
                    className="absolute rounded-full"
                    style={{
                      width: `${3 + Math.random() * 4}px`,
                      height: `${3 + Math.random() * 4}px`,
                      left: `${55 + (Math.random() - 0.5) * 20}px`,
                      top: "105px",
                      background: `rgba(6,182,212,${0.4 + Math.random() * 0.4})`,
                      boxShadow: "0 0 6px rgba(6,182,212,0.5)",
                    }}
                    initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    animate={{
                      opacity: 0,
                      y: 30 + Math.random() * 40,
                      x: (Math.random() - 0.5) * 50,
                      scale: 0.2,
                    }}
                    transition={{ duration: 0.8 + Math.random() * 0.6, delay: i * 0.15, ease: "easeOut" }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Glow pulse around syringe */}
          <motion.div
            className="absolute inset-[-20px] rounded-full border border-cyan-500/20"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Brand name - typewriter effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase === "text" || phase === "done" ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative text-center"
        >
          <h1 className="text-6xl sm:text-7xl font-bold italic tracking-tight"
            style={{ fontFamily: "'Dancing Script', cursive" }}>
            {brandName.split("").map((char, i) => (
              <motion.span key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={phase === "text" || phase === "done" ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.12, duration: 0.4, ease: "backOut" }}
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
