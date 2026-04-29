"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LandingNav() {
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-surface-950/70 backdrop-blur-2xl border-b border-white/[0.04]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <Image src="/images/logo-icon.png" alt="Vaxi Babu Logo" width={32} height={32} className="rounded-lg" />
          <span className="font-heading font-[800] text-lg text-white">
            Vaxi<span className="text-cyan-400">Babu</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {["Problem", "Solution", "Features", "Gallery"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="text-sm text-white/40 hover:text-cyan-400 transition-colors duration-300">
              {l}
            </a>
          ))}
        </div>
        <Link href="/login"
          className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-heading font-[700] text-sm rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-500/25">
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
}
