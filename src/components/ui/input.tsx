import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-full border border-[#E6DCF2] bg-white px-4 text-sm text-[#1A1228] outline-none transition placeholder:text-[#A394B4] focus:border-[#5C2B92] focus:ring-2 focus:ring-[#5C2B92]/15",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
