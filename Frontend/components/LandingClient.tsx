'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Activity, ShieldCheck, HeartPulse, Clock, 
  BrainCircuit, Globe2, Star, Download, Play, Smartphone
} from 'lucide-react';

export default function LandingClient() {
  return (
    <div className="relative z-10 w-full">
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary dark:text-secondary font-bold text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-primary dark:bg-secondary animate-pulse" />
            Voted #1 Healthcare PWA
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-lora font-black tracking-tight leading-[1.1] mb-6 text-slate-900 dark:text-white">
            Accessible health tracking for your family.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto md:mx-0 mb-10">
            No typing, no complex menus. Talk to a digital health assistant that instantly organizes health records in 6 local languages.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Link href="/login" className="w-full sm:w-auto overflow-hidden bg-primary hover:bg-cyan-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-cyan-500 outline-hidden flex items-center justify-center gap-2 shadow-lg">
              <Download size={20} />
              Install App
            </Link>
            <Link href="#demo" className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-secondary px-8 py-4 rounded-xl text-lg font-bold transition-all focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-slate-400 outline-hidden flex items-center justify-center gap-2">
              <Play size={20} />
              Watch Demo
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center md:justify-start gap-2 text-sm font-bold text-slate-500">
            <div className="flex text-amber-500">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>
            <span>4.9/5 from 10k+ users</span>
          </div>
        </div>

        {/* Device Mockup */}
        <div className="flex-1 flex justify-center w-full relative">
          <div className="relative w-72 h-[600px] border-[12px] border-slate-900 dark:border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden bg-white dark:bg-slate-950 flex flex-col pt-10">
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 dark:bg-slate-800 rounded-b-3xl mx-auto w-32" />
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Activity className="text-white" size={20} />
                </div>
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
              </div>
              <div className="h-32 bg-primary/10 rounded-2xl flex flex-col justify-end p-4">
                <div className="h-4 w-24 bg-primary/30 rounded mb-2" />
                <div className="h-8 w-40 bg-primary/50 rounded" />
              </div>
              <div className="space-y-3 mt-4">
                {[1,2,3].map(i => (
                  <div key={i} className="h-16 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center px-4 gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES */}
      <section id="features" className="py-24 bg-slate-100 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-lora font-black tracking-tight mb-6 text-slate-900 dark:text-white">
              Built for <span className="text-primary dark:text-secondary">Accessibility</span>.
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              High contrast, large touch targets, and full screen reader support. Designed for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Globe2, title: "6 Local Languages", desc: "Speak naturally in English, Hindi, Marathi, Bengali, Tamil, and Telugu." },
              { icon: ShieldCheck, title: "Medicine Safety", desc: "Scan medicine strips. We cross-reference with schedules to prevent errors." },
              { icon: BrainCircuit, title: "Smart Memory", desc: "Remembers past events and accurately schedules due dates automatically." },
              { icon: Clock, title: "Predictive Timelines", desc: "Indian NIS scheduler calculates exact dates for vaccinations." },
              { icon: HeartPulse, title: "Holistic Dashboard", desc: "Visualize family health trends with easy-to-read charts and logs." },
              { icon: Smartphone, title: "Works Offline", desc: "Log events without internet. We securely sync when you reconnect." }
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-primary"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="text-primary dark:text-secondary" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. APP RATINGS & REVIEWS */}
      <section id="reviews" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-lora font-black mb-4 tracking-tight text-slate-900 dark:text-white">Trusted Community</h2>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
              <div className="flex text-amber-500">
                <Star size={24} fill="currentColor" />
                <Star size={24} fill="currentColor" />
                <Star size={24} fill="currentColor" />
                <Star size={24} fill="currentColor" />
                <Star size={24} fill="currentColor" />
              </div>
              4.9 out of 5
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">Based on 10,000+ reviews</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.", title: "Incredible Voice Support", text: "WellSync changed how I manage vaccinations. The voice assistant is shockingly helpful when I have my hands full." },
              { name: "Advait K.", title: "Lifesaver for my clinic", text: "The medicine scanning feature is a game changer for remote care. It prevents dangerous medicine mixups in seconds." },
              { name: "Rohan M.", title: "Best mobile PWA", text: "Installs instantly on my phone. The UI is gorgeous, high contrast and the latency is non-existent." }
            ].map((t, i) => (
              <div 
                key={i}
                className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex gap-1 mb-4 text-amber-500">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                </div>
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{t.title}</h4>
                <p className="text-slate-600 dark:text-slate-300 mb-6">&quot;{t.text}&quot;</p>
                <div className="font-bold text-slate-900 dark:text-white">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BOTTOM DOWNLOAD / INSTALL CTA */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-lora font-black tracking-tight mb-8">
            Get WellSync AI today.
          </h2>
          <p className="text-xl text-primary-light mb-10 font-medium">
            100% free. Works offline. Accessible for everyone.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto bg-white text-primary px-10 py-4 rounded-xl text-lg font-bold hover:bg-slate-100 transition-colors focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:ring-white outline-hidden flex items-center justify-center gap-2 shadow-xl">
              <Download size={20} />
              Install Free App
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
