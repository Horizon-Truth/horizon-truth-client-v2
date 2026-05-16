import { motion } from "framer-motion";
import { Linkedin, Twitter, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AbduljPhoto, AbdurehmanA, AbdurezakIsak, AjaibMoh, BilkesEl, Getahun, MohammedHas1, MohammedIb, MohammedMum, RemlaHa } from "@/assets/photos";
import { Button } from "@/shared/components/ui/button";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  description: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    other?: string;
  };
}

const teamData: TeamMember[] = [
  {
    id: 1,
    name: "Abdurahman Abrar",
    role: "Co-PI, AI & Data Science Lead",
    image: AbdurehmanA,
    description: "Leads AI and data science strategy, oversees model development and experimentation, and guides project planning in alignment with research goals."
  },
  {
    id: 2,
    name: "Muhammed Hassen",
    role: "Co-PI, Data & Web Engineering Lead",
    image: MohammedHas1,
    description: "Back-end developer responsible for data and backend architecture, database and pipeline design, and ensuring scalability and reliability of infrastructure."
  },
  {
    id: 5,
    name: "Abduljebar Sani",
    role: "CO-PI, Technical Lead",
    image: AbduljPhoto,
    description: "Leads the overall technical direction of the project, manages the development team, and ensures the technical quality of the product."
  },
  {
    id: 3,
    name: "Abdurezak Yisak",
    role: "Co-PI, UX/UI Designer",
    image: AbdurezakIsak,
    description: "UX/UI designer focused on user-friendly interfaces, inclusive design practices, and collaboration with engineers to ensure accessibility and usability."
  },
  {
    id: 4,
    name: "Mohammed Ibrahim",
    role: "Co-PI & Lead Content Developer",
    image: MohammedIb,
    description: "Develops educational narratives and scenarios with a focus on cultural relevance and pedagogy. Oversees content review and improvement."
  },
  {
    id: 6,
    name: "Ajaib Mohammed",
    role: "DevOps Manager",
    image: AjaibMoh,
    description: "Manages CI/CD pipelines, monitors system performance, ensures infrastructure scalability, and oversees cloud infrastructure and security."
  },
  {
    id: 7,
    name: "Bilkes Elias",
    role: "AI & Machine Learning Expert",
    image: BilkesEl,
    description: "Develops and fine-tunes machine learning models, performs data processing, and supports AI integration within the product platform."
  },
  {
    id: 8,
    name: "Dr. Muhammed Mumtaz",
    role: "ICT Consultant",
    image: MohammedMum,
    description: "Director of ICT at Jimma University, Provides strategic ICT guidance, supports quality assurance and code review, and offers technical advice across the stack."
  },
  {
    id: 9,
    name: "Remela Habib",