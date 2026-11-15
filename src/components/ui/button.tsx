import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-[13.5px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C2B92]/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#5C2B92] text-white shadow-[0_3px_0_rgba(82,48,117,0.22)] hover:-translate-y-0.5 hover:bg-[#4E247E]",
        gold: "bg-gradient-to-b from-[#F8E9CC] to-[#E6D2A6] text-[#3D2C1B] shadow-[0_2px_6px_rgba(143,106,42,0.18)] hover:-translate-y-0.5",
        outline:
          "border border-[#E6DCF4] bg-[#FFFCFF] text-[#5C2B92] hover:bg-[#F6F0FC]",
        ghost: "text-[#5C4870] hover:bg-[#EFE6F8]",
        dark: "bg-[#171717] text-white hover:bg-black",
        soft: "bg-[#ECE3F8] text-[#5C2B92] hover:bg-[#E3D6F6]",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3.5 text-[13px]",
        lg: "h-[45px] px-4 text-[13.5px] font-bold",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
