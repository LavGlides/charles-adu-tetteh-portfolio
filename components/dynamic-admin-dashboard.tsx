"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart3,
  MessageSquare,
  Briefcase,
  Plus,
  Eye,
  Trash2,
  Users,
  Mail,
  Edit,
  Check,
  X,
  Upload,
  Star,
  Loader2,
  ExternalLink,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserAvatar } from "@/lib/image-utils";

interface DashboardStats {
  totalMessages: number;
  unreadMessages: number;
  totalRequests: number;
  pendingRequests: number;
  totalTestimonials: number;
  pendingTestimonials: number;
  totalProjects: number;
  activeProjects: number;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
  emailSent: boolean;
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
  priority: string;
  isRead: boolean;
  createdAt: string;
}

interface Testimonial {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  projectType: string;
  rating: number;
  content: string;
  approved: boolean;
  featured: boolean;
  clientImage?: string;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: string;
  status: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  createdAt: string;
}

export default function DynamicAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Fetch dashboard data
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard?action=stats");
      const result = await response.json();
      if (result.success) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchMessages = async (page = 1, isRead?: boolean) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        action: "messages",
        page: page.toString(),
        limit: "20",
      });
      if (isRead !== undefined) params.append("isRead", isRead.toString());

      const response = await fetch(`/api/admin/dashboard?${params}`);
      const result = await response.json();
      if (result.success) {
        setMessages(result.data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (page = 1, status?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        action: "requests",
        page: page.toString(),
        limit: "20",
      });
      if (status) params.append("status", status);

      const response = await fetch(`/api/admin/dashboard?${params}`);
      const result = await response.json();
      if (result.success) {
        setRequests(result.data.requests);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async (page = 1, approved?: boolean) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        action: "testimonials",
        page: page.toString(),
        limit: "20",
      });
      if (approved !== undefined)
        params.append("approved", approved.toString());

      const response = await fetch(`/api/admin/dashboard?${params}`);
      const result = await response.json();
      if (result.success) {
        setTestimonials(result.data.testimonials);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async (page = 1, status?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (status) params.append("status", status);

      const response = await fetch(`/api/admin/projects?${params}`);
      const result = await response.json();
      if (result.success) {
        setProjects(result.data.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update functions
  const markMessageAsRead = async (messageId: string) => {
    try {
      const response = await fetch("/api/admin/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark-message-read",
          id: messageId,
        }),
      });

      if (response.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
        );
        fetchStats(); // Refresh stats
        toast({ title: "Message marked as read" });
      }
    } catch (error) {
      toast({ title: "Failed to update message", variant: "destructive" });
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-request-status",
          id: requestId,
          data: { status },
        }),
      });

      if (response.ok) {
        setRequests((prev) =>
          prev.map((req) => (req.id === requestId ? { ...req, status } : req))
        );
        fetchStats();
        toast({ title: `Request status updated to ${status}` });
      }
    } catch (error) {
      toast({ title: "Failed to update request", variant: "destructive" });
    }
  };

  const approveTestimonial = async (testimonialId: string) => {
    try {
      const response = await fetch("/api/admin/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve-testimonial",
          id: testimonialId,
        }),
      });

      if (response.ok) {
        setTestimonials((prev) =>
          prev.map((test) =>
            test.id === testimonialId ? { ...test, approved: true } : test
          )
        );
        fetchStats();
        toast({ title: "Testimonial approved" });
      }
    } catch (error) {
      toast({ title: "Failed to approve testimonial", variant: "destructive" });
    }
  };

  const rejectTestimonial = async (testimonialId: string) => {
    try {
      const response = await fetch("/api/admin/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject-testimonial",
          id: testimonialId,
        }),
      });

      if (response.ok) {
        setTestimonials((prev) =>
          prev.filter((test) => test.id !== testimonialId)
        );
        fetchStats();
        toast({ title: "Testimonial rejected" });
      }
    } catch (error) {
      toast({ title: "Failed to reject testimonial", variant: "destructive" });
    }
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateStatus",
          id: projectId,
          data: { status },
        }),
      });

      if (response.ok) {
        setProjects((prev) =>
          prev.map((proj) =>
            proj.id === projectId ? { ...proj, status } : proj
          )
        );
        fetchStats();
        toast({ title: `Project status updated to ${status}` });
      }
    } catch (error) {
      toast({ title: "Failed to update project", variant: "destructive" });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      loginForm.email === "admin@charles.com" &&
      loginForm.password === "admin123"
    ) {
      setIsAuthenticated(true);
      fetchStats();
      fetchMessages();
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

  // Tab change handler
  useEffect(() => {
    if (!isAuthenticated) return;

    switch (activeTab) {
      case "messages":
        fetchMessages();
        break;
      case "requests":
        fetchRequests();
        break;
      case "testimonials":
        fetchTestimonials();
        break;
      case "projects":
        fetchProjects();
        break;
    }
  }, [activeTab, isAuthenticated]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-400">
                Manage your portfolio content and user interactions
              </p>
            </div>
            <Button
              onClick={() => setIsAuthenticated(false)}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Messages</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.totalMessages}
                      </p>
                      <p className="text-orange-400 text-sm">
                        {stats.unreadMessages} unread
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

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
                    <Briefcase className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Testimonials</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.totalTestimonials}
                      </p>
                      <p className="text-purple-400 text-sm">
                        {stats.pendingTestimonials} pending
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Projects</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.totalProjects}
                      </p>
                      <p className="text-green-400 text-sm">
                        {stats.activeProjects} active
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800 border-slate-600">
              <TabsTrigger value="overview" className="text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="messages" className="text-white">
                Messages
              </TabsTrigger>
              <TabsTrigger value="requests" className="text-white">
                Service Requests
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="text-white">
                Testimonials
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-white">
                Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <p className="text-gray-300">
                          {stats?.unreadMessages} new messages received
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <p className="text-gray-300">
                          {stats?.pendingRequests} service requests pending
                          review
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <p className="text-gray-300">
                          {stats?.pendingTestimonials} testimonials awaiting
                          approval
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        onClick={() => setActiveTab("messages")}
                        className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Review New Messages
                      </Button>
                      <Button
                        onClick={() => setActiveTab("requests")}
                        className="w-full justify-start bg-green-600 hover:bg-green-700"
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Process Service Requests
                      </Button>
                      <Button
                        onClick={() => setActiveTab("testimonials")}
                        className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Approve Testimonials
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  Contact Messages
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={() => fetchMessages(1, false)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white"
                  >
                    Unread Only
                  </Button>
                  <Button
                    onClick={() => fetchMessages(1)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white"
                  >
                    All Messages
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <Card
                      key={message.id}
                      className={`bg-slate-800/50 border-slate-600 ${
                        !message.isRead ? "border-l-4 border-l-blue-400" : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-white">
                                {message.name}
                              </h3>
                              <Badge
                                variant={
                                  message.isRead ? "secondary" : "default"
                                }
                              >
                                {message.isRead ? "Read" : "New"}
                              </Badge>
                              {message.emailSent && (
                                <Badge
                                  variant="outline"
                                  className="text-green-400"
                                >
                                  Email Sent
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mb-2">
                              {message.email} • {message.subject}
                            </p>
                            <p className="text-gray-300 mb-3">
                              {message.message}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!message.isRead && (
                              <Button
                                onClick={() => markMessageAsRead(message.id)}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              onClick={() =>
                                window.open(`mailto:${message.email}`)
                              }
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-white"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  Service Requests
                </h2>
                <Select onValueChange={(value) => fetchRequests(1, value)}>
                  <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600 text-white">
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <Card
                      key={request.id}
                      className="bg-slate-800/50 border-slate-600"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-white">
                                {request.clientName}
                              </h3>
                              <Badge
                                variant={
                                  request.status === "PENDING"
                                    ? "default"
                                    : request.status === "ACCEPTED"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {request.status}
                              </Badge>
                              <Badge variant="outline">
                                {request.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">
                              {request.clientEmail} • {request.projectType}
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-gray-500 text-xs">Budget</p>
                                <p className="text-gray-300">
                                  {request.budget}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">
                                  Timeline
                                </p>
                                <p className="text-gray-300">
                                  {request.timeline}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-300 mb-3">
                              {request.projectDescription}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(request.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Select
                              onValueChange={(value) =>
                                updateRequestStatus(request.id, value)
                              }
                            >
                              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="REVIEWED">
                                  Reviewed
                                </SelectItem>
                                <SelectItem value="ACCEPTED">
                                  Accepted
                                </SelectItem>
                                <SelectItem value="REJECTED">
                                  Rejected
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={() =>
                                window.open(`mailto:${request.clientEmail}`)
                              }
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-white"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  Testimonials
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={() => fetchTestimonials(1, false)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white"
                  >
                    Pending Only
                  </Button>
                  <Button
                    onClick={() => fetchTestimonials(1)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-white"
                  >
                    All Testimonials
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              ) : (
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <Card
                      key={testimonial.id}
                      className="bg-slate-800/50 border-slate-600"
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={getUserAvatar(
                                testimonial.email,
                                testimonial.clientImage
                              )}
                              alt={testimonial.name}
                            />
                            <AvatarFallback className="bg-purple-600 text-white">
                              {testimonial.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-white">
                                {testimonial.name}
                              </h3>
                              <Badge
                                variant={
                                  testimonial.approved ? "secondary" : "default"
                                }
                              >
                                {testimonial.approved ? "Approved" : "Pending"}
                              </Badge>
                              {testimonial.featured && (
                                <Badge
                                  variant="outline"
                                  className="text-yellow-400"
                                >
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mb-2">
                              {testimonial.role} at {testimonial.company}
                            </p>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < testimonial.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                              <span className="text-gray-400 text-sm ml-2">
                                {testimonial.rating}/5
                              </span>
                            </div>
                            <p className="text-gray-300 mb-3">
                              {testimonial.content}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {new Date(testimonial.createdAt).toLocaleString()}{" "}
                              • {testimonial.projectType}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!testimonial.approved && (
                              <>
                                <Button
                                  onClick={() =>
                                    approveTestimonial(testimonial.id)
                                  }
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    rejectTestimonial(testimonial.id)
                                  }
                                  size="sm"
                                  variant="destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Projects</h2>
                <div className="flex gap-2">
                  <Select onValueChange={(value) => fetchProjects(1, value)}>
                    <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 text-white">
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="PLANNING">Planning</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="LIVE">Live</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className="bg-slate-800/50 border-slate-600"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-white mb-1">
                              {project.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{project.status}</Badge>
                              <Badge variant="secondary">
                                {project.category}
                              </Badge>
                              {project.featured && (
                                <Badge
                                  variant="outline"
                                  className="text-yellow-400"
                                >
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Select
                            onValueChange={(value) =>
                              updateProjectStatus(project.id, value)
                            }
                          >
                            <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600 text-white">
                              <SelectItem value="PLANNING">Planning</SelectItem>
                              <SelectItem value="IN_PROGRESS">
                                In Progress
                              </SelectItem>
                              <SelectItem value="LIVE">Live</SelectItem>
                              <SelectItem value="COMPLETED">
                                Completed
                              </SelectItem>
                              <SelectItem value="ON_HOLD">On Hold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <p className="text-gray-300 mb-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.map((tech, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          {project.githubUrl && (
                            <Button
                              onClick={() => window.open(project.githubUrl)}
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-white"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              GitHub
                            </Button>
                          )}
                          {project.liveUrl && (
                            <Button
                              onClick={() => window.open(project.liveUrl)}
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-white"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Live
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-white ml-auto"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="text-gray-500 text-xs mt-3">
                          Created:{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
