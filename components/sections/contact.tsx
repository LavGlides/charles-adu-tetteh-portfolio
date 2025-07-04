"use client";

import type React from "react";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, Send, Briefcase, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Contact() {
  const ref = useRef(null);
  const contactFormRef = useRef<HTMLFormElement>(null);
  const serviceFormRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(ref, { once: true });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    projectType: "",
    budget: "",
    timeline: "",
  });

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message Sent! ✅",
          description: result.message,
          className: "bg-green-600 border-green-500 text-white",
        });
        // Reset form using ref
        if (contactFormRef.current) {
          contactFormRef.current.reset();
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error ❌",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        clientName: formData.get("clientName") as string,
        clientEmail: formData.get("clientEmail") as string,
        projectType: serviceFormData.projectType,
        budget: serviceFormData.budget,
        timeline: serviceFormData.timeline,
        projectDescription: formData.get("projectDescription") as string,
      };

      // Validate that all fields are filled
      if (
        !data.clientName ||
        !data.clientEmail ||
        !data.projectType ||
        !data.budget ||
        !data.timeline ||
        !data.projectDescription
      ) {
        throw new Error("Please fill in all required fields");
      }

      const response = await fetch("/api/service-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Service Request Submitted! 🚀",
          description: result.message,
          className: "bg-green-600 border-green-500 text-white",
        });
        // Reset form using ref
        if (serviceFormRef.current) {
          serviceFormRef.current.reset();
        }
        // Reset select state
        setServiceFormData({ projectType: "", budget: "", timeline: "" });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error ❌",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit service request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to start your next project? Let's discuss how I can help bring
            your ideas to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-slate-800/50 border-slate-600 h-full">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Mail className="text-purple-400" size={20} />
                  <div>
                    <p className="text-gray-300">aducharlest@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-purple-400" size={20} />
                  <div>
                    <p className="text-gray-300">+233 541 725 256</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Linkedin className="text-purple-400" size={20} />
                  <div>
                    <a
                      href="https://www.linkedin.com/in/charles-adu-tetteh-00546a109"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 transition-colors duration-200 hover:underline"
                    >
                      Charles Adu Tetteh
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-purple-400" size={20} />
                  <div>
                    <p className="text-gray-300">Accra, Ghana</p>
                  </div>
                </div>

                <div className="pt-6">
                  <h4 className="text-white font-medium mb-3">
                    Available for:
                  </h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Web app development</li>
                    <li>• Mobile app development</li>
                    <li>• AWS cloud solutions</li>
                    <li>• Technical training & consulting</li>
                    <li>• System architecture design</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-6">
                <Tabs defaultValue="contact" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                    <TabsTrigger
                      value="contact"
                      className="data-[state=active]:bg-purple-600"
                    >
                      <Mail className="mr-2" size={16} />
                      Contact Me
                    </TabsTrigger>
                    <TabsTrigger
                      value="service"
                      className="data-[state=active]:bg-purple-600"
                    >
                      <Briefcase className="mr-2" size={16} />
                      Book Service
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="contact" className="mt-6">
                    <form
                      ref={contactFormRef}
                      onSubmit={handleContactSubmit}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-white">
                            Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            required
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-white">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject" className="text-white">
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="What's this about?"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-white">
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Tell me about your project or inquiry..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="mr-2" size={16} />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="service" className="mt-6">
                    <form
                      ref={serviceFormRef}
                      onSubmit={handleServiceSubmit}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="client-name" className="text-white">
                            Name
                          </Label>
                          <Input
                            id="client-name"
                            name="clientName"
                            required
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="client-email" className="text-white">
                            Email
                          </Label>
                          <Input
                            id="client-email"
                            name="clientEmail"
                            type="email"
                            required
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="project-type" className="text-white">
                            Project Type
                          </Label>
                          <Select
                            value={serviceFormData.projectType}
                            onValueChange={(value) =>
                              setServiceFormData({
                                ...serviceFormData,
                                projectType: value,
                              })
                            }
                            required
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="web-app">
                                Web Application
                              </SelectItem>
                              <SelectItem value="mobile-app">
                                Mobile Application
                              </SelectItem>
                              <SelectItem value="cloud-solution">
                                Cloud Solution
                              </SelectItem>
                              <SelectItem value="training">
                                Technical Training
                              </SelectItem>
                              <SelectItem value="consulting">
                                Consulting
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="budget" className="text-white">
                            Budget Range
                          </Label>
                          <Select
                            value={serviceFormData.budget}
                            onValueChange={(value) =>
                              setServiceFormData({
                                ...serviceFormData,
                                budget: value,
                              })
                            }
                            required
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              <SelectItem value="under-5k">
                                Under $5,000
                              </SelectItem>
                              <SelectItem value="5k-10k">
                                $5,000 - $10,000
                              </SelectItem>
                              <SelectItem value="10k-25k">
                                $10,000 - $25,000
                              </SelectItem>
                              <SelectItem value="25k-50k">
                                $25,000 - $50,000
                              </SelectItem>
                              <SelectItem value="over-50k">
                                Over $50,000
                              </SelectItem>
                              <SelectItem value="to-be-determined">
                                To be determined
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="timeline" className="text-white">
                          Project Timeline
                        </Label>
                        <Select
                          value={serviceFormData.timeline}
                          onValueChange={(value) =>
                            setServiceFormData({
                              ...serviceFormData,
                              timeline: value,
                            })
                          }
                          required
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="When do you need this completed?" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="asap">ASAP</SelectItem>
                            <SelectItem value="1-month">
                              Within 1 month
                            </SelectItem>
                            <SelectItem value="2-3-months">
                              2-3 months
                            </SelectItem>
                            <SelectItem value="3-6-months">
                              3-6 months
                            </SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label
                          htmlFor="project-description"
                          className="text-white"
                        >
                          Project Description
                        </Label>
                        <Textarea
                          id="project-description"
                          name="projectDescription"
                          required
                          rows={5}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Describe your project in detail. What problem are you trying to solve? What features do you need? Any specific requirements?"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {isSubmitting ? (
                          "Submitting..."
                        ) : (
                          <>
                            <Briefcase className="mr-2" size={16} />
                            Submit Service Request
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
