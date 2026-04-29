"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileX, Brain, Bell, Smartphone } from "lucide-react";

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

export default function LandingProblem() {
  return (
    <section id="problem" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-[#071025] to-surface-950" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-xs font-medium text-rose-400 mb-5">
            The Challenge
          </span>
          <h2 className="font-heading font-[800] text-3xl sm:text-4xl leading-tight mb-4">
            Families shouldn&apos;t fight <span className="text-rose-400">to remember</span>
          </h2>
          <p className="text-lg text-white/35">
            Preventive healthcare fails not because families don&apos;t care &mdash; but because systems aren&apos;t built for them.
          </p>
        </Section>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: FileX, title: "Lost Records", desc: "Health cards get lost or damaged", color: "rose" },
            { icon: Brain, title: "Literacy Barriers", desc: "Apps assume users can read & navigate", color: "amber" },
            { icon: Bell, title: "Missed Vaccines", desc: "No clear reminders for critical windows", color: "blue" },
            { icon: Smartphone, title: "No Connectivity", desc: "Cloud apps fail in rural areas", color: "purple" },
          ].map((p, i) => (
            <Section key={i}>
              <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}
                className="glass-card p-5 rounded-2xl h-full">
                <div className={`w-10 h-10 rounded-xl bg-${p.color}-500/15 flex items-center justify-center mb-3`}>
                  <p.icon size={20} className={`text-${p.color}-400`} />
                </div>
                <h3 className="font-heading font-[700] text-sm text-white mb-1">{p.title}</h3>
                <p className="text-xs text-white/35">{p.desc}</p>
              </motion.div>
            </Section>
          ))}
        </div>

        <Section className="mt-10">
          <div className="glass-strong rounded-2xl p-6 grid sm:grid-cols-3 gap-6 sm:divide-x divide-white/[0.06]">
            {[
              { s: "23M", l: "Children miss vaccines yearly" },
              { s: "60%", l: "Rural records are paper-based" },
              { s: "1 in 5", l: "Children under-vaccinated" },
            ].map((d, i) => (
              <motion.div key={i} className="text-center" whileHover={{ scale: 1.05 }}>
                <p className="font-heading font-[800] text-2xl gradient-text">{d.s}</p>
                <p className="text-xs text-white/30 mt-1">{d.l}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      </div>
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
