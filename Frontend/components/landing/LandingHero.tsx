"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mic, Shield, Heart, Volume2, ChevronRight, Syringe, Activity } from "lucide-react";
import VoiceWaveform from "@/components/VoiceWaveform";

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-950 to-[#0a1a3a]" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-cyan-500/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/[0.06] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/[0.03] rounded-full blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #06b6d4 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-cyan-300">AI-Powered Healthcare</span>
            </motion.div>

            <h1 className="font-heading font-[800] text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] mb-5">
              Your family&apos;s{" "}
              <span className="gradient-text">health guardian</span>, powered by AI
            </h1>

            <p className="text-lg text-white/40 leading-relaxed mb-8">
              Vaxi Babu tracks vaccinations, manages health records, and sends smart reminders &mdash; all through voice. Healthcare made simple.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/login"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-heading font-[700] rounded-2xl transition-all hover:shadow-xl hover:shadow-cyan-500/25 hover:scale-[1.02]">
                <Syringe size={18} /> Start Tracking
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a href="#solution"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 glass-strong font-heading font-[700] rounded-2xl transition-all hover:bg-white/[0.1]">
                Learn More
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/30">
              <div className="flex items-center gap-1.5"><Shield size={14} className="text-cyan-400" /><span>Secure Records</span></div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5"><Heart size={14} className="text-rose-400" /><span>Family-centered</span></div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5"><Volume2 size={14} className="text-cyan-400" /><span>Voice-first</span></div>
            </div>
          </motion.div>

          {/* Right - Phone mockup */}
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }} className="relative flex justify-center">
            {/* Floating cards */}
            <motion.div className="absolute -top-4 left-4 z-10" animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity }}>
              <div className="glass-strong rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                  <Syringe size={16} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white/80">Vaccine Due</p>
                  <p className="text-[11px] text-white/35">OPV-3 Polio in 3 days</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="absolute -bottom-2 right-4 z-10" animate={{ y: [5, -5, 5] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}>
              <div className="glass-strong rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Activity size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white/80">All caught up!</p>
                  <p className="text-[11px] text-white/35">Vaccinations up to date &#10003;</p>
                </div>
              </div>
            </motion.div>

            {/* Phone frame */}
            <div className="relative w-[280px]">
              <div className="absolute -inset-8 bg-cyan-500/[0.06] rounded-full blur-[60px] pulse-glow" />
              <div className="relative bg-gradient-to-b from-surface-700 to-surface-800 rounded-[2.5rem] p-3 shadow-2xl border border-white/[0.08] glow-pulse">
                <div className="bg-surface-950 rounded-[2rem] overflow-hidden">
                  <div className="px-5 pt-5 pb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                        <Syringe size={10} className="text-white" />
                      </div>
                      <span className="font-heading font-[700] text-xs text-white">Vaxi Babu</span>
                    </div>
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/15 rounded-xl p-3 mb-3">
                      <p className="text-xs font-medium text-white/80 mb-0.5">Good morning, Priya 👋</p>
                      <p className="text-[11px] text-white/35">Aarav has 1 upcoming vaccine.</p>
                    </div>
                    <div className="glass rounded-xl p-3 mb-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                          <Volume2 size={8} className="text-white" />
                        </div>
                        <span className="text-[10px] text-cyan-400">Speaking...</span>
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed">
                        &quot;OPV-3 polio vaccine due June 28th. Shall I remind you?&quot;
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span className="text-[11px] text-white/50">OPV-3 Polio</span>
                        <span className="text-[10px] text-rose-400 ml-auto">3 days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span className="text-[11px] text-white/50">Measles-1</span>
                        <span className="text-[10px] text-white/20 ml-auto">2 months</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <div className="flex items-center gap-2.5 glass rounded-xl px-3 py-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                        <Mic size={12} className="text-white" />
                      </div>
                      <VoiceWaveform bars={6} size="sm" color="bg-cyan-400" />
                      <span className="text-[10px] text-white/25 ml-auto">Listening...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
