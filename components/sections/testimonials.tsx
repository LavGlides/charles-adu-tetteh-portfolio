"use client";

import type React from "react";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleTestimonialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Testimonial Submitted!",
      description: "Thank you for your testimonial. It will be reviewed and published soon.",
    });

    setIsSubmitting(false);
    e.currentTarget.reset();
  };

  const approvedTestimonials = testimonials.filter((t) => t.approved);

  return (
    <section id="testimonials" className="py-16 sm:py-20 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-playfair">
            What People Say
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-xl sm:max-w-2xl mx-auto font-inter font-light">
            Testimonials from colleagues, clients, and organizations I've had the privilege to work with
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {approvedTestimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="bg-slate-900/30 border border-slate-700/50 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 h-full rounded-xl">
                <CardContent className="p-5 sm:p-6">
                  <motion.div
                    className="flex items-center mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current" size={16} />
                    ))}
                  </motion.div>

                  <p className="text-gray-200 mb-6 italic font-inter font-light text-sm sm:text-base leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center">
                    <Avatar className="mr-4 w-10 h-10 sm:w-12 sm:h-12">
                      <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback className="bg-purple-600/80 text-white font-inter font-medium">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-white font-semibold font-playfair text-base sm:text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-purple-200 font-inter font-light text-sm">{testimonial.role}</p>
                      <p className="text-gray-300 font-inter font-light text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="text-center mt-12 sm:mt-16"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 font-playfair">
            Have you worked with me?
          </h3>
          <p className="text-gray-200 mb-6 font-inter font-light text-sm sm:text-base">
            I'd love to hear about your experience working together!
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-2 sm:py-3 font-inter font-medium text-sm sm:text-base rounded-lg shadow-lg backdrop-blur-sm"
                aria-label="Share your testimonial"
              >
                Share Your Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-slate-900/95 border-slate-700/50 backdrop-blur-md rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl text-white font-playfair">
                  Share Your Testimonial
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleTestimonialSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Label htmlFor="testimonial-name" className="text-white font-inter font-medium text-sm sm:text-base">
                      Your Name *
                    </Label>
                    <Input
                      id="testimonial-name"
                      name="name"
                      required
                      className="bg-slate-900/50 border-slate-700/50 text-white focus:ring-purple-400 focus:border-purple-400 font-inter font-light text-sm sm:text-base rounded-lg"
                      placeholder="John Doe"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Label htmlFor="testimonial-email" className="text-white font-inter font-medium text-sm sm:text-base">
                      Email Address *
                    </Label>
                    <Input
                      id="testimonial-email"
                      name="email"
                      type="email"
                      required
                      className="bg-slate-900/50 border-slate-700/50 text-white focus:ring-purple-400 focus:border-purple-400 font-inter font-light text-sm sm:text-base rounded-lg"
                      placeholder="john@example.com"
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Label htmlFor="testimonial-role" className="text-white font-inter font-medium text-sm sm:text-base">
                      Your Role/Position *
                    </Label>
                    <Input
                      id="testimonial-role"
                      name="role"
                      required
                      className="bg-slate-900/50 border-slate-700/50 text-white focus:ring-purple-400 focus:border-purple-400 font-inter font-light text-sm sm:text-base rounded-lg"
                      placeholder="e.g., Project Manager"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Label htmlFor="testimonial-company" className="text-white font-inter font-medium text-sm sm:text-base">
                      Company/Organization *
                    </Label>
                    <Input
                      id="testimonial-company"
                      name="company"
                      required
                      className="bg-slate-900/50 border-slate-700/50 text-white focus:ring-purple-400 focus:border-purple-400 font-inter font-light text-sm sm:text-base rounded-lg"
                      placeholder="e.g., Tech Solutions Inc."
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Label htmlFor="project-type" className="text-white font-inter font-medium text-sm sm:text-base">
                    Type of Work/Project *
                  </Label>
                  <Select name="projectType" required>
                    <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white focus:ring-purple-400 focus:border-purple-400 font-inter font-light text-sm sm:text-base rounded-lg">
                      <SelectValue placeholder="Select the type of work" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="web-development">Web Development</SelectItem>
                      <SelectItem value="mobile-development">Mobile Development</SelectItem>
                      <SelectItem value="cloud-solutions">Cloud Solutions</SelectItem>
                      <SelectItem value="training">Technical Training</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Label htmlFor="rating" className="text-white font-inter font-medium text-sm sm:text-base">
                    Overall Rating *
                  </Label>
                  <Select name="rating" required>
                    <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white focus:ring-purple-400 focus:border-purple-400 font-inter font-light text-sm sm:text-base rounded-lg">
                      <SelectValue placeholder="Rate your experience" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                      <SelectItem value="2">⭐⭐ Fair</SelectItem>
                      <SelectItem value="1">⭐ Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Label htmlFor="testimonial-content" className="text-white font-inter font-medium text-sm sm:text-base">
                    Your Testimonial *
                  </Label>
                  <Textarea
                    id="testimonial-content"
                    name="content"
                    required
                    rows={5}
                    className="bg-slate-900/50 border-slate-700/50 text-white focus:ring-purple-400 focus:border-purple-400 font-inter font-light text-sm sm:text-base rounded-lg"
                    placeholder="Share your experience working with Charles. What was the project about? How was the collaboration? What results did you achieve?"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    className="rounded border-slate-700/50 bg-slate-900/50 focus:ring-purple-400"
                  />
                  <Label htmlFor="consent" className="text-gray-200 font-inter font-light text-sm">
                    I consent to having my testimonial published on this website *
                  </Label>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-inter font-medium text-sm sm:text-base rounded-lg shadow-lg backdrop-blur-sm"
                    aria-label={isSubmitting ? "Submitting testimonial" : "Submit testimonial"}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Testimonial"}
                  </Button>
                </motion.div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
}