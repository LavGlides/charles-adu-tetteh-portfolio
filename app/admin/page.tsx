"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Briefcase,
  BarChart3,
  Users,
  Eye,
  Check,
  X,
  Edit,
  Trash2,
  Star,
  Mail,
  Plus,
  Upload,
  Image,
} from "lucide-react";

// Interfaces
interface AdminStats {
  totalMessages: number;
  unreadMessages: number;
  totalRequests: number;
  pendingRequests: number;
  totalProjects: number;
  activeProjects: number;
  totalTestimonials: number;
  pendingTestimonials: number;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  isReplied?: boolean;
  replyNotes?: string;
}

interface ServiceRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  projectType: string;
  budget: string;
  timeline: string;
  projectDescription: string;
  status: string;
  priority?: string;
  createdAt: string;
  isRead?: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  featured: boolean;
  createdAt: string;
}

interface Testimonial {
  id: string;
  clientName: string;
  clientEmail: string;
  clientTitle: string;
  clientCompany: string;
  testimonial: string;
  rating: number;
  isApproved: boolean;
  featured?: boolean;
  serviceType: string;
  createdAt: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalMessages: 0,
    unreadMessages: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalTestimonials: 0,
    pendingTestimonials: 0,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [emailConfigStatus, setEmailConfigStatus] = useState<{
    configured: boolean;
    message: string;
  } | null>(null);

