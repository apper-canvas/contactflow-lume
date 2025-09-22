import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-primary-100 text-primary-800",
    success: "bg-green-100 text-success",
    warning: "bg-yellow-100 text-warning",
    error: "bg-red-100 text-error",
    outline: "border border-slate-300 text-slate-700"
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;