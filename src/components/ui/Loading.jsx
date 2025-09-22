import React from "react";

const Loading = ({ className = "", itemCount = 6 }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index} className="card p-4 animate-pulse">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
              <div>
                <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-20"></div>
                <div className="h-5 bg-slate-200 rounded w-16 mt-2"></div>
              </div>
            </div>
            <div className="flex space-x-1">
              <div className="w-8 h-8 bg-slate-200 rounded"></div>
              <div className="w-8 h-8 bg-slate-200 rounded"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-200 rounded"></div>
              <div className="h-3 bg-slate-200 rounded w-32"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-200 rounded"></div>
              <div className="h-3 bg-slate-200 rounded w-24"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-200 rounded"></div>
              <div className="h-3 bg-slate-200 rounded w-20"></div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;