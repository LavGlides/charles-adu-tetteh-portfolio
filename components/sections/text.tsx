"use client";

import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8 sm:py-12 md:py-16 lg:py-20"
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
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Animated Background Particles with Parallax */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-25"
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
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Profile Image with Enhanced Hover and Ring Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="hidden sm:flex sm:justify-center sm:mt-6 md:mt-8 lg:mt-0 lg:absolute lg:top-28 lg:right-12 xl:top-32 xl:right-16 z-20"
      >
        <div className="relative">
          <motion.div
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-40 xl:h-40 rounded-full bg-gradient-to-br from-purple-600 via-gray-300 to-indigo-600 p-1.5 shadow-2xl cursor-pointer"
            whileHover={{
              scale: 1.15,
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
              transition: { duration: 0.4, ease: "easeOut" },
            }}
          >
            <img
              src="/charles_passport_size.png"
              alt="Charles Adu Tetteh"
              className="w-full h-full rounded-full object-cover border-2 border-white/90"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-user.jpg";
              }}
            />
          </motion.div>
          {/* Pulsating Ring Animation */}
          <motion.div
            className="absolute -inset-2 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 opacity-20 blur-lg"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full sm:pr-0 md:pr-32 lg:pr-40 xl:pr-48">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-5 sm:space-y-7 md:space-y-8"
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight tracking-tight font-serif"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
          >
            Charles Adu Tetteh
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-purple-200 mb-3 sm:mb-4 px-2 sm:px-0 font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
          >
            Full-Stack Developer & AWS Cloud Solutions Architect
          </motion.p>

          <motion.p
            className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 leading-relaxed font-sans"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease: "easeOut" }}
          >
            Dynamic Computer Science graduate specializing in React, Next.js, and AWS cloud architecture. Proven expertise in delivering scalable enterprise solutions and training 300+ professionals.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: "easeOut" }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto text-sm sm:text-base rounded-lg shadow-lg backdrop-blur-sm bg-opacity-80 transition-all duration-300"
            >
              <a href="#projects">Explore My Work</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-purple-300 text-purple-200 hover:bg-purple-500/20 hover:text-white px-6 sm:px-8 py-2 sm:py-3 bg-transparent w-full sm:w-auto text-sm sm:text-base rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300"
            >
              <a href="#contact">Connect With Me</a>
            </Button>
          </motion.div>

          <motion.div
            className="flex justify-center space-x-4 sm:space-x-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9, ease: "easeOut" }}
          >
            <motion.a
              href="https://www.linkedin.com/in/charles-adu-tetteh-00546a109"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.3, rotate: 8 }}
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              <Linkedin size={20} className="sm:w-6 sm:h-6" />
            </motion.a>
            <motion.a
              href="https://github.com/LavGlides"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.3, rotate: -8 }}
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              <Github size={20} className="sm:w-6 sm:h-6" />
            </motion.a>
            <motion.a
              href="mailto:aducharlest@gmail.com"
              whileHover={{ scale: 1.3, rotate: 8 }}
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              <Mail size={20} className="sm:w-6 sm:h-6" />
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <ArrowDown className="text-purple-300" size={24} />
        </motion.div>
      </div>
    </section>
  );
}