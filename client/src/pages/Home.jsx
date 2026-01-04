import React, { useState } from "react";
import {
  HeroSection,
  MapEmbed,
  CategoryDisplay,
  Awards_Recognition,
} from "../components";

/* ----------------------- INTRO SECTION ----------------------- */
const IntroSection = () => <div className=""></div>;

/* --------------------- PRODUCT CATEGORIES --------------------- */
const ProductCategoriesSection = () => (
  <section className="w-full p-5 flex-col space-y-8 hidden sm:flex justify-center">
    <div className="flex px-2 justify-center">
      <div className="flex flex-col text-center space-y-2">
        <p className="text-2xl uppercase tracking-widest text-gray-500">
          what we have
        </p>
        <h2>
          Product <span className="text-yellow-300">Categories</span>
        </h2>
      </div>
    </div>

    <div className="flex gap-8 justify-center flex-wrap">
      <CategoryDisplay />
      <CategoryDisplay />
      <CategoryDisplay />
      <CategoryDisplay />
    </div>
  </section>
);

/* ------------------- MOBILE CATEGORY SCROLL ------------------- */
const MobileCategoryScroll = () => (
  <div className="w-full p-2 flex gap-5 sm:hidden overflow-auto">
    <CategoryDisplay />
    <CategoryDisplay />
    <CategoryDisplay />
    <CategoryDisplay />
    <CategoryDisplay />
    <CategoryDisplay />
  </div>
);

/* ------------------------------ HOME ------------------------------ */
export default function Home() {
  return (
    <main>
      <MobileCategoryScroll />
      <HeroSection />
      <IntroSection />
      <ProductCategoriesSection />
      <Awards_Recognition />
    </main>
  );
}
