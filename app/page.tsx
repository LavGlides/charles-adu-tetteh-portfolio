"use client";

import { motion } from "framer-motion";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Navigation } from "@/components/navigation";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900  to-slate-900/70 sm:bg-gradient-to-br sm:from-slate-900  sm:to-slate-900/70">
      <Navigation />
      {/* Hero section loads immediately without constraints */}
      <Hero />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <About />
        <Projects />
        <Testimonials />
        <Contact />
      </motion.main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
