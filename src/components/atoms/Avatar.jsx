import React from "react";
import { cn } from "@/utils/cn";

const Avatar = ({ 
  className, 
  size = "default", 
  src, 
  alt, 
  fallback, 
  ...props 
}) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    default: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg"
  };
  
  const initials = fallback || (alt ? alt.split(' ').map(name => name[0]).join('').toUpperCase() : '?');
  
  return (
    <div
      className={cn(
        "avatar",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <span className={src ? "hidden" : "flex items-center justify-center w-full h-full"}>
        {initials}
      </span>
    </div>
  );
};

export default Avatar;