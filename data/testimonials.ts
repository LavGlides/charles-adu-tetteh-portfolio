export interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  image: string
  content: string
  rating: number
  approved: boolean
  submittedAt: string
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Kwame Asante",
    role: "Director of Technology, GBC",
    company: "Ghana Broadcasting Corporation",
    image: "/placeholder.svg?height=60&width=60",
    content:
      "Charles transformed our asset management system completely. His technical expertise and ability to understand our complex requirements resulted in a 25% improvement in operational efficiency. Outstanding work!",
    rating: 5,
    approved: true,
    submittedAt: "2024-01-10",
  },
  {
    id: 2,
    name: "Sarah Mensah",
    role: "Project Manager",
    company: "Ghana Statistical Service",
    image: "/placeholder.svg?height=60&width=60",
    content:
      "Working with Charles during the census operations was exceptional. He trained over 100 field officials with remarkable clarity and achieved 95% satisfaction rates. His technical support was invaluable.",
    rating: 5,
    approved: true,
    submittedAt: "2024-01-08",
  },
  {
    id: 3,
    name: "Michael Osei",
    role: "CEO",
    company: "Darestreet Financial Consult",
    image: "/placeholder.svg?height=60&width=60",
    content:
      "Charles built our client management system that streamlined operations for 20+ clients. His advisory on software procurement saved us 10% in costs. Highly recommend his expertise!",
    rating: 5,
    approved: true,
    submittedAt: "2024-01-05",
  },
  {
    id: 4,
    name: "Jennifer Appiah",
    role: "IT Coordinator",
    company: "Electoral Commission",
    image: "/placeholder.svg?height=60&width=60",
    content:
      "Charles trained 200+ field officials for national elections with zero errors. His ability to simplify complex IT concepts for non-technical staff is remarkable. Professional and reliable.",
    rating: 5,
    approved: true,
    submittedAt: "2024-01-03",
  },
  {
    id: 5,
    name: "Robert Boateng",
    role: "Principal",
    company: "Palace Senior High School",
    image: "/placeholder.svg?height=60&width=60",
    content:
      "Charles maintained 100% system uptime for our school networks and integrated technology into mathematics teaching effectively. His technical skills and teaching ability are exceptional.",
    rating: 5,
    approved: true,
    submittedAt: "2024-01-01",
  },
  {
    id: 6,
    name: "Grace Owusu",
    role: "Student Leader",
    company: "Garden City University",
    image: "/placeholder.svg?height=60&width=60",
    content:
      "As Publicity Officer, Charles increased our event attendance by 30% through innovative web-based promotional tools. His leadership and technical creativity made a significant impact.",
    rating: 5,
    approved: true,
    submittedAt: "2023-12-28",
  },
  {
    id: 7,
    name: "John Smith",
    role: "Startup Founder",
    company: "TechStart Ghana",
    image: "/placeholder.svg?height=60&width=60",
    content:
      "Charles helped us build our MVP in record time. His full-stack expertise and understanding of startup needs made him an invaluable partner. Highly recommended!",
    rating: 5,
    approved: false,
    submittedAt: "2024-01-20",
  },
]
