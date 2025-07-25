
import React, { useState } from 'react'
import { cn } from '@/libs/utils'
import { cva, type VariantProps } from "class-variance-authority";



const buttonVariants = cva([" border rounded-3xl"], {
  variants: {
    variant: {
      primary: ["bg-primary", "text-white", "border-transparent", "hover:bg-primary/90"],
      secondary: ["bg-white", "text-black", "border-gray-400", "hover:bg-gray-100"],
    },
    size: {
      small: ["text-sm", "py-1", "px-2"],
      medium: ["text-base", "py-2", "px-4"],
    },
    isDisabled: {
      false: null,
      true: ["opacity-50", "cursor-not-allowed"],
    },
  },
  
  defaultVariants: {
    variant: "primary",
    size: "medium",
    isDisabled: false,
  },
});
 
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
