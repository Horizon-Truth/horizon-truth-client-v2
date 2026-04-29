import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/shared/lib/utils"

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (