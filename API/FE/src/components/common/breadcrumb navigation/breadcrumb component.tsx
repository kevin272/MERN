import React from "react";
import law from "../../../assets/public/Law.jpg";

const Breadcrumbnavigation = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="relative bg-cover bg-center h-64 flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${law})` }} 
    >
      {/* Dark Red Overlay */}
      <div className="absolute inset-0 bg-red-800 opacity-80"></div>

      {/* Content */}
      <div className="relative text-center">
        <h1 className="text-4xl font-bold">{String(children).toUpperCase()}</h1>
        <p className="mt-2 text-lg">
          <a href="/" className="text-gray-300 hover:text-white">Home</a>
          <span className="text-gray-400"> / </span>
          <span className="text-white">{children}</span>
        </p>
      </div>
    </div>
  );
};

export default Breadcrumbnavigation;
