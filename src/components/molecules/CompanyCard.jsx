import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const CompanyCard = ({ 
  company, 
  contactCount = 0,
  onEdit, 
  onDelete, 
  onViewDetails,
  className 
}) => {
  return (
    <div 
      className={cn(
        "card p-4 hover:scale-[1.02] cursor-pointer transition-all duration-200",
        className
      )}
      onClick={onViewDetails}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={company.logo}
            alt={company.name}
            fallback={company.name.split(' ').map(word => word[0]).join('').toUpperCase()}
            size="lg"
          />
          <div>
            <h3 className="font-semibold text-slate-900">{company.name}</h3>
            {company.industry && (
              <p className="text-sm text-slate-600">{company.industry}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="p-1"
          >
            <ApperIcon name="Edit" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="p-1 hover:text-error"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="primary">
            {contactCount} contact{contactCount !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="space-y-1 text-sm">
          {company.website && (
            <div className="flex items-center space-x-2 text-slate-600">
              <ApperIcon name="Globe" className="h-3 w-3" />
              <span className="truncate">{company.website}</span>
            </div>
          )}
          {company.address && (
            <div className="flex items-center space-x-2 text-slate-600">
              <ApperIcon name="MapPin" className="h-3 w-3" />
              <span className="truncate">{company.address}</span>
            </div>
          )}
        </div>
      </div>
      
      {company.notes && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 line-clamp-2">{company.notes}</p>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;