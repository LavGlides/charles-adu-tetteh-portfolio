"use client";

import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 xs:px-6 sm:px-8 py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-slate-950/50 via-purple-900/30 to-slate-950/50"
    >
      {/* Background Image with Parallax Effect */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url(/charles_big.png)",
          backgroundPosition: "50% 5%",
          backgroundSize: "cover",
        }}
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      {/* Background Particles with Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full opacity-20 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            animate={{
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Profile Image with 3D Tilt Effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.1, rotate: 2, transition: { duration: 0.4 } }}
        className="hidden sm:flex sm:justify-center sm:mt-6 md:mt-8 lg:mt-0 lg:absolute lg:top-20 xl:top-24 lg:right-4 xl:right-8 z-20"
      >
        <div className="relative">
          <motion.div
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-40 xl:h-40 rounded-full bg-gradient-to-br from-purple-600 via-gray-300 to-indigo-600 p-1.5 shadow-xl cursor-pointer"
            whileHover={{
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)",
              transition: { duration: 0.4 },
            }}
          >
            <img
              src="/charles_passport_size.png"
              alt="Charles Adu Tetteh"
              className="w-full h-full rounded-full object-cover border-2 border-white/90"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-user.jpg";
              }}
              aria-hidden="true"
            />
          </motion.div>
          {/* Pulsating Ring Animation */}
          <motion.div
            className="absolute -inset-2 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 opacity-20 blur-lg"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -inset-3 rounded-full border border-purple-400/30"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 xs:px-6 sm:px-8 text-center relative z-10 w-full sm:pr-0 md:pr-32 lg:pr-40 xl:pr-48">
        <div className="space-y-5 sm:space-y-7 md:space-y-8">
          {/* Immediate visibility with faster animations */}
          <motion.h1
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight tracking-tight font-playfair"
            initial={{ opacity: 0.3, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
          >
            Charles Adu Tetteh
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-purple-200 mb-3 sm:mb-4 px-2 sm:px-0 font-inter font-light"
            initial={{ opacity: 0.3, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          >
            Full-Stack Developer & AWS Cloud Solutions Architect
          </motion.p>

          <motion.p
            className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 max-w-md xs:max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto px-2 sm:px-4 leading-relaxed font-inter font-light"
            initial={{ opacity: 0.3, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          >
            Dynamic Computer Science graduate specializing in React, Next.js,
            and AWS cloud architecture. Proven expertise in delivering scalable
            enterprise solutions and training 300+ professionals.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-2 sm:px-4"
            initial={{ opacity: 0.3, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto text-sm sm:text-base rounded-lg shadow-lg backdrop-blur-sm bg-opacity-80 transition-all duration-300 font-inter font-medium"
              aria-label="Explore my projects"
            >
              <a href="#projects">Explore My Work</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-purple-300 text-purple-200 hover:bg-purple-500/20 hover:text-white px-6 sm:px-8 py-2 sm:py-3 bg-transparent w-full sm:w-auto text-sm sm:text-base rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 font-inter font-medium"
              aria-label="Connect with me"
            >
              <a href="#contact">Connect With Me</a>
            </Button>
          </motion.div>

          <TooltipProvider>
            <motion.div
              className="flex justify-center space-x-4 sm:space-x-6"
              initial={{ opacity: 0.3, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.a
                    href="https://www.linkedin.com/in/charles-adu-tetteh-00546a109"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.3, rotate: 8 }}
                    className="text-gray-200 hover:text-white transition-colors duration-300"
                    aria-label="Visit my LinkedIn profile"
                  >
                    <Linkedin size={20} className="sm:w-6 sm:h-6" />
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900/90 text-white font-inter font-light text-sm">
                  LinkedIn
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.3, rotate: -8 }}
                    className="text-gray-200 hover:text-white transition-colors duration-300"
                    aria-label="Visit my GitHub profile"
                  >
                    <Github size={20} className="sm:w-6 sm:h-6" />
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900/90 text-white font-inter font-light text-sm">
                  GitHub
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.a
                    href="mailto:aducharlest@gmail.com"
                    whileHover={{ scale: 1.3, rotate: 8 }}
                    className="text-gray-200 hover:text-white transition-colors duration-300"
                    aria-label="Send me an email"
                  >
                    <Mail size={20} className="sm:w-6 sm:h-6" />
                  </motion.a>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900/90 text-white font-inter font-light text-sm">
                  Email
                </TooltipContent>
              </Tooltip>
            </motion.div>
          </TooltipProvider>
        </div>

        <motion.div
          className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <a href="#about" aria-label="Scroll to About section">
            <ArrowDown
              className="text-purple-200 hover:text-purple-400 transition-colors duration-300"
              size={24}
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
