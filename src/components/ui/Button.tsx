import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "danger";
  size?: "default" | "sm" | "lg" | "icon" | "xl";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-[11px] sm:text-sm font-bold uppercase tracking-widest ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            "bg-indigo-600 text-white shadow-lg shadow-indigo-200/50 hover:bg-slate-900 hover:shadow-slate-200/50": variant === "default",
            "bg-slate-100/80 text-slate-900 border border-transparent hover:bg-slate-200/80": variant === "secondary",
            "border-2 border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-200": variant === "outline",
            "hover:bg-slate-50 text-slate-500 hover:text-slate-900": variant === "ghost",
            "bg-rose-500 text-white shadow-lg shadow-rose-200/50 hover:bg-rose-600": variant === "danger",
            "h-11 px-6": size === "default",
            "h-9 px-4 text-[10px]": size === "sm",
            "h-14 px-8 text-sm": size === "lg",
            "h-16 px-10 text-base": size === "xl",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
