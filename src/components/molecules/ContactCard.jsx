import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const ContactCard = ({ 
  contact, 
  company,
  onEdit, 
  onDelete, 
  onViewDetails,
  className 
}) => {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  
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
            src={contact.avatar}
            alt={fullName}
            fallback={`${contact.firstName[0]}${contact.lastName[0]}`}
            size="lg"
          />
          <div>
            <h3 className="font-semibold text-slate-900">{fullName}</h3>
            {contact.jobTitle && (
              <p className="text-sm text-slate-600">{contact.jobTitle}</p>
            )}
            {company && (
              <Badge variant="outline" className="mt-1">
                {company.name}
              </Badge>
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
      
      <div className="space-y-2 text-sm">
        {contact.email && (
          <div className="flex items-center space-x-2 text-slate-600">
            <ApperIcon name="Mail" className="h-3 w-3" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center space-x-2 text-slate-600">
            <ApperIcon name="Phone" className="h-3 w-3" />
            <span>{contact.phone}</span>
          </div>
        )}
        {contact.lastContacted && (
          <div className="flex items-center space-x-2 text-slate-500 text-xs">
            <ApperIcon name="Clock" className="h-3 w-3" />
            <span>Last contacted {format(new Date(contact.lastContacted), "MMM d, yyyy")}</span>
          </div>
        )}
      </div>
      
      {contact.notes && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 line-clamp-2">{contact.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ContactCard;