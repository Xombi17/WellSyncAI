"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mic, ArrowRight } from "lucide-react";

export default function LandingCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-surface-950" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] via-surface-950 to-blue-600/[0.04]" />
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]" />

      <div className="relative max-w-3xl mx-auto px-4 text-center" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          {/* Animated mic icon */}
          <div className="relative inline-flex mb-8">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Mic size={22} className="text-white" />
              </div>
            </motion.div>
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 pulse-ring" />
            <div className="absolute inset-[-8px] rounded-full border border-cyan-400/10 pulse-ring" style={{ animationDelay: "0.5s" }} />
          </div>

          <h2 className="font-heading font-[800] text-3xl sm:text-5xl leading-tight mb-5">
            Ready for a <span className="gradient-text">health memory</span> that never forgets?
          </h2>
          <p className="text-white/35 mb-10 text-lg">
            Join families using Vaxi Babu to stay on top of their children&apos;s health.
          </p>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href="/login"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-heading font-[700] text-lg rounded-2xl transition-all shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/30">
              Get Started Free <ArrowRight size={20} />
            </Link>
          </motion.div>

          <p className="mt-8 text-xs text-white/20">Free &middot; No credit card &middot; Works on any phone</p>
        </motion.div>
      </div>
    </section>
  );
}
