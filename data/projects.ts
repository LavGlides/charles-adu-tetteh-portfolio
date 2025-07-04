export interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  category: "frontend" | "backend" | "fullstack"
  type: "web" | "mobile"
  status: "live" | "development" | "completed"
  motivation: string
  problem: string
  solution: string
  features: string[]
  github: string
  live: string
  year: string
}

export const projects: Project[] = [
  {
    id: 1,
    title: "GBC Asset Management",
    description: "Full-stack web application for managing GBC's assets across 31 transmitter sites and 7 TV channels",
    image: "/gbcasset",
    technologies: ["React", "Next.js", "AWS DynamoDB", "CloudFormation", "TypeScript"],
    category: "fullstack",
    type: "web",
    status: "live",
    motivation: "Need for efficient asset tracking and maintenance management at Ghana Broadcasting Corporation",
    problem:
      "GBC struggled with manual asset tracking across multiple sites, leading to inefficient maintenance scheduling and resource allocation.",
    solution:
      "Developed a comprehensive web-based system that automated asset tracking, generated reports, and streamlined maintenance workflows, improving operational efficiency by 25%.",
    features: [
      "Asset tracking across 31 sites",
      "Automated report generation",
      "Maintenance scheduling",
      "Real-time dashboard",
    ],
    github: "https://github.com/LavGlides/asset-management",
    live: "https://asset-management-orcin.vercel.app/login",
    year: "2023",
  },
  {
    id: 2,
    title: "GBC Palm",
    description: "React Native mobile app for streaming GBC's TV channels with AWS CloudFront integration",
    image: "/gbcpalm.png",
    technologies: ["React Native", "AWS CloudFront", "Node.js", "Real-time APIs", "TypeScript"],
    category: "fullstack",
    type: "mobile",
    status: "live",
    motivation: "Increasing demand for mobile streaming of local Ghanaian content",
    problem:
      "GBC needed a mobile platform to reach younger audiences and provide on-demand access to their content including GTV, GTV Sports+, and GBC News.",
    solution:
      "Built a cross-platform mobile app with low-latency streaming, user authentication, and real-time content delivery, increasing user engagement by 20%.",
    features: ["Multi-channel streaming", "Low-latency delivery", "User authentication", "Cross-platform support"],
    github: "https://github.com/LavGlides/gbcmobileweb",
    live: "https://gbcmobileweb.vercel.app/",
    year: "2024",
  },
  {
    id: 3,
    title: "Market Ghana",
    description: "Full-stack marketplace platform for Ghanaian shops with integrated payment systems",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Next.js", "React", "AWS DynamoDB", "CodePipeline", "Stripe API"],
    category: "fullstack",
    type: "web",
    status: "development",
    motivation: "Supporting local Ghanaian businesses to establish online presence",
    problem:
      "Many Ghanaian shops lacked online presence and e-commerce capabilities, limiting their reach and growth potential.",
    solution:
      "Created a comprehensive marketplace platform with search functionality, payment integration, and vendor management, targeting 100+ vendors by Q4 2025.",
    features: ["Multi-vendor support", "Integrated payments", "Search & filtering", "Vendor dashboard"],
    github: "#",
    live: "#",
    year: "2025",
  },
]
