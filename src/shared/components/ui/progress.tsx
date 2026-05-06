import * as React from "react"
import { cn } from "@/shared/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number
    indicatorClassName?: string