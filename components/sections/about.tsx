"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Cloud, Database, Users, Award, MapPin } from "lucide-react";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skills = [
    { category: "Frontend", icon: Code, items: ["React", "Next.js", "TypeScript", "React Native", "HTML/CSS"] },
    { category: "Backend", icon: Database, items: ["Node.js", "PostgreSQL", "MongoDB", "MySQL", "API Development"] },
    { category: "Cloud", icon: Cloud, items: ["AWS", "DynamoDB", "S3", "CloudFront", "CloudFormation"] },
    { category: "Other", icon: Users, items: ["Git", "CI/CD", "Training", "Technical Writing", "System Architecture"] },
  ];

  const achievements = [
    { icon: Users, text: "Trained 300+ individuals with 95% satisfaction" },
    { icon: Award, text: "Improved operational efficiency by 25% at GBC" },
    { icon: Code, text: "Built enterprise solutions for major organizations" },
    { icon: MapPin, text: "Based in Accra, Ghana" },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-playfair">About Me</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-xl sm:max-w-2xl mx-auto font-inter font-light">
            A passionate developer with a proven track record of delivering enterprise solutions and empowering others
            through technical training and mentorship.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 font-playfair">My Journey</h3>
                <p className="text-gray-200 mb-6 leading-relaxed font-inter font-light text-sm sm:text-base">
                  As a Computer Science graduate from Garden City University College, I've built my career around
                  creating impactful solutions and sharing knowledge. Currently serving as IT Officer & Social Media
                  Manager at Ghana Broadcasting Corporation, I've developed enterprise systems that serve millions of
                  users.
                </p>
                <p className="text-gray-200 leading-relaxed font-inter font-light text-sm sm:text-base">
                  My expertise spans full-stack development, AWS cloud solutions, and technical training. I'm passionate
                  about simplifying complex technical concepts and have successfully trained over 300 individuals across
                  various organizations.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 font-playfair">Key Achievements</h3>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.15, ease: "easeOut" }}
                      className="flex items-center space-x-3"
                    >
                      <achievement.icon className="text-purple-400 flex-shrink-0" size={20} />
                      <span className="text-gray-200 font-inter font-light text-sm sm:text-base">{achievement.text}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10 sm:mb-12 font-playfair">Technical Expertise</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.15, ease: "easeOut" }}
              >
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-900/70 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5 sm:p-6 text-center">
                    <skillGroup.icon className="text-purple-400 mx-auto mb-4" size={32} />
                    <h4 className="text-lg sm:text-xl font-semibold text-white mb-4 font-playfair">{skillGroup.category}</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {skillGroup.items.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-purple-600/20 text-purple-200 border-purple-500/30 font-inter font-medium text-xs sm:text-sm"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}