"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ExternalLink,
  Github,
  Search,
  Filter,
  Globe,
  Smartphone,
  Code,
  Database,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { projects } from "@/data/projects";

export function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { id: "all", label: "All Projects", icon: Filter },
    { id: "frontend", label: "Frontend", icon: Code },
    { id: "backend", label: "Backend", icon: Database },
    { id: "fullstack", label: "Full Stack", icon: Globe },
    { id: "web", label: "Web Apps", icon: Globe },
    { id: "mobile", label: "Mobile Apps", icon: Smartphone },
    { id: "live", label: "Live Projects", icon: Eye },
  ];

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (activeFilter !== "all") {
      if (activeFilter === "live") {
        filtered = filtered.filter((project) => project.status === "live");
      } else {
        filtered = filtered.filter(
          (project) =>
            project.category === activeFilter || project.type === activeFilter
        );
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    return filtered;
  }, [activeFilter, searchQuery, projects]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-500/80";
      case "development":
        return "bg-yellow-500/80";
      default:
        return "bg-gray-500/80";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "Live";
      case "development":
        return "In Development";
      default:
        return "Completed";
    }
  };

  return (
    <section
      id="projects"
      className="py-16 sm:py-20 bg-gradient-to-b from-slate-900/50 to-slate-950/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-playfair">
            Featured Projects
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-xl sm:max-w-2xl mx-auto font-inter font-light">
            A showcase of enterprise solutions and applications that have made a
            real impact
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mb-10 sm:mb-12"
        >
          <div className="relative max-w-md mx-auto mb-8">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
              size={20}
            />
            <Input
              type="text"
              placeholder="Search projects, technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-700/50 text-white placeholder-gray-300 focus:ring-purple-400 focus:border-purple-400 font-inter font-light text-sm sm:text-base rounded-lg"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {filters.map((filter, index) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full font-inter font-medium text-sm sm:text-base transition-all duration-300 ${
                  activeFilter === filter.id
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                    : "bg-slate-900/50 text-gray-200 border border-slate-700/50 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <filter.icon size={16} />
                <span>{filter.label}</span>
              </motion.button>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-300 font-inter font-light text-sm sm:text-base">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              layout
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="relative group"
            >
              <Card className="bg-slate-900/30 border border-slate-700/50 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-xl">
                {/* Image with Parallax Effect */}
                <div className="relative overflow-hidden h-48">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                  {/* Status and Year Badges */}
                  <motion.div
                    className="absolute top-4 left-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                  >
                    <Badge
                      className={`${getStatusColor(
                        project.status
                      )} text-white backdrop-blur-sm font-inter font-medium text-xs`}
                    >
                      {getStatusText(project.status)}
                    </Badge>
                  </motion.div>
                  <motion.div
                    className="absolute top-4 right-4"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                  >
                    <Badge className="bg-purple-600/80 text-white backdrop-blur-sm font-inter font-medium text-xs">
                      {project.year}
                    </Badge>
                  </motion.div>
                  {/* Type Icon */}
                  <motion.div
                    className="absolute bottom-4 left-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
                  >
                    {project.type === "web" && (
                      <Globe className="text-white" size={16} />
                    )}
                    {project.type === "mobile" && (
                      <Smartphone className="text-white" size={16} />
                    )}
                  </motion.div>
                </div>

                {/* Content with Hover Overlay */}
                <CardContent className="p-5 sm:p-6 relative">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-200 font-playfair transition-colors duration-300">
                      {project.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`ml-2 font-inter font-medium text-xs sm:text-sm ${
                        project.category === "frontend"
                          ? "border-blue-400 text-blue-300"
                          : project.category === "backend"
                          ? "border-green-400 text-green-300"
                          : "border-purple-400 text-purple-300"
                      }`}
                    >
                      {project.category}
                    </Badge>
                  </div>

                  <p className="text-gray-200 mb-4 line-clamp-2 leading-relaxed font-inter font-light text-sm sm:text-base">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-purple-600/20 text-purple-200 border border-purple-500/30 font-inter font-medium text-xs sm:text-sm"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-600/20 text-purple-200 border border-purple-500/30 font-inter font-medium text-xs sm:text-sm"
                      >
                        +{project.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Hover Overlay Buttons */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/98 to-transparent flex items-center justify-center p-2 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex gap-3 w-full">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-purple-400 text-purple-200 hover:bg-purple-500/20 hover:text-white bg-slate-900/50 backdrop-blur-sm font-inter font-medium text-sm rounded-lg transition-all duration-300 shadow-lg"
                            aria-label={`Learn more about ${project.title}`}
                          >
                            <Eye className="mr-2" size={14} />
                            Learn More
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900/95 border-slate-700/50 backdrop-blur-md rounded-lg">
                          <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl text-white font-playfair flex items-center justify-between">
                              {project.title}
                              <Badge
                                className={`${getStatusColor(
                                  project.status
                                )} text-white font-inter font-medium text-sm`}
                              >
                                {getStatusText(project.status)}
                              </Badge>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <Image
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              width={800}
                              height={400}
                              className="w-full h-64 object-cover rounded-lg"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-lg font-semibold text-white font-playfair mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                                    Problem
                                  </h4>
                                  <p className="text-gray-200 font-inter font-light text-sm sm:text-base leading-relaxed">
                                    {project.problem}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-white font-playfair mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                    Solution
                                  </h4>
                                  <p className="text-gray-200 font-inter font-light text-sm sm:text-base leading-relaxed">
                                    {project.solution}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-lg font-semibold text-white font-playfair mb-3 flex items-center">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                    Key Features
                                  </h4>
                                  <ul className="text-gray-200 font-inter font-light text-sm sm:text-base space-y-2">
                                    {project.features.map((feature, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-center"
                                      >
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></span>
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-white font-playfair mb-3 flex items-center">
                                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                                    Technologies
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech) => (
                                      <Badge
                                        key={tech}
                                        className="bg-purple-600/20 text-purple-200 border border-purple-500/30 font-inter font-medium text-xs sm:text-sm"
                                      >
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-700/50">
                              <Button
                                asChild
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex-1 font-inter font-medium text-sm rounded-lg"
                              >
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`View ${project.title} code on GitHub`}
                                >
                                  <Github className="mr-2" size={16} />
                                  View Code
                                </a>
                              </Button>
                              {project.status === "live" && (
                                <Button
                                  variant="outline"
                                  asChild
                                  className="border-purple-400 text-purple-200 hover:bg-purple-500/20 hover:text-white bg-transparent flex-1 font-inter font-medium text-sm rounded-lg"
                                >
                                  <a
                                    href={project.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`View live demo of ${project.title}`}
                                  >
                                    <ExternalLink className="mr-2" size={16} />
                                    Live Demo
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-gray-200 hover:text-white hover:bg-purple-500/20 font-inter font-medium text-sm rounded-lg bg-slate-900/50 backdrop-blur-sm shadow-lg"
                        aria-label={`View ${project.title} code on GitHub`}
                      >
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github size={16} />
                        </a>
                      </Button>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <p className="text-gray-200 font-inter font-light text-base sm:text-lg">
              No projects found matching your criteria.
            </p>
            <Button
              onClick={() => {
                setActiveFilter("all");
                setSearchQuery("");
              }}
              variant="outline"
              className="mt-4 border-purple-400 text-purple-200 hover:bg-purple-500/20 hover:text-white bg-transparent font-inter font-medium text-sm sm:text-base rounded-lg"
              aria-label="Clear project filters"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
