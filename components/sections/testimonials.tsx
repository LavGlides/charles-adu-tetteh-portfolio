"use client";

import type React from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateImageFile, getUserAvatar } from "@/lib/image-utils";
import { Testimonial } from "@/types/database";

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/testimonials?approved=true");
        const data = await response.json();

        if (data.success) {
          setTestimonials(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch testimonials");
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Get all approved testimonials
  const approvedTestimonials = testimonials.filter((t) => t.isApproved);
  const totalSlides = Math.ceil(approvedTestimonials.length / 3);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay, totalSlides]);

  // Get testimonials for current slide (3 per slide)
  const getCurrentTestimonials = () => {
    const start = currentSlide * 3;
    return approvedTestimonials.slice(start, start + 3);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate the file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid Image",
          description: validation.error,
          variant: "destructive",
        });
        e.target.value = ""; // Clear the input
        setImagePreview(null);
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    // Clear the file input
    const fileInput = document.getElementById(
      "testimonial-image"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleTestimonialSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const imageFile = formData.get("image") as File;

      // Validate image if uploaded
      if (imageFile && imageFile.size > 0) {
        const validation = validateImageFile(imageFile);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
      }

      // Validate required fields (FormData will be validated on server)
      const requiredFields = [
        "name",
        "email",
        "role",
        "company",
        "projectType",
        "rating",
        "content",
      ];
      for (const field of requiredFields) {
        if (!formData.get(field)) {
          throw new Error(`Please fill in the ${field} field`);
        }
      }

      // Send FormData to handle image uploads
      const response = await fetch("/api/testimonial", {
        method: "POST",
        body: formData, // Send FormData directly
      });

      const result = await response.json();

      if (result.success) {
        // Reset form first, before showing toast
        const form = e.currentTarget;
        if (form) {
          form.reset();
        }

        // Clear image preview
        setImagePreview(null);

        // Close dialog
        setIsDialogOpen(false);

        // Show success toast
        toast({
          title: "Testimonial Submitted! ✅",
          description: result.message,
          className: "bg-green-600 text-white border-green-700",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error ❌",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.4, 0.0, 0.2, 1] as const,
      },
    },
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-20 bg-gradient-to-b from-slate-800/50 to-slate-900/50 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block p-3 bg-purple-500/20 rounded-2xl mb-6"
          >
            <Quote className="w-8 h-8 text-purple-400" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-playfair">
            What People Say
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-xl sm:max-w-2xl mx-auto font-inter font-light">
            Testimonials from colleagues, clients, and organizations I've had
            the privilege to work with
          </p>
        </motion.div>

        {/* Slider Controls */}
        {totalSlides > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center items-center gap-4 mb-8"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50 backdrop-blur-sm"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-purple-400 w-8"
                      : "bg-slate-600 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoPlay}
              className="bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50 backdrop-blur-sm"
              aria-label={isAutoPlay ? "Pause autoplay" : "Start autoplay"}
            >
              {isAutoPlay ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50 backdrop-blur-sm"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Testimonials Slider */}
        <div className="relative overflow-hidden mb-12">
          <AnimatePresence mode="wait" custom={currentSlide}>
            <motion.div
              key={currentSlide}
              custom={currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {getCurrentTestimonials().map((testimonial, index) => (
                  <motion.div
                    key={`${currentSlide}-${testimonial.id}`}
                    variants={itemVariants}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                    className="group"
                  >
                    <Card className="bg-slate-900/40 border border-slate-700/50 backdrop-blur-md shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/10 transition-all duration-500 h-full rounded-2xl overflow-hidden relative">
                      {/* Gradient border on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                      <CardContent className="p-6 sm:p-8 relative z-10">
                        {/* Quote icon */}
                        <motion.div
                          initial={{ rotate: -10, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 0.3 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.1 + 0.3,
                          }}
                          className="absolute top-6 right-6"
                        >
                          <Quote className="w-8 h-8 text-purple-400" />
                        </motion.div>

                        {/* Rating stars */}
                        <motion.div
                          className="flex items-center mb-6"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.1 + 0.4,
                            type: "spring",
                            stiffness: 200,
                          }}
                        >
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1 + 0.5 + i * 0.1,
                                type: "spring",
                              }}
                            >
                              <Star
                                className="text-yellow-400 fill-current mr-1"
                                size={18}
                              />
                            </motion.div>
                          ))}
                        </motion.div>

                        {/* Testimonial content */}
                        <motion.p
                          className="text-gray-200 mb-8 italic font-inter font-light text-sm sm:text-base leading-relaxed relative z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.6,
                            delay: index * 0.1 + 0.6,
                          }}
                        >
                          "{testimonial.testimonial}"
                        </motion.p>

                        {/* Author info */}
                        <motion.div
                          className="flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.1 + 0.7,
                          }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Avatar className="mr-4 w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-purple-400/30 group-hover:ring-purple-400/60 transition-all duration-300">
                              <AvatarImage
                                src={getUserAvatar(
                                  testimonial.clientEmail || "",
                                  testimonial.clientImage
                                )}
                                alt={testimonial.clientName}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-700 text-white font-inter font-semibold text-lg">
                                {testimonial.clientName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <div>
                            <h4 className="text-white font-semibold font-playfair text-base sm:text-lg mb-1">
                              {testimonial.clientName}
                            </h4>
                            <p className="text-purple-200 font-inter font-light text-sm leading-tight">
                              {testimonial.clientTitle}
                            </p>
                            <p className="text-gray-400 font-inter font-light text-xs">
                              {testimonial.clientCompany}
                            </p>
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress indicator */}
        {totalSlides > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mb-8"
          >
            <p className="text-gray-400 font-inter font-light text-sm">
              Showing {currentSlide * 3 + 1}-
              {Math.min((currentSlide + 1) * 3, approvedTestimonials.length)} of{" "}
              {approvedTestimonials.length} testimonials
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="text-center mt-12 sm:mt-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-2xl p-8 sm:p-10 border border-slate-700/30"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 font-playfair">
              Have you worked with me?
            </h3>
            <p className="text-gray-200 mb-6 font-inter font-light text-sm sm:text-base max-w-md mx-auto">
              I'd love to hear about your experience working together!
            </p>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 font-inter font-medium text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    aria-label="Share your testimonial"
                  >
                    Share Your Experience
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border-slate-700/50 backdrop-blur-md rounded-2xl">
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
                      <Label
                        htmlFor="testimonial-name"
                        className="text-white font-inter font-medium text-sm sm:text-base"
                      >
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
                      <Label
                        htmlFor="testimonial-email"
                        className="text-white font-inter font-medium text-sm sm:text-base"
                      >
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
                      <Label
                        htmlFor="testimonial-role"
                        className="text-white font-inter font-medium text-sm sm:text-base"
                      >
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
                      <Label
                        htmlFor="testimonial-company"
                        className="text-white font-inter font-medium text-sm sm:text-base"
                      >
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

                  {/* Optional Image Upload with Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.55 }}
                  >
                    <Label
                      htmlFor="testimonial-image"
                      className="text-white font-inter font-medium text-sm sm:text-base"
                    >
                      Your Photo (Optional)
                    </Label>
                    <div className="space-y-3">
                      <Input
                        id="testimonial-image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="bg-slate-900/50 border-slate-700/50 text-white focus:ring-purple-400 focus:border-purple-400 font-inter font-light text-sm sm:text-base rounded-lg file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1"
                      />

                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border-2 border-purple-400/30"
                          />
                          <button
                            type="button"
                            onClick={clearImagePreview}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                            aria-label="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      )}

                      <p className="text-gray-400 text-xs">
                        Upload a photo or we'll use your Gravatar. Max 5MB,
                        JPEG/PNG/WebP only.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Label
                      htmlFor="project-type"
                      className="text-white font-inter font-medium text-sm sm:text-base"
                    >
                      Type of Work/Project *
                    </Label>
                    <Select name="projectType" required>
                      <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-white focus:ring-purple-400 focus:border-purple-400 font-inter font-light text-sm sm:text-base rounded-lg">
                        <SelectValue placeholder="Select the type of work" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="web-development">
                          Web Development
                        </SelectItem>
                        <SelectItem value="mobile-development">
                          Mobile Development
                        </SelectItem>
                        <SelectItem value="cloud-solutions">
                          Cloud Solutions
                        </SelectItem>
                        <SelectItem value="training">
                          Technical Training
                        </SelectItem>
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
                    <Label
                      htmlFor="rating"
                      className="text-white font-inter font-medium text-sm sm:text-base"
                    >
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
                    <Label
                      htmlFor="testimonial-content"
                      className="text-white font-inter font-medium text-sm sm:text-base"
                    >
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
                    <Label
                      htmlFor="consent"
                      className="text-gray-200 font-inter font-light text-sm"
                    >
                      I consent to having my testimonial published on this
                      website *
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
                      aria-label={
                        isSubmitting
                          ? "Submitting testimonial"
                          : "Submit testimonial"
                      }
                    >
                      {isSubmitting ? "Submitting..." : "Submit Testimonial"}
                    </Button>
                  </motion.div>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
