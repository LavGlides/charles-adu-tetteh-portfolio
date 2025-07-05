"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Users,
  Star,
  FolderOpen,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  RefreshCw,
  Plus,
  Calendar,
  Globe,
  Mail,
  Phone,
  Building,
  User,
} from "lucide-react";

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

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  status: string;
  isRead: boolean;
  createdAt: string;
}

interface Testimonial {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  approved: boolean;
  featured: boolean;
  clientImage?: string;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  featured: boolean;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  createdAt: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, messagesRes, testimonialsRes, projectsRes] =
        await Promise.all([
          fetch("/api/admin/dashboard?action=stats"),
          fetch("/api/admin/messages?limit=50"),
          fetch("/api/admin/testimonials?limit=50"),
          fetch("/api/admin/projects?limit=50"),
        ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData.data.messages);
      }

      if (testimonialsRes.ok) {
        const testimonialsData = await testimonialsRes.json();
        setTestimonials(testimonialsData.data.testimonials);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.data.projects);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Message actions
  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateStatus", id, data: { status } }),
      });

      if (response.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id
              ? { ...msg, status, isRead: status !== "UNREAD" }
              : msg
          )
        );
        toast({ title: "Success", description: "Message status updated" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      });
    }
  };

  // Testimonial actions
  const updateTestimonialStatus = async (
    id: string,
    action: string,
    data?: any
  ) => {
    try {
      const response = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id, data }),
      });

      if (response.ok) {
        if (action === "approve") {
          setTestimonials((prev) =>
            prev.map((t) => (t.id === id ? { ...t, approved: true } : t))
          );
        } else if (action === "setFeatured") {
          setTestimonials((prev) =>
            prev.map((t) =>
              t.id === id ? { ...t, featured: data.featured } : t
            )
          );
        }
        toast({ title: "Success", description: "Testimonial updated" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      });
    }
  };

  // Project actions
  const saveProject = async (projectData: any) => {
    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: editingProject ? "update" : "create",
          id: editingProject?.id,
          data: projectData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (editingProject) {
          setProjects((prev) =>
            prev.map((p) => (p.id === editingProject.id ? result.data : p))
          );
        } else {
          setProjects((prev) => [result.data, ...prev]);
        }
        setIsProjectDialogOpen(false);
        setEditingProject(null);
        toast({ title: "Success", description: "Project saved" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const updateProjectStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateStatus", id, data: { status } }),
      });

      if (response.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        );
        toast({ title: "Success", description: "Project status updated" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive",
      });
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={loadDashboardData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Messages
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalMessages}
                  </div>
                  <p className="text-xs text-red-600">
                    {stats.unreadMessages} unread
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Service Requests
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalRequests}
                  </div>
                  <p className="text-xs text-orange-600">
                    {stats.pendingRequests} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Testimonials
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalTestimonials}
                  </div>
                  <p className="text-xs text-blue-600">
                    {stats.pendingTestimonials} pending approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Projects
                  </CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalProjects}
                  </div>
                  <p className="text-xs text-green-600">
                    {stats.activeProjects} live
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {messages.slice(0, 5).map((message) => (
                      <div
                        key={message.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{message.name}</p>
                          <p className="text-sm text-gray-600">
                            {message.subject}
                          </p>
                        </div>
                        <Badge
                          variant={message.isRead ? "secondary" : "destructive"}
                        >
                          {message.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Testimonials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testimonials.slice(0, 5).map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-gray-600">
                            {testimonial.company}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <Badge
                            variant={
                              testimonial.approved ? "default" : "secondary"
                            }
                          >
                            {testimonial.approved ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{message.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              {message.email}
                              {message.phone && (
                                <>
                                  <Phone className="h-4 w-4 ml-2" />
                                  {message.phone}
                                </>
                              )}
                              {message.company && (
                                <>
                                  <Building className="h-4 w-4 ml-2" />
                                  {message.company}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              message.isRead ? "secondary" : "destructive"
                            }
                          >
                            {message.status}
                          </Badge>
                          <Select
                            value={message.status}
                            onValueChange={(status) =>
                              updateMessageStatus(message.id, status)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UNREAD">Unread</SelectItem>
                              <SelectItem value="READ">Read</SelectItem>
                              <SelectItem value="REPLIED">Replied</SelectItem>
                              <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{message.subject}</p>
                        <p className="text-gray-700 mt-1">{message.message}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {testimonial.clientImage && (
                            <img
                              src={testimonial.clientImage}
                              alt={testimonial.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{testimonial.name}</p>
                            <p className="text-sm text-gray-600">
                              {testimonial.role} at {testimonial.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <Badge
                            variant={
                              testimonial.approved ? "default" : "secondary"
                            }
                          >
                            {testimonial.approved ? "Approved" : "Pending"}
                          </Badge>
                          {testimonial.featured && (
                            <Badge variant="outline">Featured</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700">{testimonial.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(testimonial.createdAt).toLocaleString()}
                        </span>
                        <div className="flex gap-2">
                          {!testimonial.approved && (
                            <Button
                              size="sm"
                              onClick={() =>
                                updateTestimonialStatus(
                                  testimonial.id,
                                  "approve"
                                )
                              }
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateTestimonialStatus(
                                testimonial.id,
                                "setFeatured",
                                {
                                  featured: !testimonial.featured,
                                }
                              )
                            }
                          >
                            <Star className="h-4 w-4 mr-1" />
                            {testimonial.featured ? "Unfeature" : "Feature"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <Dialog
                  open={isProjectDialogOpen}
                  onOpenChange={setIsProjectDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProject ? "Edit Project" : "Add New Project"}
                      </DialogTitle>
                    </DialogHeader>
                    <ProjectForm
                      project={editingProject}
                      onSave={saveProject}
                      onCancel={() => {
                        setIsProjectDialogOpen(false);
                        setEditingProject(null);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      {project.imageUrl && (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{project.category}</Badge>
                        <Badge
                          variant={
                            project.status === "LIVE"
                              ? "default"
                              : project.status === "IN_PROGRESS"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                        {project.featured && <Badge>Featured</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={project.status}
                          onValueChange={(status) =>
                            updateProjectStatus(project.id, status)
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              In Progress
                            </SelectItem>
                            <SelectItem value="LIVE">Live</SelectItem>
                            <SelectItem value="ARCHIVED">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingProject(project);
                            setIsProjectDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Project Form Component
function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project: Project | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    category: project?.category || "",
    status: project?.status || "DRAFT",
    featured: project?.featured || false,
    technologies: project?.technologies?.join(", ") || "",
    demoUrl: project?.demoUrl || "",
    githubUrl: project?.githubUrl || "",
    imageUrl: project?.imageUrl || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      technologies: formData.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
        <Input
          id="technologies"
          value={formData.technologies}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, technologies: e.target.value }))
          }
          placeholder="React, TypeScript, Next.js"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="demoUrl">Demo URL</Label>
          <Input
            id="demoUrl"
            type="url"
            value={formData.demoUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, demoUrl: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            type="url"
            value={formData.githubUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
          }
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, featured: e.target.checked }))
              }
            />
            Featured Project
          </label>
          <Select
            value={formData.status}
            onValueChange={(status) =>
              setFormData((prev) => ({ ...prev, status }))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="LIVE">Live</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{project ? "Update" : "Create"} Project</Button>
        </div>
      </div>
    </form>
  );
}
