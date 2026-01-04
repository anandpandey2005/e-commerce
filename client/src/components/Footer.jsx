import React from "react";
import {
  LucideFacebook,
  LucideInstagram,
  LucideYoutube,
  LucidePhone,
  LucideMessageSquare,
  LucideMapPin,
} from "lucide-react";
import { MapEmbed } from "../components";

export default function Footer() {
  return (
    <footer>
      <MapEmbed></MapEmbed>
      <div className="mx-auto flex flex-col md:flex-row justify-between gap-10 py-5 px-2 sm:px-10">
        {/* === COLUMN 1: Company Info & Socials === */}
        <div className="w-full md:w-1/3 flex flex-col space-y-2">
          <img
            src="/companyLogo/ompkgautomation.png"
            alt="ompkgautomation"
            className="w-[180px] h-auto mb-2 filter brightness-150 hover:opacity-75"
          />
          <p>
            Om Enterprises is committed to transforming the world of machines.
            We design and build cutting-edge machinery, such as packaging
            machines and chamber vacuum systems, with an uncompromising
            dedication to innovation and perfection.
          </p>

          <div className="flex space-x-2">
            <a href="#" aria-label="Facebook" className="hover:text-blue-600">
              <LucideFacebook />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-600">
              <LucideInstagram />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-red-500">
              <LucideYoutube />
            </a>
          </div>
        </div>

        {/* === COLUMN 2: Our Products === */}
        <div className="w-full md:w-1/3 flex flex-col space-y-4">
          <h3 className="text-xl font-semibold text-white uppercase mb-4 border-b-2 border-gray-700 pb-1 ">
            Our Products
          </h3>
          <ul className="grid grid-cols-2 sm:grid-2 md:grid-cols-3 gap-y-2 text-sm">
            <li className="hover:text-white cursor-pointer transition-colors">
              Lorem ipsum dolor{" "}
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              Lorem ipsum dolor{" "}
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              Lorem ipsum dolor{" "}
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              Lorem ipsum dolor{" "}
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              Lorem ipsum dolor{" "}
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              Lorem ipsum dolor{" "}
            </li>
          </ul>
        </div>

        {/* === COLUMN 3: Contact Details === */}
        <div className="w-full md:w-1/3 flex flex-col space-y-4">
          <h3 className="text-xl font-semibold text-white uppercase mb-4 border-b-2 border-gray-700 pb-1 ">
            Contact Details
          </h3>

          <div className="flex items-start gap-2 text-sm">
            <LucidePhone />
            <a href="tel:+919876543210">+91 98765 43210</a>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <LucideMessageSquare />
            <a href="mailto:info@omenterprises.com">info@omenterprises.com</a>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <LucideMapPin />
            <address className="not-italic">
              <a
                href="https://www.google.com/maps/place/Om+Packaging+Automation/@19.2359816,73.1431817,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7911e5d23ef3d:0x55a0f2ed2420abdb!8m2!3d19.2359766!4d73.1480526!16s%2Fg%2F11vbtfx5hr?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                target="_blank"
              >
                Office no. B-220, Regency Plaza, Shanti Nagar Kalyan - Ambernath
                Road Ulhasnagar - 3, Maharashtra 421002
              </a>
            </address>
          </div>
        </div>
      </div>

      <div></div>

      {/* === Bottom Bar/Copyright === */}
      <div className="mt-10 pt-6 border-t border-gray-700 text-center text-xs text-gray-500">
        &copy;{new Date().getFullYear()} Om Enterprises. All rights reserved.
      </div>
    </footer>
  );
}
