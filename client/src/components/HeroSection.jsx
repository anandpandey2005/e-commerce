import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Truck, Receipt, LifeBuoy, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  const slides = [
    "https://placehold.co/900x900/png?text=Slide+1",
    "https://placehold.co/900x900/png?text=Slide+2",
    "https://placehold.co/900x900/png?text=Slide+3",
    "https://placehold.co/900x900/png?text=Slide+4",
    "https://placehold.co/900x900/png?text=Slide+5",
  ];

  const features = [
    { icon: <ShieldCheck size={28} />, label: "Warranty Cover" },
    { icon: <Receipt size={28} />, label: "GST Billing" },
    { icon: <Truck size={28} />, label: "Fast Delivery" },
    { icon: <LifeBuoy size={28} />, label: "24x7 Support" },
  ];

  return (
    <div className="w-full flex flex-col">
      <div>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-[55vh] sm:h-[80vh]"
        >
          {slides.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={`slide-${index}`}
                loading="lazy"
                className="
          w-full h-full object-cover
          transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
          hover:scale-[1.04] grayscale-75 hover:grayscale-0        "
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="w-full px-4 py-6 bg-[#2D1E12] text-white">
        <div className="flex sm:grid sm:grid-cols-4 gap-6 max-w-7xl mx-auto overflow-auto">
          {features.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-center space-x-3 hover:scale-105 transition duration-200"
            >
              <span className="text-[#f8f812]">{item.icon}</span>
              <p className="tracking-wide">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
