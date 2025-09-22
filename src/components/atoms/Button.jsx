import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-primary-500",
    ghost: "hover:bg-slate-100 text-slate-700 focus:ring-primary-500",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary-500"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;