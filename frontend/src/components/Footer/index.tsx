"use client";

import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="text-center font-poppins text-sm py-4 text-gray-400 border-t border-gray-800 bg-gray-900">
      &copy; JobJuxta-AI {year}
    </footer>
  );
};

export default Footer;
