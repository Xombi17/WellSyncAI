"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.04] py-10 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-[#020817] to-surface-950" />
      <div className="relative max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Image src="/images/logo-icon.png" alt="Vaxi Babu Logo" width={24} height={24} className="rounded-lg" />
          <span className="font-heading font-[700] text-sm text-white">
            Vaxi<span className="text-cyan-400">Babu</span>
          </span>
        </div>
        <p className="text-xs text-white/20">
          &copy; 2025 Vaxi Babu. Made with{" "}
          <Heart size={10} className="inline text-rose-500 fill-rose-500" />{" "}
          for families everywhere.
        </p>
        <div className="flex gap-6 text-xs text-white/20">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Safety</a>
        </div>
      </div>
    </footer>
  );
}
