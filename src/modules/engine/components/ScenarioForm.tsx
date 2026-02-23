import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { engineService, type Scenario } from "@/services/engine.service";
import { toast } from "sonner";
import { X, Lock } from "lucide-react";
import SceneEditor from "./SceneEditor";
import { useEffect, useState } from "react";
import { SUPPORTED_LANGUAGE_CODES, DEFAULT_LANGUAGE } from "@/shared/i18n/languages";
import { LanguageSelect } from "@/shared/i18n/components/LanguageSelect";
import { useLanguageStore } from "@/store/language.store";
import { useTranslation } from "@/shared/i18n/useTranslation";

const scenarioSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    type: z.enum(["SOCIAL_POST", "NEWS_STORY", "CHAT_CONVERSATION"]),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    language: z.enum(SUPPORTED_LANGUAGE_CODES as unknown as [string, ...string[]], {
        message: "Please select a language",
    }),
    isActive: z.boolean(),
    learningObjective: z.string().optional(),
    behavioralRisk: z.string().optional(),
    psychologicalTrigger: z.string().optional(),
    preventionLesson: z.string().optional(),
    theme: z.string().optional(),
    minimumScore: z.number().min(0).max(100),
    totalScenes: z.number().min(1),
    unlockScenarioId: z.string().nullable().optional(),
    campaignTag: z.string().optional(),
    gameLevelId: z.string().min(1, "Target Level is required"),
    order: z.number().min(0).optional(),