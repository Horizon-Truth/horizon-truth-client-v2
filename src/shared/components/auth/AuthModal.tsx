import { useState } from "react";
import { LoginForm } from "@/shared/components/auth/LoginForm";
import { RegisterForm } from "@/shared/components/auth/RegisterForm";
import { X } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;