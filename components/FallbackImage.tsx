// components/ui/FallbackImage.tsx
"use client"

import Image, { ImageProps } from "next/image"
import { useState } from "react"

export default function FallbackImage(props: ImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-100 text-center p-4 rounded-md">
        <p className="text-gray-600 text-sm">Image failed to load.</p>
      </div>
    )
  }

  return <Image {...props} onError={() => setError(true)} />
}

// components/ui/card.tsx
import { cn } from "@/lib/utils"
import React from "react"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-white rounded-xl shadow", className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />
}

// components/ui/button.tsx
import { cn } from "@/lib/utils"
import React from "react"
import Link from "next/link"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "outline" | "solid"
  size?: "lg" | "md" | "sm"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, asChild = false, variant = "solid", size = "md", ...props }, ref) => {
    const baseClass =
      variant === "outline"
        ? "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
        : "bg-blue-600 text-white hover:bg-blue-700"

    const sizeClass =
      size === "lg"
        ? "px-8 py-4 text-lg"
        : size === "sm"
        ? "px-3 py-2 text-sm"
        : "px-4 py-2 text-base"

    const Component = asChild ? Link : "button"

    return (
      <Component
        className={cn(
          "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
          baseClass,
          sizeClass,
          className
        )}
        ref={ref}
        {...props as any}>
        {children}
      </Component>
    )
  }
)

Button.displayName = "Button"

// components/ui/badge.tsx
import { cn } from "@/lib/utils"
import React from "react"

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-block text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-gray-100 text-gray-800",
        className
      )}
      {...props}
    />
  )
}

// lib/utils.ts
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

// tsconfig.json (relevant part)
// Add this if missing
// "baseUrl": ".",
// "paths": {
//   "@/*": ["./*"]
// }
