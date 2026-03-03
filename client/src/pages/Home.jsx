import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  ArrowRight,
  Settings,
  Globe,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Box,
  Layers,
  Zap,
  Cpu,
} from "lucide-react";

const IndustrialProLanding = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Colors based on your logo
  const colors = {
    slate: "#2D3748", // Main text/bg
    orange: "#F28C33", // Primary action
    yellow: "#FFC107", // Accents/Highlights
  };

  const heroSlides = [
    {
      title: "Precision Engineering",
      subtitle: "Smart Filling Solutions",
      img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1920",
      ratio: "21:9",
    },
    {
      title: "Seamless Integration",
      subtitle: "High-Speed Capping Tech",
      img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1920",
      ratio: "21:9",
    },
    {
      title: "End-to-End Efficiency",
      subtitle: "Automated Conveyor Systems",
      img: "https://images.unsplash.com/photo-1565608438257-fac3c27beb36?auto=format&fit=crop&q=80&w=1920",
      ratio: "21:9",
    },
  ];

  const categories = [
    {
      title: "Liquid Filling",
      icon: <Layers />,
      specs: "0.5% Accuracy",
      img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "Rotary Capping",
      icon: <Settings />,
      specs: "120 BPM Speed",
      img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "Induction Sealing",
      icon: <Zap />,
      specs: "Hermetic Seal",
      img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "Labeling Units",
      icon: <Cpu />,
      specs: "Wrap-around Tech",
      img: "https://images.unsplash.com/photo-1565608438257-fac3c27beb36?auto=format&fit=crop&q=80&w=600",
    },
  ];

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-[#2D3748] selection:bg-[#F28C33]/20">
      {/* Professional Multi-Image Hero */}
      <section className="relative h-[90vh] md:h-[80vh] w-full overflow-hidden">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSlide === idx ? "opacity-100" : "opacity-0"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#2D3748]/90 via-[#2D3748]/40 to-transparent z-10" />
            <img
              src={slide.img}
              className="w-full h-full object-cover scale-105"
              alt={slide.title}
            />
          </div>
        ))}

        {/* Slider Controls */}
        <div className="absolute bottom-10 right-10 z-30 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1 transition-all duration-300 ${activeSlide === i ? "w-12 bg-[#F28C33]" : "w-4 bg-white/30"}`}
            />
          ))}
        </div>
      </section>

      {/* Advanced Category Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px bg-slate-200 flex-grow"></div>
          <h2 className="text-sm font-black text-[#F28C33] tracking-[0.5em] uppercase">
            Machine Portfolios
          </h2>
          <div className="h-px bg-slate-200 flex-grow"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="group relative">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 border border-slate-100 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                <img
                  src={cat.img}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D3748] via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="w-10 h-10 bg-[#FFC107] rounded-lg flex items-center justify-center text-[#2D3748] mb-4 transform -rotate-12 group-hover:rotate-0 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="text-white text-xl font-bold mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-white/60 text-xs font-semibold tracking-wider uppercase">
                    {cat.specs}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Engineering Bar */}
      <section className="bg-[#2D3748] py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="flex gap-4 items-start">
            <ShieldCheck className="text-[#F28C33] shrink-0" size={32} />
            <div>
              <h4 className="text-white font-bold mb-1">Rugged Durability</h4>
              <p className="text-slate-400 text-sm">
                Industrial-grade stainless steel components designed for 24/7
                operation.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Globe className="text-[#FFC107] shrink-0" size={32} />
            <div>
              <h4 className="text-white font-bold mb-1">Global Standards</h4>
              <p className="text-slate-400 text-sm">
                Full compliance with international safety and precision
                manufacturing protocols.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Box className="text-[#F28C33] shrink-0" size={32} />
            <div>
              <h4 className="text-white font-bold mb-1">Custom Tooling</h4>
              <p className="text-slate-400 text-sm">
                In-house engineering team to create bespoke parts for unique
                bottle shapes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Action Bar */}
      <div className="py-12 text-center">
        <p className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
          Engineering Since 2004
        </p>
        <div className="flex justify-center gap-6 opacity-30 grayscale contrast-125">
          <span className="font-black italic text-xl">ISO-9001</span>
          <span className="font-black italic text-xl">CE-CERTIFIED</span>
          <span className="font-black italic text-xl">GMP-READY</span>
        </div>
      </div>
    </div>
  );
};

export default IndustrialProLanding;
