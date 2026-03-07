import React from "react";
import { Meta } from "react-router-dom";

// Changed ({ props }) to (props)
export default function CategoryCard(props) {
  return (
    <div className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl hover:border-yellow-500 transition-colors bg-white shadow-sm cursor-pointer w-40">
      <div className="w-24 h-24 mb-3 overflow-hidden rounded-full border border-gray-100">
        <img
          src={props.image}
          alt={props.name}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-sm font-semibold text-gray-700 text-center uppercase tracking-wide">
        {props.name}
      </h3>
    </div>
  );
}
