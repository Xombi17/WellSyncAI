"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useInView } from "framer-motion";

const imageStacks = [
  [
    "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80", 
    "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=600&q=80",
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&q=80"
  ],
  [
    "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80", 
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
    "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80"
  ],
  [
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80", 
    "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&q=80",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=80"
  ]
];

const titles = [
  ["Vaccine Care", "Clinic Support", "Staff Expertise"],
  ["Expert Doctors", "Modern Surgery", "Patient Support"],
  ["Family Health", "Smart Records", "Care for All"]
];

function FlipStackCard({ images, titles, index }: { images: string[], titles: string[], index: number }) {
  const [step, setStep] = useState(0); // 0, 1, 2
  const [rotation, setRotation] = useState(0);

  const handleClick = () => {
    setRotation(prev => prev + 180);
    setStep(prev => (prev + 1) % 3);
  };

  // Determine which image is on front vs back based on current rotation
  const isFrontVisible = (Math.abs(rotation) / 180) % 2 === 0;
  
  // Logic to swap images: 
  // Step 0: Image 0 on Front, Image 1 on Back
  // Click -> Step 1: Image 1 on Back (Visible), Image 2 on Front (Hidden)
  // Click -> Step 2: Image 2 on Front (Visible), Image 0 on Back (Hidden)
  
  const frontImage = step === 0 ? images[0] : (step === 1 ? images[2] : images[2]); 
  // Wait, let's simplify:
  // We have 3 images: A, B, C.
  // Rotate 0: A(front)
  // Rotate 180: B(back)
  // Rotate 360: C(front)
  // Rotate 540: A(back)
  // Rotate 720: B(front)...
  
  const getImage = (side: 'front' | 'back') => {
    const totalFlips = rotation / 180;
    const currentStep = totalFlips % 6; // cycle of 6 to cover all pairs
    
    // This is getting complex. Let's just use the 'step' and 'isFrontVisible'
    // To make it feel like 3 unique images:
    if (side === 'front') {
      // Front is used at 0, 360, 720...
      // Map flip count: 0 -> img0, 2 -> img2, 4 -> img1
      const frontIdx = [0, 0, 2, 0, 1, 0][totalFlips % 6]; 
      // Actually let's just use the step
      return step === 0 ? images[0] : (step === 2 ? images[2] : images[0]);
    } else {
      // Back is used at 180, 540, 900...
      return step === 1 ? images[1] : images[1];
    }
  };

  return (
    <div 
      className="relative w-full h-[400px] perspective-1000 cursor-pointer group"
      onClick={handleClick}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: rotation }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 15 }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden border border-white/10 glass-card">
          <img src={images[step % 3]} alt="Healthcare" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">Step {(step % 3) + 1}</p>
            <h3 className="text-white font-heading font-bold text-xl">{titles[step % 3]}</h3>
          </div>
        </div>

        {/* Back Side (The AI Sticker) */}
        <div 
          className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden border-4 border-white glass-strong flex items-center justify-center p-6 bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* The Sticker Image */}
            <motion.div 
              className="relative w-full h-[85%] rounded-2xl overflow-hidden border-2 border-white shadow-lg"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src="/images/landing/family-sticker.png" alt="Happy Rural Family" className="w-full h-full object-cover" />
              
              {/* Simulated Eye Blinking (Overlay divs) */}
              {/* Note: Positioned roughly where eyes would be on a standard portrait */}
              <motion.div 
                className="absolute top-[35%] left-[38%] w-1.5 h-0.5 bg-black/80 rounded-full"
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }}
              />
              <motion.div 
                className="absolute top-[35%] left-[43%] w-1.5 h-0.5 bg-black/80 rounded-full"
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }}
              />
              <motion.div 
                className="absolute top-[32%] left-[62%] w-1.5 h-0.5 bg-black/80 rounded-full"
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4 }}
              />
            </motion.div>
            
            <motion.div 
              className="mt-4 px-4 py-1.5 bg-white text-surface-950 font-heading font-bold text-sm rounded-full shadow-lg"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Happy Families, Healthier Future
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Decorative floating dots around the frame */}
      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-cyan-500/20 blur-xl group-hover:scale-150 transition-transform" />
      <div className="absolute -bottom-4 -right-4 w-10 h-10 rounded-full bg-blue-500/10 blur-xl group-hover:scale-150 transition-transform" />
    </div>
  );
}

export default function LandingGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="gallery" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-[#060e20] to-surface-950" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-medium text-cyan-400 mb-5">
            Interactive Frames
          </span>
          <h2 className="font-heading font-[800] text-4xl sm:text-5xl leading-tight mb-4">
            Flip Through <span className="gradient-text">Innovation</span>
          </h2>
          <p className="text-lg text-white/35">Click each frame to explore the 3 layers of our care</p>
        </motion.div>

        {/* 3 Columns in 1 Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {imageStacks.map((stack, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <FlipStackCard images={stack} titles={titles[i]} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
      
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
}
