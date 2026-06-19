"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../Button";

type Props = {
  title: string;
};

const navItems = [
  { label: "Home", href: "/home" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const NavBar: React.FC<Props> = ({ title }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="relative h-16 flex flex-row justify-between items-center px-6 sm:px-10">
      <Link href="/" className="text-2xl font-bold text-primary">
        <div className="text-2xl sm:text-3xl font-light text-shadow-lg shadow-white text-primary font-poppins">
          <h1>{title}</h1>
        </div>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:block h-full">
        <ul className="flex space-x-10 text-lg h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li
                key={item.label}
                className={`relative border-b-2 h-full flex items-center transition-colors ${
                  isActive ? "border-primary" : "border-transparent hover:border-primary"
                }`}
              >
                <Link href={item.href}>
                  <span className={isActive ? "text-primary" : "hover:text-primary transition-colors"}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Desktop auth buttons */}
      <div className="hidden md:flex flex-row items-center">
        <Link href="/signup" className="ml-4">
          <Button variant="primary" size="medium" className="duration-500">
            Sign Up
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="secondary" size="medium" className="ml-2 hover:text-primary duration-500">
            Log In
          </Button>
        </Link>
      </div>

      {/* Mobile menu toggle */}
      <button
        className="md:hidden text-primary"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-16 left-0 right-0 z-50 flex flex-col gap-1 border-y border-gray-800 bg-black p-4 md:hidden"
          >
            {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-lg transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-gray-200 hover:bg-gray-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-2 flex gap-2">
            <Link href="/signup" className="flex-1" onClick={() => setMenuOpen(false)}>
              <Button variant="primary" size="medium" className="w-full">
                Sign Up
              </Button>
            </Link>
            <Link href="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
              <Button variant="secondary" size="medium" className="w-full">
                Log In
              </Button>
            </Link>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