  // Modal states
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);

  // Form states
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);
  const [replyForm, setReplyForm] = useState({ subject: "", message: "" });
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    technologies: "",
    category: "WEB_DEVELOPMENT",
    status: "PLANNING",
    featured: false,
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    clientName: "",
    budget: "",
    challenges: "",
    solutions: "",
    results: "",
  });

  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, or WebP image.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to server
  const uploadImage = async (): Promise<string> => {
    if (!selectedImage) return "";

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("folder", "projects");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to upload image");
      }

      return result.data.imageUrl;
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
      return "";
    } finally {
      setUploading(false);
    }
  };

  // Clear image selection
  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setProjectForm({ ...projectForm, imageUrl: "" });
  };

  // Open reply modal
  const openReplyModal = (message: Message) => {
    setSelectedMessage(message);
    setReplyForm({
      subject: `Re: ${message.subject}`,
      message: `Dear ${message.name},\n\nThank you for contacting me regarding "${message.subject}".\n\n[Your reply here]\n\nBest regards,\nCharles Adu Tetteh`,
    });
    setReplyModalOpen(true);
  };

  // Send reply
  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;

    setLoading(true);
    try {
      // Send email via the API
      const emailResponse = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedMessage.email,
          subject: replyForm.subject,
          message: replyForm.message,
          messageId: selectedMessage.id,
        }),
      });

      const emailResult = await emailResponse.json();

      if (!emailResult.success) {
        throw new Error(emailResult.message || "Failed to send email");
      }

      // Mark message as replied
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "markAsReplied",
          id: selectedMessage.id,
          data: {
            replyNotes: `Email sent via admin dashboard at ${new Date().toLocaleString()}`,
          },
        }),
      });

      if (response.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === selectedMessage.id
              ? {
                  ...msg,
                  isReplied: true,
                  replyNotes: `Email sent via admin dashboard at ${new Date().toLocaleString()}`,
                }
              : msg
          )
        );
        setReplyModalOpen(false);
        setSelectedMessage(null);
        setReplyForm({ subject: "", message: "" });

        // Show different messages based on email mode
        const isRealEmail = emailResult.data?.mode !== "mock";
        toast({
          title: isRealEmail ? "Reply sent" : "Reply sent (Mock Mode)",
          description: isRealEmail
            ? "Your reply has been sent successfully via email."
            : "Email sent in mock mode. Configure email service in .env.local to send real emails.",
          variant: isRealEmail ? "default" : "destructive",
        });
      } else {
        throw new Error("Failed to update message status");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new project
  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image first if one is selected
      let finalImageUrl = projectForm.imageUrl;
      if (selectedImage && !projectForm.imageUrl) {
        finalImageUrl = await uploadImage();
        if (!finalImageUrl) {
          // If image upload failed and we don't have a URL, don't proceed
          return;
        }
      }

      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          data: {
            ...projectForm,
            imageUrl: finalImageUrl,
            technologies: projectForm.technologies
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t),
            budget: projectForm.budget || undefined,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setProjects((prev) => [result.data, ...prev]);
        setProjectModalOpen(false);

        // Reset form and image states
        setProjectForm({
          title: "",
          description: "",
          shortDescription: "",
          technologies: "",
          category: "WEB_DEVELOPMENT",
          status: "PLANNING",
          featured: false,
          githubUrl: "",
          liveUrl: "",
          imageUrl: "",
          clientName: "",
          budget: "",
          challenges: "",
          solutions: "",
          results: "",
        });
        clearImage();

        toast({
          title: "Project added",
          description: "The new project has been created successfully.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Open testimonial edit modal
  const openTestimonialModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setTestimonialModalOpen(true);
  };

  // Update testimonial
  const updateTestimonial = async (id: string, data: any) => {
    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id,
          data,
        }),
      });

      if (response.ok) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...data } : t))
        );
        setTestimonialModalOpen(false);
        setSelectedTestimonial(null);
        toast({
          title: "Testimonial updated",
          description: "The testimonial has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      });
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        messagesRes,
        requestsRes,
        projectsRes,
        testimonialsRes,
        emailConfigRes,
      ] = await Promise.all([
        fetch("/api/admin/dashboard").catch((e) => {
          console.error("Stats API failed:", e);
          return null;
        }),
        fetch("/api/admin/messages").catch((e) => {
          console.error("Messages API failed:", e);
          return null;
        }),
        fetch("/api/admin/service-requests").catch((e) => {
          console.error("Service requests API failed:", e);
          return null;
        }),
        fetch("/api/admin/projects").catch((e) => {
          console.error("Projects API failed:", e);
          return null;
        }),
        fetch("/api/admin/testimonials").catch((e) => {
          console.error("Testimonials API failed:", e);
          return null;
        }),
        fetch("/api/admin/email/test").catch((e) => {
          console.error("Email config check failed:", e);
          return null;
        }),
      ]);

      if (statsRes && statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(
          statsData.stats || {
            totalMessages: 0,
            unreadMessages: 0,
            totalRequests: 0,
            pendingRequests: 0,
            totalProjects: 0,
            activeProjects: 0,
            totalTestimonials: 0,
            pendingTestimonials: 0,
          }
        );
      } else {
        console.error("Stats API failed");
      }

      if (messagesRes && messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData.data?.messages || []);
      } else {
        console.error("Messages API failed");
        setMessages([]);
      }

      if (requestsRes && requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setServiceRequests(requestsData.data?.requests || []);
      } else {
        console.error("Service requests API failed");
        setServiceRequests([]);
      }

      if (projectsRes && projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.data?.projects || []);
      } else {
        console.error("Projects API failed");
        setProjects([]);
      }

      if (testimonialsRes && testimonialsRes.ok) {
        const testimonialsData = await testimonialsRes.json();
        setTestimonials(testimonialsData.data?.testimonials || []);
      } else {
        console.error("Testimonials API failed");
        setTestimonials([]);
      }

      // Check email configuration
      if (emailConfigRes && emailConfigRes.ok) {
        const emailConfigData = await emailConfigRes.json();
        setEmailConfigStatus({
          configured: emailConfigData.config?.emailConfigured || false,
          message: emailConfigData.message || "Unknown status",
        });
      } else {
        setEmailConfigStatus({
          configured: false,
          message: "Could not check email configuration",
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Set default empty arrays
      setMessages([]);
      setServiceRequests([]);
      setProjects([]);
      setTestimonials([]);

      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo authentication
    if (
      loginForm.email === "admin@charles.com" &&
      loginForm.password === "admin123"
    ) {
      setIsAuthenticated(true);
      fetchDashboardData();
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard!",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mark message as read
  const markMessageAsRead = async (messageId: string) => {
    try {
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAsRead", id: messageId }),
      });

      if (response.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
        );
        toast({
          title: "Message marked as read",
          description: "The message status has been updated.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    }
  };

  // Approve testimonial
  const approveTestimonial = async (testimonialId: string) => {
    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          id: testimonialId,
        }),
      });

      if (response.ok) {
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === testimonialId ? { ...t, isApproved: true } : t
          )
        );
        toast({
          title: "Testimonial approved",
          description: "The testimonial is now live on the website.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve testimonial",
        variant: "destructive",
      });
    }
  };

  // Reject/Delete testimonial
  const rejectTestimonial = async (testimonialId: string) => {
    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          id: testimonialId,
        }),
      });

      if (response.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== testimonialId));
        toast({
          title: "Testimonial rejected",
          description: "The testimonial has been removed.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject testimonial",
        variant: "destructive",
      });
    }
  };

  // Update service request status
  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateStatus",
          id: requestId,
          data: { status },
        }),
      });

      if (response.ok) {
        setServiceRequests((prev) =>
          prev.map((req) => (req.id === requestId ? { ...req, status } : req))
        );
        toast({
          title: "Request status updated",
          description: `Service request has been marked as ${status}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  // Reply to message
  const replyToMessage = async (messageId: string, message: Message) => {
    try {
      // Create a mailto link with pre-filled content
      const subject = `Re: ${message.subject}`;
      const body = `Dear ${message.name},\n\nThank you for contacting me regarding "${message.subject}".\n\n[Your reply here]\n\nBest regards,\nCharles Adu Tetteh`;
      const mailtoLink = `mailto:${message.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      // Open email client
      window.open(mailtoLink, "_blank");

      // Mark message as replied
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "markAsReplied",
          id: messageId,
          data: {
            replyNotes: "Email client opened for reply",
          },
        }),
      });

      if (response.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  isReplied: true,
                  replyNotes: "Email client opened for reply",
                }
              : msg
          )
        );
        toast({
          title: "Email client opened",
          description:
            "Your email client has been opened with a pre-filled reply.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open email client",
        variant: "destructive",
      });
    }
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">
                Admin Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="admin@charles.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="admin123"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Login
                </Button>
              </form>
              <p className="text-sm text-gray-400 mt-4 text-center">
                Demo credentials: admin@charles.com / admin123
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <Button
              onClick={() => setIsAuthenticated(false)}
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Email Configuration Status Banner */}
        {emailConfigStatus && !emailConfigStatus.configured && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <h3 className="text-yellow-400 font-medium">
                  Email Service Not Configured
                </h3>
              </div>
              <p className="text-yellow-300 text-sm mt-2">
                {emailConfigStatus.message}
              </p>
              <p className="text-yellow-200 text-sm mt-1">
                Email replies will run in mock mode. Configure email settings in
                .env.local to send real emails.
                <a
                  href="/EMAIL_SETUP.md"
                  target="_blank"
                  className="text-yellow-400 underline ml-1"
                >
                  View setup guide
                </a>
              </p>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Messages Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Messages</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.totalMessages}
                    </p>
                    <p className="text-purple-400 text-sm">
                      {stats.unreadMessages} unread
                    </p>
                  </div>
                  <MessageSquare className="text-purple-400" size={32} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service Requests Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Service Requests</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.totalRequests}
                    </p>
                    <p className="text-yellow-400 text-sm">
                      {stats.pendingRequests} pending
                    </p>
                  </div>
                  <Briefcase className="text-purple-400" size={32} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Projects Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Projects</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.totalProjects}
                    </p>
                    <p className="text-green-400 text-sm">
                      {stats.activeProjects} live
                    </p>
                  </div>
                  <BarChart3 className="text-purple-400" size={32} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Testimonials Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Testimonials</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.totalTestimonials}
                    </p>
                    <p className="text-orange-400 text-sm">
                      {stats.pendingTestimonials} pending
                    </p>
                  </div>
                  <Users className="text-purple-400" size={32} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800">
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-purple-600"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="data-[state=active]:bg-purple-600"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Messages{" "}
                {stats.unreadMessages > 0 && (
                  <Badge className="ml-2 bg-red-600">
                    {stats.unreadMessages}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="data-[state=active]:bg-purple-600"
              >
                <Briefcase className="w-4 h-4 mr-1" />
                Requests{" "}
                {stats.pendingRequests > 0 && (
                  <Badge className="ml-2 bg-yellow-600">
                    {stats.pendingRequests}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="data-[state=active]:bg-purple-600"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="testimonials"
                className="data-[state=active]:bg-purple-600"
              >
                <Users className="w-4 h-4 mr-1" />
                Testimonials{" "}
                {stats.pendingTestimonials > 0 && (
                  <Badge className="ml-2 bg-orange-600">
                    {stats.pendingTestimonials}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-6">
              <AnalyticsDashboard />
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="mt-6">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Contact Messages
                    <Badge
                      variant="secondary"
                      className="bg-purple-600/20 text-purple-300"
                    >
                      {stats.unreadMessages} unread
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center text-gray-400 py-8">
                        Loading messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        No messages found
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 rounded-lg border ${
                            message.isRead
                              ? "bg-slate-700/30 border-slate-600"
                              : "bg-purple-600/10 border-purple-500/30"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-white font-medium">
                                {message.name}
                              </h4>
                              {!message.isRead && (
                                <Badge className="bg-purple-600 text-white text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <span className="text-gray-400 text-sm">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">
                            {message.email}
                          </p>
                          <p className="text-white font-medium mb-2">
                            {message.subject}
                          </p>
                          <p className="text-gray-300 text-sm mb-3">
                            {message.message}
                          </p>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent"
                              onClick={() => markMessageAsRead(message.id)}
                            >
                              <Eye className="mr-2" size={14} />
                              {message.isRead ? "Read" : "Mark as Read"}
                            </Button>
                            <Button
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700"
                              onClick={() => openReplyModal(message)}
                            >
                              <Mail className="mr-2" size={14} />
                              Reply
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Service Requests Tab */}
            <TabsContent value="requests" className="mt-6">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Service Requests
                    <Badge
                      variant="secondary"
                      className="bg-purple-600/20 text-purple-300"
                    >
                      {stats.pendingRequests} pending
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center text-gray-400 py-8">
                        Loading service requests...
                      </div>
                    ) : serviceRequests.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        No service requests found
                      </div>
                    ) : (
                      serviceRequests.map((request) => (
                        <div
                          key={request.id}
                          className="p-4 rounded-lg border bg-slate-700/30 border-slate-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-white font-medium">
                                {request.clientName}
                              </h4>
                              <Badge
                                className={
                                  request.status === "pending"
                                    ? "bg-yellow-600 text-white"
                                    : request.status === "accepted"
                                    ? "bg-green-600 text-white"
                                    : request.status === "reviewed"
                                    ? "bg-blue-600 text-white"
                                    : "bg-red-600 text-white"
                                }
                              >
                                {request.status}
                              </Badge>
                            </div>
                            <span className="text-gray-400 text-sm">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-gray-400 text-sm">Email</p>
                              <p className="text-gray-300">
                                {request.clientEmail}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">
                                Project Type
                              </p>
                              <p className="text-gray-300">
                                {request.projectType}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Budget</p>
                              <p className="text-gray-300">{request.budget}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Timeline</p>
                              <p className="text-gray-300">
                                {request.timeline}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">
                            {request.projectDescription}
                          </p>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                updateRequestStatus(request.id, "accepted")
                              }
                            >
                              <Check className="mr-2" size={14} />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() =>
                                updateRequestStatus(request.id, "reviewed")
                              }
                            >
                              <Eye className="mr-2" size={14} />
                              Mark Reviewed
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-transparent"
                              onClick={() =>
                                updateRequestStatus(request.id, "rejected")
                              }
                            >
                              <X className="mr-2" size={14} />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="mt-6">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Manage Projects
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => setProjectModalOpen(true)}
                    >
                      <Plus className="mr-2" size={16} />
                      Add Project
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                      <div className="col-span-full text-center text-gray-400 py-8">
                        Loading projects...
                      </div>
                    ) : projects.length === 0 ? (
                      <div className="col-span-full text-center text-gray-400 py-8">
                        No projects found
                      </div>
                    ) : (
                      projects.map((project) => (
                        <Card
                          key={project.id}
                          className="bg-slate-700/30 border-slate-600"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">
                                {project.title}
                              </h4>
                              <Badge
                                className={
                                  project.status === "live"
                                    ? "bg-green-600"
                                    : project.status === "development"
                                    ? "bg-yellow-600"
                                    : "bg-gray-600"
                                }
                              >
                                {project.status}
                              </Badge>
                            </div>
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent"
                              >
                                <Edit className="mr-2" size={14} />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="mt-6">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Manage Testimonials
                    <Badge
                      variant="secondary"
                      className="bg-purple-600/20 text-purple-300"
                    >
                      {stats.pendingTestimonials} pending approval
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center text-gray-400 py-8">
                        Loading testimonials...
                      </div>
                    ) : testimonials.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        No testimonials found
                      </div>
                    ) : (
                      testimonials.map((testimonial) => (
                        <div
                          key={testimonial.id}
                          className={`p-4 rounded-lg border ${
                            testimonial.isApproved
                              ? "bg-slate-700/30 border-slate-600"
                              : "bg-orange-600/10 border-orange-500/30"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-white font-medium">
                                {testimonial.clientName}
                              </h4>
                              <div className="flex items-center">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="text-yellow-400 fill-current"
                                    size={14}
                                  />
                                ))}
                              </div>
                              {!testimonial.isApproved && (
                                <Badge className="bg-orange-600 text-white text-xs">
                                  Pending
                                </Badge>
                              )}
                            </div>
                            <span className="text-gray-400 text-sm">
                              {new Date(
                                testimonial.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">
                            {testimonial.clientTitle} at{" "}
                            {testimonial.clientCompany}
                          </p>
                          <p className="text-gray-300 text-sm mb-1">
                            Service: {testimonial.serviceType}
                          </p>
                          <p className="text-gray-300 text-sm mb-1">
                            Email: {testimonial.clientEmail}
                          </p>
                          <p className="text-gray-300 text-sm mb-3 italic">
                            "{testimonial.testimonial}"
                          </p>
                          <div className="flex space-x-2">
                            {!testimonial.isApproved && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() =>
                                    approveTestimonial(testimonial.id)
                                  }
                                >
                                  <Check className="mr-2" size={14} />
                                  Approve
                                </Button>{" "}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-transparent"
                                  onClick={() =>
                                    rejectTestimonial(testimonial.id)
                                  }
                                >
                                  <X className="mr-2" size={14} />
                                  Reject
                                </Button>
                              </>
                            )}
                            {testimonial.isApproved && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-600 text-gray-300 bg-transparent"
                                onClick={() =>
                                  openTestimonialModal(testimonial)
                                }
                              >
                                <Edit className="mr-2" size={14} />
                                Edit
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => rejectTestimonial(testimonial.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Reply Modal */}
        {replyModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 rounded-lg shadow-lg max-w-2xl w-full z-10 mx-4"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Reply to Message
                </h3>
                <form onSubmit={sendReply} className="space-y-4">
                  <div>
                    <Label htmlFor="replySubject" className="text-white">
                      Subject
                    </Label>
                    <Input
                      id="replySubject"
                      value={replyForm.subject}
                      onChange={(e) =>
                        setReplyForm({ ...replyForm, subject: e.target.value })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="replyMessage" className="text-white">
                      Message
                    </Label>
                    <Textarea
                      id="replyMessage"
                      value={replyForm.message}
                      onChange={(e) =>
                        setReplyForm({ ...replyForm, message: e.target.value })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={8}
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Reply"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-600 text-gray-300"
                      onClick={() => {
                        setReplyModalOpen(false);
                        setSelectedMessage(null);
                        setReplyForm({ subject: "", message: "" });
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Project Modal */}
        {projectModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 rounded-lg shadow-lg max-w-2xl w-full z-10 mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Add New Project
                </h3>
                <form onSubmit={addProject} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={projectForm.title}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          title: e.target.value,
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Project Title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-white">
                      Short Description
                    </Label>
                    <Input
                      id="description"
                      value={projectForm.description}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          description: e.target.value,
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Brief project description"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shortDescription" className="text-white">
                      Detailed Description
                    </Label>
                    <Textarea
                      id="shortDescription"
                      value={projectForm.shortDescription}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          shortDescription: e.target.value,
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Detailed project description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="technologies" className="text-white">
                      Technologies (comma-separated)
                    </Label>
                    <Input
                      id="technologies"
                      value={projectForm.technologies}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          technologies: e.target.value,
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="React, Next.js, TypeScript, etc."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-white">
                        Category
                      </Label>
                      <Select
                        value={projectForm.category}
                        onValueChange={(value) =>
                          setProjectForm({ ...projectForm, category: value })
                        }
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WEB_DEVELOPMENT">
                            Web Development
                          </SelectItem>
                          <SelectItem value="MOBILE_DEVELOPMENT">
                            Mobile Development
                          </SelectItem>
                          <SelectItem value="ECOMMERCE">E-commerce</SelectItem>
                          <SelectItem value="PORTFOLIO">Portfolio</SelectItem>
                          <SelectItem value="SAAS">SaaS</SelectItem>
                          <SelectItem value="API_DEVELOPMENT">
                            API Development
                          </SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-white">
                        Status
                      </Label>
                      <Select
                        value={projectForm.status}
                        onValueChange={(value) =>
                          setProjectForm({ ...projectForm, status: value })
                        }
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PLANNING">Planning</SelectItem>
                          <SelectItem value="DEVELOPMENT">
                            Development
                          </SelectItem>
                          <SelectItem value="TESTING">Testing</SelectItem>
                          <SelectItem value="DEPLOYED">Deployed</SelectItem>
                          <SelectItem value="MAINTENANCE">
                            Maintenance
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <Label className="text-white">Project Image</Label>
                    <div className="space-y-4">
                      {/* Image Preview */}
                      {(imagePreview || projectForm.imageUrl) && (
                        <div className="relative">
                          <img
                            src={imagePreview || projectForm.imageUrl}
                            alt="Project preview"
                            className="w-full h-48 object-cover rounded-lg border border-slate-600"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2"
                            onClick={clearImage}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      )}

                      {/* Upload Controls */}
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <input
                            type="file"
                            id="projectImage"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent"
                            onClick={() =>
                              document.getElementById("projectImage")?.click()
                            }
                            disabled={uploading}
                          >
                            <Upload className="mr-2" size={16} />
                            {uploading ? "Uploading..." : "Choose Image"}
                          </Button>
                        </div>
                      </div>

                      {/* URL Input (alternative) */}
                      <div className="text-center text-gray-400 text-sm">
                        or
                      </div>
                      <div>
                        <Input
                          id="imageUrl"
                          value={projectForm.imageUrl}
                          onChange={(e) => {
                            setProjectForm({
                              ...projectForm,
                              imageUrl: e.target.value,
                            });
                            // Clear file selection if URL is entered
                            if (e.target.value) {
                              setSelectedImage(null);
                              setImagePreview("");
                            }
                          }}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Or paste image URL here..."
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="githubUrl" className="text-white">
                        GitHub URL
                      </Label>
                      <Input
                        id="githubUrl"
                        value={projectForm.githubUrl}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            githubUrl: e.target.value,
                          })
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="liveUrl" className="text-white">
                        Live URL
                      </Label>
                      <Input
                        id="liveUrl"
                        value={projectForm.liveUrl}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            liveUrl: e.target.value,
                          })
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="https://project.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName" className="text-white">
                        Client Name
                      </Label>
                      <Input
                        id="clientName"
                        value={projectForm.clientName}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            clientName: e.target.value,
                          })
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Client or Company Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="budget" className="text-white">
                        Budget
                      </Label>
                      <Input
                        id="budget"
                        value={projectForm.budget}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            budget: e.target.value,
                          })
                        }
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="$5,000 - $10,000"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="challenges" className="text-white">
                      Challenges
                    </Label>
                    <Textarea
                      id="challenges"
                      value={projectForm.challenges}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          challenges: e.target.value,
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="What challenges did you face?"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="solutions" className="text-white">
                      Solutions
                    </Label>
                    <Textarea
                      id="solutions"
                      value={projectForm.solutions}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          solutions: e.target.value,
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="How did you solve them?"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="results" className="text-white">
                      Results
                    </Label>
                    <Textarea
                      id="results"
                      value={projectForm.results}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          results: e.target.value,
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="What were the outcomes/results?"
                      rows={2}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Add Project
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-600 text-gray-300"
                      onClick={() => setProjectModalOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Testimonial Edit Modal */}
        {testimonialModalOpen && selectedTestimonial && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 rounded-lg shadow-lg max-w-2xl w-full z-10 mx-4"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Edit Testimonial
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-white font-medium">
                      Client: {selectedTestimonial.clientName}
                    </p>
                    <p className="text-gray-400">
                      Email: {selectedTestimonial.clientEmail}
                    </p>
                    <p className="text-gray-400">
                      Company: {selectedTestimonial.clientCompany}
                    </p>
                    <p className="text-gray-400">
                      Rating: {selectedTestimonial.rating}/5
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-2">Testimonial:</p>
                    <p className="text-gray-300 italic">
                      "{selectedTestimonial.testimonial}"
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() =>
                        updateTestimonial(selectedTestimonial.id, {
                          featured: !selectedTestimonial.featured,
                        })
                      }
                      className={
                        selectedTestimonial.featured
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-gray-600 hover:bg-gray-700"
                      }
                    >
                      {selectedTestimonial.featured
                        ? "Remove from Featured"
                        : "Make Featured"}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-gray-300"
                      onClick={() => setTestimonialModalOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
