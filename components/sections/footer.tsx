"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import * as analytics from "@/lib/analytics";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-gradient-to-b from-slate-900/50 to-slate-950/50 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "0px", amount: 0.3 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 font-playfair">
                Charles Adu Tetteh
              </h3>
              <p className="text-gray-200 mb-4 font-inter font-light text-sm sm:text-base">
                Full-Stack Developer & AWS Cloud Solutions Expert passionate
                about creating impactful solutions and empowering others through
                technology.
              </p>
              <div className="flex space-x-4">
                {[
                  {
                    href: "https://www.linkedin.com/in/charles-adu-tetteh-00546a109",
                    icon: Linkedin,
                    label: "LinkedIn",
                  },
                  {
                    href: "https://github.com/LavGlides",
                    icon: Github,
                    label: "GitHub",
                  },
                  {
                    href: "mailto:aducharlest@gmail.com",
                    icon: Mail,
                    label: "Email",
                  },
                ].map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => analytics.trackSocialClick(link.label)}
                    whileHover={{ scale: 1.2, y: -2, color: "#c084fc" }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-300 hover:text-purple-400 font-inter font-medium text-sm sm:text-base"
                    aria-label={link.label}
                  >
                    <link.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true, margin: "0px", amount: 0.3 }}
            >
              <h4 className="text-lg sm:text-xl font-semibold text-white mb-4 font-playfair">
                Services
              </h4>
              <ul className="space-y-2 text-gray-200 font-inter font-light text-sm sm:text-base">
                <li>Full-Stack Web Development</li>
                <li>Mobile App Development</li>
                <li>AWS Cloud Solutions</li>
                <li>Technical Training</li>
                <li>System Architecture</li>
                <li>Database Design</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true, margin: "0px", amount: 0.3 }}
            >
              <h4 className="text-lg sm:text-xl font-semibold text-white mb-4 font-playfair">
                Contact Info
              </h4>
              <div className="space-y-3 text-gray-200 font-inter font-light text-sm sm:text-base">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-center space-x-2"
                >
                  <Mail size={16} className="text-purple-400 flex-shrink-0" />
                  <span>
                    <a href="mailto:aducharlest@gmail.com">
                      aducharlest@gmail.com
                    </a>
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex items-center space-x-2"
                >
                  <Phone size={16} className="text-purple-400 flex-shrink-0" />
                  <span>
                    <a href="tel:+233541725256">+233 541 725 256</a>
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex items-center space-x-2"
                >
                  <MapPin size={16} className="text-purple-400 flex-shrink-0" />
                  <span>Accra, Ghana</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "0px", amount: 0.3 }}
            className="border-t border-slate-800/50 mt-8 pt-8 text-center"
          >
            <p className="text-gray-300 font-inter font-light text-sm sm:text-base">
              © {currentYear} Charles Adu Tetteh. All rights reserved. 
            </p>
          </motion.div>
        </div>
      </footer>
    </>
  );
}
