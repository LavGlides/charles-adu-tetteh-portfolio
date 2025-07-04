export interface Message {
  id: number
  name: string
  email: string
  subject: string
  message: string
  date: string
  read: boolean
}

export interface ServiceRequest {
  id: number
  name: string
  email: string
  projectType: string
  budget: string
  timeline: string
  description: string
  date: string
  status: "pending" | "reviewed" | "accepted" | "rejected"
}

export const messages: Message[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    subject: "Web Development Inquiry",
    message:
      "I'm interested in building a web application for my business. Could we schedule a call to discuss the requirements and timeline?",
    date: "2024-01-15",
    read: false,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    subject: "Collaboration Opportunity",
    message:
      "I'd like to discuss a potential collaboration on a React project for a fintech startup. The project involves building a dashboard for financial analytics.",
    date: "2024-01-14",
    read: true,
  },
  {
    id: 3,
    name: "David Wilson",
    email: "david@techcorp.com",
    subject: "AWS Cloud Migration",
    message:
      "Our company is looking to migrate our infrastructure to AWS. We heard about your expertise and would like to discuss a potential consulting engagement.",
    date: "2024-01-13",
    read: false,
  },
  {
    id: 4,
    name: "Maria Garcia",
    email: "maria@startup.io",
    subject: "Mobile App Development",
    message:
      "We need a React Native developer for our social media app. The project timeline is 3 months. Are you available for this engagement?",
    date: "2024-01-12",
    read: true,
  },
]

export const serviceRequests: ServiceRequest[] = [
  {
    id: 1,
    name: "Michael Brown",
    email: "michael@fooddelivery.com",
    projectType: "Mobile App",
    budget: "$10,000 - $25,000",
    timeline: "2-3 months",
    description:
      "Need a React Native app for food delivery service with real-time tracking, payment integration, and restaurant management features. The app should support both iOS and Android platforms.",
    date: "2024-01-15",
    status: "pending",
  },
  {
    id: 2,
    name: "Emily Davis",
    email: "emily@artisans.gh",
    projectType: "Web Application",
    budget: "$5,000 - $10,000",
    timeline: "1 month",
    description:
      "E-commerce platform for local artisans to sell their crafts online. Need features like product catalog, shopping cart, payment processing, and vendor dashboard.",
    date: "2024-01-13",
    status: "reviewed",
  },
  {
    id: 3,
    name: "James Thompson",
    email: "james@logistics.com",
    projectType: "Cloud Solution",
    budget: "$25,000 - $50,000",
    timeline: "3-6 months",
    description:
      "Complete AWS cloud infrastructure setup for logistics company including data warehousing, real-time analytics, and automated reporting systems.",
    date: "2024-01-11",
    status: "accepted",
  },
  {
    id: 4,
    name: "Lisa Chen",
    email: "lisa@edutech.org",
    projectType: "Training",
    budget: "$5,000 - $10,000",
    timeline: "1 month",
    description:
      "Technical training program for 50+ developers on modern React patterns, Next.js, and AWS deployment strategies. Need both online and in-person sessions.",
    date: "2024-01-10",
    status: "pending",
  },
]
