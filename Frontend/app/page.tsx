"use client";
/* eslint-disable react/no-unescaped-entities */

import LandingHero from "@/components/landing/LandingHero";
import LandingProblem from "@/components/landing/LandingProblem";
import LandingSolution from "@/components/landing/LandingSolution";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingGallery from "@/components/landing/LandingGallery";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import FloatingElements from "@/components/landing/FloatingElements";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white relative overflow-hidden">
      {/* Floating medical background elements */}
      <FloatingElements />
      {/* Navigation */}
      <LandingNav />
      {/* Hero Section */}
      <LandingHero />
      {/* Problem Section */}
      <LandingProblem />
      {/* Solution Section */}
      <LandingSolution />
      {/* Features Section */}
      <LandingFeatures />
      {/* Gallery Section */}
      <LandingGallery />
      {/* CTA Section */}
      <LandingCTA />
      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
