"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, CalendarClock, Mic2, BookOpen, BellRing, WifiOff, UserPlus, CalendarCheck, Bell, Mic } from "lucide-react";

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

export default function LandingFeatures() {
  return (
    <>
      {/* Features Grid */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-[#020817]" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(circle, #06b6d4 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-medium text-cyan-400 mb-5">
              Features
            </span>
            <h2 className="font-heading font-[800] text-3xl sm:text-4xl leading-tight mb-4">
              Everything a family needs, <span className="text-cyan-400">nothing they don&apos;t</span>
            </h2>
          </Section>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Users, t: "Household Onboarding", d: "Add all family members with voice", g: "from-cyan-500 to-blue-500" },
              { icon: CalendarClock, t: "Auto Health Timeline", d: "Smart schedules from date of birth", g: "from-blue-500 to-indigo-500" },
              { icon: Mic2, t: "Voice Interaction", d: "Speak in your mother tongue", g: "from-violet-500 to-purple-500" },
              { icon: BookOpen, t: "Simple Explanations", d: "AI explains in easy language", g: "from-indigo-500 to-blue-500" },
              { icon: BellRing, t: "Smart Reminders", d: "Never miss a vaccination window", g: "from-cyan-500 to-teal-500" },
              { icon: WifiOff, t: "Offline Support", d: "Works without internet connection", g: "from-blue-600 to-cyan-600" },
            ].map((f, i) => (
              <Section key={i}>
                <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}
                  className="glass-card rounded-2xl p-6 group cursor-pointer">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.g} flex items-center justify-center mb-4 shadow-lg`}>
                    <f.icon size={22} className="text-white" />
                  </motion.div>
                  <h3 className="font-heading font-[700] text-base text-white mb-1">{f.t}</h3>
                  <p className="text-sm text-white/30">{f.d}</p>
                </motion.div>
              </Section>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 section-divider" />
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-[#071025] to-surface-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section className="max-w-2xl mx-auto text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-medium text-blue-400 mb-5">
              How It Works
            </span>
            <h2 className="font-heading font-[800] text-3xl sm:text-4xl leading-tight mb-4">
              Four steps to <span className="gradient-text">peace of mind</span>
            </h2>
          </Section>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[60px] left-[12.5%] right-[12.5%] h-px"
              style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.3), rgba(59,130,246,0.3), rgba(139,92,246,0.3), rgba(99,102,241,0.3))" }} />

            {[
              { icon: UserPlus, n: "01", t: "Set Up Family", c: "cyan", g: "from-cyan-500 to-cyan-600" },
              { icon: CalendarCheck, n: "02", t: "Get Timeline", c: "blue", g: "from-blue-500 to-blue-600" },
              { icon: Mic, n: "03", t: "Ask by Voice", c: "violet", g: "from-violet-500 to-violet-600" },
              { icon: Bell, n: "04", t: "Stay on Track", c: "indigo", g: "from-indigo-500 to-indigo-600" },
            ].map((s, i) => (
              <Section key={i} className="text-center">
                <motion.div whileHover={{ y: -10, scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}
                  className="relative inline-flex mb-4">
                  <div className={`w-20 h-20 rounded-2xl bg-${s.c}-500/10 border border-${s.c}-500/20 flex items-center justify-center`}>
                    <s.icon size={28} className={`text-${s.c}-400`} />
                  </div>
                  <span className={`absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br ${s.g} rounded-lg flex items-center justify-center text-white text-xs font-heading font-[700] shadow-lg`}>
                    {s.n}
                  </span>
                </motion.div>
                <h3 className="font-heading font-[700] text-white">{s.t}</h3>
              </Section>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 section-divider" />
      </section>
    </>
  );
}
