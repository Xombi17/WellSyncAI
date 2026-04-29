"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Mic,
  Activity,
  ShieldCheck,
  BrainCircuit,
  Smartphone,
  Globe2,
  Clock,
  ArrowRight,
  Heart,
  Baby,
  Stethoscope,
  Volume2,
  Bell
} from "lucide-react";

export default function LandingClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full bg-surface-950 text-white overflow-hidden selection:bg-teal-500/30 selection:text-teal-200 min-h-screen">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/20 via-surface-950 to-surface-950" />
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-500/5 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-navy-500/5 blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-surface-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Activity className="text-surface-950" size={20} strokeWidth={3} />
            </div>
            <span className="font-heading font-900 text-xl tracking-tight">Vaxi Babu</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#engine" className="hover:text-white transition-colors">The Engine</a>
            <a href="#mission" className="hover:text-white transition-colors">Mission</a>
          </div>
          <Link href="/login" className="px-6 py-2.5 rounded-full bg-white text-surface-950 font-heading font-700 text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Copy */}
          <motion.div style={{ y, opacity }} className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/20 bg-teal-500/5 backdrop-blur-sm mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">Voice-First Healthcare</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading font-900 text-5xl sm:text-7xl leading-[1.05] tracking-tight mb-8"
            >
              Your family's <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-500">
                health memory.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-white/50 leading-relaxed font-medium mb-10 max-w-xl"
            >
              No typing. No complex menus. Just speak in your native language, and Vaxi Babu will track, remind, and secure your family's medical future offline.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="/login" className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-teal-500 text-surface-950 font-heading font-800 text-lg hover:scale-105 active:scale-95 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-2">
                  <Mic size={20} /> Try Voice Demo
                </span>
              </Link>
              <div className="flex items-center gap-3 px-6 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-bold text-white/70 hidden sm:flex">
                <Globe2 size={18} className="text-teal-400" /> Supports 12+ Dialects
              </div>
            </motion.div>
          </motion.div>

          {/* Right: UI Mockup / Abstract Art */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="relative lg:h-[600px] flex items-center justify-center perspective-[1000px]"
          >
            {/* Abstract Glow Behind Mockup */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-navy-500/20 rounded-full blur-[80px] animate-pulse" />
            
            {/* Floating Glass UI Panel */}
            <div className="relative z-10 w-full max-w-md bg-surface-900/60 backdrop-blur-2xl border border-white/[0.08] rounded-[2rem] p-6 shadow-2xl transform-gpu rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
              
              {/* Mockup Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warm-400 to-warm-600 flex items-center justify-center text-xl shadow-lg">
                    👩🏽
                  </div>
                  <div>
                    <div className="font-heading font-800 text-white text-lg leading-tight">Priya Sharma</div>
                    <div className="text-xs text-white/40 font-medium">Mother · 2 Dependents</div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <Bell size={16} className="text-white/40" />
                </div>
              </div>

              {/* Mockup Active State */}
              <div className="relative p-6 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-6 overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-400" />
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0">
                    <Volume2 size={18} className="text-teal-400 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-300 mb-1">Agent is speaking...</p>
                    <p className="text-lg font-heading font-700 text-white leading-tight">
                      "Aarav's OPV-3 Polio vaccine is due in exactly 3 days. Would you like me to set a reminder?"
                    </p>
                  </div>
                </div>
              </div>

              {/* Mockup Schedule */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/50 border border-white/[0.04]">
                  <div className="w-10 h-10 rounded-xl bg-coral-500/10 flex items-center justify-center">
                    <Activity size={18} className="text-coral-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-heading font-700 text-sm text-white">OPV-3 Polio</div>
                    <div className="text-xs text-white/40">For Aarav · Due June 28</div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-coral-500/20 text-coral-300 text-xs font-bold">
                    3 Days
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/50 border border-white/[0.04]">
                  <div className="w-10 h-10 rounded-xl bg-sage-500/10 flex items-center justify-center">
                    <Stethoscope size={18} className="text-sage-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-heading font-700 text-sm text-white">Pediatric Checkup</div>
                    <div className="text-xs text-white/40">For Diya · Scheduled</div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-surface-700 text-white/40 text-xs font-bold">
                    Next Month
                  </div>
                </div>
              </div>

            </div>

            {/* Floating Elements */}
            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-8 top-1/4 z-20 bg-surface-800/80 backdrop-blur-xl border border-white/[0.08] p-4 rounded-2xl shadow-2xl hidden sm:flex items-center gap-3">
              <ShieldCheck className="text-teal-400" />
              <span className="text-sm font-bold text-white">Offline Synced</span>
            </motion.div>
            
            <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -left-12 bottom-1/4 z-20 bg-surface-800/80 backdrop-blur-xl border border-white/[0.08] p-4 rounded-2xl shadow-2xl hidden sm:flex items-center gap-3">
              <BrainCircuit className="text-navy-400" />
              <span className="text-sm font-bold text-white">NIS Engine</span>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="font-heading font-900 text-4xl sm:text-6xl text-white mb-6 leading-tight">
              Clinical precision, <br/>
              <span className="text-white/40">rural empathy.</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl font-medium">
              We replaced chaotic paper records with a secure digital sanctuary. Engineered for low-literacy, offline-first environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card */}
            <div className="md:col-span-2 md:row-span-2 group relative p-8 sm:p-12 rounded-[2.5rem] bg-surface-900/40 border border-white/[0.06] hover:bg-surface-900/60 transition-colors overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-8 border border-teal-500/20">
                  <Mic size={28} className="text-teal-400" />
                </div>
                <h3 className="font-heading font-900 text-3xl sm:text-4xl text-white mb-4">Native Dialect Intelligence</h3>
                <p className="text-lg text-white/50 font-medium max-w-md mb-12">
                  Powered by Gemini Live. The engine understands context, medical terms, and intent—all through natural voice in your mother tongue.
                </p>
                <div className="mt-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-300 text-sm font-bold">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    Live Audio Processing
                  </div>
                </div>
              </div>
            </div>

            {/* Small Card 1 */}
            <div className="group relative p-8 rounded-[2.5rem] bg-surface-900/40 border border-white/[0.06] hover:bg-surface-900/60 transition-colors overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-coral-500/10 flex items-center justify-center mb-6 border border-coral-500/20">
                <Smartphone size={24} className="text-coral-400" />
              </div>
              <h3 className="font-heading font-800 text-2xl text-white mb-3">Offline-First PWA</h3>
              <p className="text-white/50 font-medium text-sm leading-relaxed">
                Your medical data never leaves the sovereign boundary of your device unless explicitly synced. It works deep in the village, far from cell towers.
              </p>
            </div>

            {/* Small Card 2 */}
            <div className="group relative p-8 rounded-[2.5rem] bg-surface-900/40 border border-white/[0.06] hover:bg-surface-900/60 transition-colors overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-navy-500/10 flex items-center justify-center mb-6 border border-navy-500/20">
                <Clock size={24} className="text-navy-400" />
              </div>
              <h3 className="font-heading font-800 text-2xl text-white mb-3">Predictive NIS</h3>
              <p className="text-white/50 font-medium text-sm leading-relaxed">
                Deterministic India National Immunization Schedule mapping that calculates the exact windows for vaccines based purely on Date of Birth.
              </p>
            </div>

            {/* Medium Card */}
            <div className="md:col-span-3 group relative p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-teal-900/20 to-navy-900/20 border border-white/[0.06] hover:border-teal-500/30 transition-colors overflow-hidden flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-wider mb-6">
                  Multimodal Pipeline
                </div>
                <h3 className="font-heading font-900 text-3xl sm:text-5xl text-white mb-4">GPT-4o Vision OCR</h3>
                <p className="text-lg text-white/60 font-medium">
                  Scan any handwritten prescription or medicine strip. Our vision pipeline extracts active ingredients, verifies dosages, and logs interaction risks instantly.
                </p>
              </div>
              <div className="w-full md:w-1/3 aspect-square rounded-[2rem] bg-surface-950 border border-white/[0.04] p-4 flex flex-col gap-3 shadow-2xl relative">
                <div className="absolute inset-0 bg-teal-500/10 rounded-[2rem] animate-pulse" />
                <div className="h-1/2 w-full bg-white/[0.02] rounded-xl flex items-center justify-center border border-white/[0.04]">
                  <Activity size={32} className="text-white/20" />
                </div>
                <div className="h-4 w-3/4 bg-white/[0.05] rounded-full" />
                <div className="h-4 w-1/2 bg-white/[0.05] rounded-full" />
                <div className="mt-auto h-10 w-full bg-teal-500/20 rounded-xl flex items-center justify-center border border-teal-500/30">
                  <span className="text-teal-400 text-sm font-bold">Scanning...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Climax */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-b from-surface-800/80 to-surface-900/80 backdrop-blur-2xl rounded-[3rem] border border-white/[0.08] p-12 sm:p-20 text-center overflow-hidden relative shadow-[0_0_100px_rgba(20,184,166,0.1)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[300px] bg-teal-500/20 blur-[120px] rounded-full pointer-events-none" />
          
          <h2 className="relative z-10 font-heading font-900 text-5xl sm:text-7xl text-white mb-8 tracking-tight">
            The future is <span className="text-teal-400">yours.</span>
          </h2>
          <p className="relative z-10 text-xl text-white/50 mb-12 max-w-2xl mx-auto font-medium">
            Join thousands of families securing their children's health with the world's most advanced, yet simplest, health memory system.
          </p>
          
          <Link href="/login" className="relative z-10 inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-surface-950 font-heading font-900 text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
            Join Vaxi Babu <ArrowRight size={24} />
          </Link>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-8 mt-16 text-white/40 font-bold text-sm uppercase tracking-widest">
            <span className="flex items-center gap-2"><ShieldCheck size={18} /> Privacy First</span>
            <span className="flex items-center gap-2"><Smartphone size={18} /> 100% Free</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] bg-surface-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <Activity className="text-surface-950" size={16} strokeWidth={3} />
            </div>
            <span className="font-heading font-900 text-white">Vaxi Babu</span>
          </div>
          
          <div className="text-white/30 text-sm font-medium text-center md:text-left">
            Built for the multi-sovereign world.
          </div>
          
          <div className="flex gap-6 text-sm font-bold text-white/40">
            <Link href="/login" className="hover:text-teal-400 transition-colors">Safety</Link>
            <Link href="/login" className="hover:text-teal-400 transition-colors">Privacy</Link>
            <Link href="/login" className="hover:text-teal-400 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
