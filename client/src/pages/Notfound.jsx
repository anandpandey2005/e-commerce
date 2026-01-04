import React from "react";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        404
      </h1>
      <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <a
        to="/"
        className="px-6 py-3 text-white font-medium rounded-md transition"
      >
        Go Back Home
      </a>
    </div>
  );
}
