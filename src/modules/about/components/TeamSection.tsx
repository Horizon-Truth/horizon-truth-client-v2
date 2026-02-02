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