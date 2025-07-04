"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
} from "lucide-react"
import { messages, serviceRequests } from "@/data/admin-data"
import { projects } from "@/data/projects"
import { testimonials } from "@/data/testimonials"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const { toast } = useToast()

  // Mock data with state management
  const [adminMessages, setAdminMessages] = useState(messages)
  const [adminServiceRequests, setAdminServiceRequests] = useState(serviceRequests)
  const [adminProjects, setAdminProjects] = useState(projects)
  const [adminTestimonials, setAdminTestimonials] = useState(testimonials)

  const stats = {
    totalMessages: adminMessages.length,
    unreadMessages: adminMessages.filter((m) => !m.read).length,
    serviceRequests: adminServiceRequests.length,
    pendingRequests: adminServiceRequests.filter((r) => r.status === "pending").length,
    totalProjects: adminProjects.length,
    liveProjects: adminProjects.filter((p) => p.status === "live").length,
    totalTestimonials: adminTestimonials.length,
    pendingTestimonials: adminTestimonials.filter((t) => !t.approved).length,
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginForm.email === "admin@charles.com" && loginForm.password === "admin123") {
      setIsAuthenticated(true)
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard!",
      })
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    }
  }

  const markMessageAsRead = (messageId: number) => {
    setAdminMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)))
    toast({
      title: "Message marked as read",
      description: "The message status has been updated.",
    })
  }

  const updateRequestStatus = (requestId: number, status: "pending" | "reviewed" | "accepted" | "rejected") => {
    setAdminServiceRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status } : req)))
    toast({
      title: "Request status updated",
      description: `Service request has been marked as ${status}.`,
    })
  }

  const approveTestimonial = (testimonialId: number) => {
    setAdminTestimonials((prev) => prev.map((test) => (test.id === testimonialId ? { ...test, approved: true } : test)))
    toast({
      title: "Testimonial approved",
      description: "The testimonial is now live on the website.",
    })
  }

  const rejectTestimonial = (testimonialId: number) => {
    setAdminTestimonials((prev) => prev.filter((test) => test.id !== testimonialId))
    toast({
      title: "Testimonial rejected",
      description: "The testimonial has been removed.",
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">Admin Login</CardTitle>
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
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
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
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="admin123"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  Login
                </Button>
              </form>
              <p className="text-sm text-gray-400 mt-4 text-center">Demo credentials: admin@charles.com / admin123</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
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

        {/* Enhanced Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Messages</p>
                    <p className="text-2xl font-bold text-white">{stats.totalMessages}</p>
                    <p className="text-purple-400 text-sm">{stats.unreadMessages} unread</p>
                  </div>
                  <MessageSquare className="text-purple-400" size={32} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Service Requests</p>
                    <p className="text-2xl font-bold text-white">{stats.serviceRequests}</p>
                    <p className="text-yellow-400 text-sm">{stats.pendingRequests} pending</p>
                  </div>
                  <Briefcase className="text-purple-400" size={32} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Projects</p>
                    <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
                    <p className="text-green-400 text-sm">{stats.liveProjects} live</p>
                  </div>
                  <BarChart3 className="text-purple-400" size={32} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Testimonials</p>
                    <p className="text-2xl font-bold text-white">{stats.totalTestimonials}</p>
                    <p className="text-orange-400 text-sm">{stats.pendingTestimonials} pending</p>
                  </div>
                  <Users className="text-purple-400" size={32} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Tabs defaultValue="messages" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="messages" className="data-[state=active]:bg-purple-600">
                Messages {stats.unreadMessages > 0 && <Badge className="ml-2 bg-red-600">{stats.unreadMessages}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="requests" className="data-[state=active]:bg-purple-600">
                Requests{" "}
                {stats.pendingRequests > 0 && <Badge className="ml-2 bg-yellow-600">{stats.pendingRequests}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-purple-600">
                Projects
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="data-[state=active]:bg-purple-600">
                Testimonials{" "}
                {stats.pendingTestimonials > 0 && (
                  <Badge className="ml-2 bg-orange-600">{stats.pendingTestimonials}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Messages Tab */}
            <TabsContent value="messages" className="mt-6">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Messages
                    <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                      {stats.unreadMessages} unread
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg border ${
                          message.read ? "bg-slate-700/30 border-slate-600" : "bg-purple-600/10 border-purple-500/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-white font-medium">{message.name}</h4>
                            {!message.read && <Badge className="bg-purple-600 text-white text-xs">New</Badge>}
                          </div>
                          <span className="text-gray-400 text-sm">{message.date}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{message.email}</p>
                        <p className="text-white font-medium mb-2">{message.subject}</p>
                        <p className="text-gray-300 text-sm mb-3">{message.message}</p>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent"
                              >
                                <Eye className="mr-2" size={14} />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 border-slate-600 max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-white">{message.subject}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-gray-400 text-sm">
                                    From: {message.name} ({message.email})
                                  </p>
                                  <p className="text-gray-400 text-sm">Date: {message.date}</p>
                                </div>
                                <div className="bg-slate-700/50 p-4 rounded-lg">
                                  <p className="text-gray-300">{message.message}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button className="bg-purple-600 hover:bg-purple-700">
                                    <Mail className="mr-2" size={16} />
                                    Reply
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="border-slate-600 text-gray-300 bg-transparent"
                                    onClick={() => markMessageAsRead(message.id)}
                                  >
                                    Mark as Read
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => {
                              setAdminMessages((prev) => prev.filter((m) => m.id !== message.id))
                              toast({ title: "Message deleted", description: "The message has been removed." })
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
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
                    <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                      {stats.pendingRequests} pending
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminServiceRequests.map((request) => (
                      <div key={request.id} className="p-4 rounded-lg border bg-slate-700/30 border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-white font-medium">{request.name}</h4>
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
                          <span className="text-gray-400 text-sm">{request.date}</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-gray-400 text-sm">Email</p>
                            <p className="text-gray-300">{request.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Project Type</p>
                            <p className="text-gray-300">{request.projectType}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Budget</p>
                            <p className="text-gray-300">{request.budget}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Timeline</p>
                            <p className="text-gray-300">{request.timeline}</p>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{request.description}</p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateRequestStatus(request.id, "accepted")}
                          >
                            <Check className="mr-2" size={14} />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => updateRequestStatus(request.id, "reviewed")}
                          >
                            <Eye className="mr-2" size={14} />
                            Mark Reviewed
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-transparent"
                            onClick={() => updateRequestStatus(request.id, "rejected")}
                          >
                            <X className="mr-2" size={14} />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <Plus className="mr-2" size={16} />
                          Add Project
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-600 max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-white">Add New Project</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-white">Project Title</Label>
                              <Input
                                className="bg-slate-700 border-slate-600 text-white"
                                placeholder="Enter project title"
                              />
                            </div>
                            <div>
                              <Label className="text-white">Year</Label>
                              <Input className="bg-slate-700 border-slate-600 text-white" placeholder="2024" />
                            </div>
                          </div>
                          <div>
                            <Label className="text-white">Description</Label>
                            <Textarea
                              className="bg-slate-700 border-slate-600 text-white"
                              placeholder="Project description"
                            />
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-white">Category</Label>
                              <Select>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                  <SelectItem value="frontend">Frontend</SelectItem>
                                  <SelectItem value="backend">Backend</SelectItem>
                                  <SelectItem value="fullstack">Full Stack</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-white">Type</Label>
                              <Select>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                  <SelectItem value="web">Web</SelectItem>
                                  <SelectItem value="mobile">Mobile</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-white">Status</Label>
                              <Select>
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-700 border-slate-600">
                                  <SelectItem value="live">Live</SelectItem>
                                  <SelectItem value="development">Development</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label className="text-white">Project Image</Label>
                            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                              <p className="text-gray-400">Click to upload or drag and drop</p>
                              <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                              Add Project
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="border-slate-600 text-gray-300 bg-transparent"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminProjects.map((project) => (
                      <Card key={project.id} className="bg-slate-700/30 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-medium">{project.title}</h4>
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
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{project.description}</p>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent"
                            >
                              <Edit className="mr-2" size={14} />
                              Edit
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
                    <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                      {stats.pendingTestimonials} pending approval
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminTestimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className={`p-4 rounded-lg border ${
                          testimonial.approved
                            ? "bg-slate-700/30 border-slate-600"
                            : "bg-orange-600/10 border-orange-500/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-white font-medium">{testimonial.name}</h4>
                            <div className="flex items-center">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="text-yellow-400 fill-current" size={14} />
                              ))}
                            </div>
                            {!testimonial.approved && (
                              <Badge className="bg-orange-600 text-white text-xs">Pending</Badge>
                            )}
                          </div>
                          <span className="text-gray-400 text-sm">{testimonial.submittedAt}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">
                          {testimonial.role} at {testimonial.company}
                        </p>
                        <p className="text-gray-300 text-sm mb-3 italic">"{testimonial.content}"</p>
                        <div className="flex space-x-2">
                          {!testimonial.approved && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => approveTestimonial(testimonial.id)}
                              >
                                <Check className="mr-2" size={14} />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-transparent"
                                onClick={() => rejectTestimonial(testimonial.id)}
                              >
                                <X className="mr-2" size={14} />
                                Reject
                              </Button>
                            </>
                          )}
                          {testimonial.approved && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-gray-300 bg-transparent"
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
