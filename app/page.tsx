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
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          <Hero />
          <About />
          <Projects />
          <Testimonials />
          <Contact />
          <Footer />
          <ScrollToTop />
        </motion.div>
      </motion.main>
    </div>
  );
}