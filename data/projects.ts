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
    image: "/placeholder.svg?height=300&width=500",
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
    github: "https://github.com",
    live: "https://example.com",
    year: "2023",
  },
  {
    id: 2,
    title: "GBC Palm",
    description: "React Native mobile app for streaming GBC's TV channels with AWS CloudFront integration",
    image: "/placeholder.svg?height=300&width=500",
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
    github: "https://github.com",
    live: "https://example.com",
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
    github: "https://github.com",
    live: "https://example.com",
    year: "2025",
  },
  {
    id: 4,
    title: "Electoral Commission Training Portal",
    description: "Frontend web application for training electoral officials with interactive modules",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    category: "frontend",
    type: "web",
    status: "live",
    motivation: "Need for standardized training platform for electoral officials",
    problem:
      "Electoral Commission needed a centralized platform to train 200+ field officials efficiently and consistently.",
    solution:
      "Developed an interactive training portal with modules, quizzes, and progress tracking, achieving 100% completion rates.",
    features: ["Interactive training modules", "Progress tracking", "Quiz system", "Certificate generation"],
    github: "https://github.com",
    live: "https://example.com",
    year: "2020",
  },
  {
    id: 5,
    title: "Statistical Data API",
    description: "Backend API system for managing census data collection and processing",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Node.js", "PostgreSQL", "Express", "JWT", "Docker"],
    category: "backend",
    type: "web",
    status: "live",
    motivation: "Efficient data collection system for Ghana Statistical Service",
    problem: "Manual data collection processes were slow and error-prone, affecting census accuracy and timeline.",
    solution:
      "Built a robust API system with real-time data validation and processing, reducing processing time by 15%.",
    features: ["Real-time data validation", "Automated processing", "Secure authentication", "Data analytics"],
    github: "https://github.com",
    live: "https://example.com",
    year: "2021",
  },
  {
    id: 6,
    title: "Palace School Mobile App",
    description: "Mobile application for school management and student communication",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["React Native", "Firebase", "TypeScript", "Push Notifications"],
    category: "frontend",
    type: "mobile",
    status: "development",
    motivation: "Improving communication between school, students, and parents",
    problem: "School needed better communication channels and digital tools for student management.",
    solution: "Created a mobile app with announcements, grade tracking, and parent-teacher communication features.",
    features: ["Student grade tracking", "Push notifications", "Parent communication", "Event calendar"],
    github: "https://github.com",
    live: "https://example.com",
    year: "2019",
  },
]
