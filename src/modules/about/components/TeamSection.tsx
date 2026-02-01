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