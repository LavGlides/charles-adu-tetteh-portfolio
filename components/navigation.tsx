"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Active section detection
      const sections = ["home", "about", "projects", "testimonials", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/90 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-b from-slate-900/50 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 sm:py-5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate pr-4 font-playfair"
          >
            <span className="hidden sm:inline">Charles Adu Tetteh</span>
            <span className="sm:hidden">Charles A.T.</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <motion.div key={item.name} className="relative">
                  <motion.a
                    href={item.href}
                    whileHover={{
                      y: -4,
                      scale: 1.05,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative font-inter font-medium text-sm lg:text-base transition-all duration-300 px-3 py-2 rounded-lg ${
                      isActive
                        ? "text-purple-300 bg-purple-500/10"
                        : "text-gray-300 hover:text-white hover:bg-purple-500/20"
                    }`}
                  >
                    {item.name}

                    {/* Enhanced hover underline effect */}
                    <motion.span
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/50"
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileHover={{
                        scaleX: 1,
                        opacity: 1,
                        transition: { duration: 0.3, ease: "easeOut" },
                      }}
                    />

                    {/* Active indicator */}
                    {isActive && (
                      <motion.span
                        className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/50"
                        layoutId="activeTab"
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    )}

                    {/* Glow effect on hover */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-lg blur-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{
                        opacity: 1,
                        scale: 1.1,
                        transition: { duration: 0.3, ease: "easeOut" },
                      }}
                    />
                  </motion.a>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-purple-500/20"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden bg-slate-900/95 backdrop-blur-md rounded-lg p-4 mx-4 mb-4 shadow-lg"
          >
            {navItems.map((item, index) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <motion.div key={item.name} className="relative">
                  <motion.a
                    href={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{
                      x: 12,
                      scale: 1.02,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`block py-2 px-4 font-inter font-medium text-base transition-all duration-300 relative rounded-lg ${
                      isActive
                        ? "text-purple-300 bg-purple-500/20"
                        : "text-gray-200 hover:text-white hover:bg-purple-500/10"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}

                    {/* Active indicator for mobile */}
                    {isActive && (
                      <motion.span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full shadow-lg shadow-purple-500/50"
                        layoutId="activeMobileTab"
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    )}

                    {/* Enhanced hover effect for mobile */}
                    <motion.span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full shadow-lg shadow-purple-500/30"
                      initial={{ scaleY: 0, opacity: 0 }}
                      whileHover={{
                        scaleY: 1,
                        opacity: 0.7,
                        transition: { duration: 0.2, ease: "easeOut" },
                      }}
                    />

                    {/* Mobile glow effect */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-purple-600/10 rounded-lg blur-sm"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileHover={{
                        opacity: 1,
                        scale: 1.05,
                        transition: { duration: 0.3, ease: "easeOut" },
                      }}
                    />
                  </motion.a>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
