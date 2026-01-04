// MapEmbed.jsx
import React from "react";

export default function MapEmbed() {
  return (
    <div className="w-full mx-auto">
      <iframe
        title="Om Packaging Automation Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.4605568995623!2d73.1431817!3d19.2359816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7911e5d23ef3d%3A0x55a0f2ed2420abdb!2sOm%20Packaging%20Automation!5e0!3m2!1sen!2sin!4v1709999999999!5m2!1sen!2sin"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="
          w-full 
          h-[400px] 
          md:h-[500px] 
          
          grayscale-65 hover:grayscale-0 
          transition-all duration-500 ease-in-out
        "
      ></iframe>
    </div>
  );
}
