import React from "react";

// You might want to replace this with an actual green-themed abstract image
// or a pattern that fits your SajhaBiz brand.
// For now, using a placeholder that suggests growth/nature.
import greenThemedImage from "../../../assets/breadcrumb.jpg"; // Adjust the path as necessary

const Breadcrumbnavigation = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="relative bg-cover bg-center h-48 sm:h-56 md:h-64 flex items-center justify-center text-white overflow-hidden"
      style={{ backgroundImage: `url(${greenThemedImage})` }} 
    >
      {/* Dark Green Overlay */}
      <div className="absolute inset-0 bg-emerald-800 opacity-80 dark:bg-gray-900 dark:opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md">
          {String(children).toUpperCase()}
        </h1>
        <p className="mt-3 text-lg sm:text-xl font-medium">
          <a href="/" className="text-emerald-200 hover:text-white transition-colors duration-200">Home</a>
          <span className="text-emerald-400 mx-2">/</span>
          <span className="text-white font-semibold">{children}</span>
        </p>
      </div>
    </div>
  );
};

export default Breadcrumbnavigation;