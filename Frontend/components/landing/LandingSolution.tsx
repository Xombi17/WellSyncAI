"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mic, Calendar, Globe, WifiOff } from "lucide-react";

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }} className={className}>
      {children}
    </motion.div>
  );
}

export default function LandingSolution() {
  return (
    <section id="solution" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-[#081530] to-surface-950" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-medium text-cyan-400 mb-5">
            The Solution
          </span>
          <h2 className="font-heading font-[800] text-3xl sm:text-4xl leading-tight mb-4">
            A health assistant that <span className="gradient-text">speaks your language</span>
          </h2>
          <p className="text-lg text-white/35">Just talk to it &mdash; no reading, no typing, no complicated menus.</p>
        </Section>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Mic, t: "Voice-First", d: "Ask & hear in natural language", g: "from-cyan-500 to-cyan-600" },
            { icon: Calendar, t: "Auto Timeline", d: "DOB-based health schedules", g: "from-blue-500 to-blue-600" },
            { icon: Globe, t: "Local Languages", d: "Hindi, Marathi, Tamil & more", g: "from-violet-500 to-violet-600" },
            { icon: WifiOff, t: "Offline-First", d: "Works without internet", g: "from-indigo-500 to-indigo-600" },
          ].map((s, i) => (
            <Section key={i}>
              <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}
                className="glass-card p-6 rounded-2xl h-full group">
                <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.g} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-cyan-500/20`}>
                  <s.icon size={22} className="text-white" />
                </motion.div>
                <h3 className="font-heading font-[700] text-base text-white mb-1.5">{s.t}</h3>
                <p className="text-sm text-white/35">{s.d}</p>
              </motion.div>
            </Section>
          ))}
        </div>

        {/* Animated DNA-like connector line */}
        <div className="hidden lg:block relative mt-12">
          <motion.div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.3), rgba(59,130,246,0.3), transparent)" }}
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1.5 }} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
