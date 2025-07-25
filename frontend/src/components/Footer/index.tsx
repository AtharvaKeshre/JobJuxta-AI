"use client";

import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="text-center font-poppins text-sm py-4 text-white-700">
      &copy; जॉब जुक्सटा {year}
    </footer>
  );
};

export default Footer;
