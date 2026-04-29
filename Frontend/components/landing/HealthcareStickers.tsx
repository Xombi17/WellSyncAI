"use client";

import { motion } from "framer-motion";
import { Pill, Heart, Activity, Thermometer, Syringe, Clipboard, UserRound, ShieldCheck, Microscope } from "lucide-react";

const stickers = [
  { Icon: Pill, color: "text-amber-400", bg: "bg-amber-400/20", top: "15%", left: "12%", rotate: -15 },
  { Icon: Heart, color: "text-rose-400", bg: "bg-rose-400/20", top: "45%", right: "8%", rotate: 10 },
  { Icon: Activity, color: "text-cyan-400", bg: "bg-cyan-400/20", top: "75%", left: "5%", rotate: -20 },
  { Icon: Thermometer, color: "text-orange-400", bg: "bg-orange-400/20", top: "25%", right: "15%", rotate: 25 },
  { Icon: Syringe, color: "text-blue-400", bg: "bg-blue-400/20", top: "60%", left: "20%", rotate: 15 },
  { Icon: Clipboard, color: "text-emerald-400", bg: "bg-emerald-400/20", top: "85%", right: "12%", rotate: -10 },
  { Icon: UserRound, color: "text-indigo-400", bg: "bg-indigo-400/20", top: "10%", right: "25%", rotate: 5 },
  { Icon: ShieldCheck, color: "text-purple-400", bg: "bg-purple-400/20", top: "35%", left: "25%", rotate: -30 },
  { Icon: Microscope, color: "text-teal-400", bg: "bg-teal-400/20", top: "90%", left: "45%", rotate: 12 },
];

export default function HealthcareStickers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {stickers.map((s, i) => (
        <motion.div
          key={i}
          className={`absolute p-3 rounded-2xl ${s.bg} border-2 border-white/10 shadow-2xl backdrop-blur-md hidden lg:block`}
          style={{ top: s.top, left: s.left, right: s.right, rotate: s.rotate }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.6, 
            scale: 1,
            y: [0, -15, 0],
            rotate: [s.rotate, s.rotate + 10, s.rotate]
          }}
          transition={{ 
            duration: 5 + i, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: i * 0.5 
          }}
          whileHover={{ scale: 1.2, opacity: 1, rotate: 0 }}
        >
          <s.Icon className={`${s.color}`} size={32} strokeWidth={2.5} />
          
          {/* Sticker "peel" effect */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white/20 rounded-tl-full blur-[2px]" />
        </motion.div>
      ))}
    </div>
  );
}
