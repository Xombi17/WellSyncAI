"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80", alt: "Vaccine vials", span: "col-span-1 row-span-2" },
  { src: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&q=80", alt: "Healthcare worker", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80", alt: "Medical research", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80", alt: "DNA molecule", span: "col-span-1 row-span-2" },
  { src: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80", alt: "Doctor with patient", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=600&q=80", alt: "Vaccination", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80", alt: "Baby health checkup", span: "col-span-1 row-span-1" },
  { src: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&q=80", alt: "Stethoscope", span: "col-span-1 row-span-1" },
];

export default function LandingGallery() {
  return (
    <section id="gallery" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-[#060e20] to-surface-950" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Section className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs font-medium text-violet-400 mb-5">
            Gallery
          </span>
          <h2 className="font-heading font-[800] text-3xl sm:text-4xl leading-tight mb-4">
            Healthcare <span className="gradient-text-alt">reimagined</span>
          </h2>
          <p className="text-lg text-white/35">Modern vaccination and healthcare for every family</p>
        </Section>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-3">
          {galleryImages.map((img, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className={`gallery-item ${img.span} rounded-2xl overflow-hidden relative group cursor-pointer`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-sm font-heading font-[700] text-white">{img.alt}</p>
              </div>
              {/* Glow border on hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/0 group-hover:border-cyan-400/30 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  );
}
