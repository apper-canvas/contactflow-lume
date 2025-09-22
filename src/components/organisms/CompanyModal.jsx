import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Avatar from "@/components/atoms/Avatar";
import ContactCard from "@/components/molecules/ContactCard";
import { format } from "date-fns";

const CompanyModal = ({ 
  company, 
  contacts = [],
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  onEditContact,
  onDeleteContact,
  onViewContact,
  isEditing: initialEditing = false 
}) => {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    website: "",
    address: "",
    notes: "",
    logo: ""
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        industry: company.industry || "",
        website: company.website || "",
        address: company.address || "",
        notes: company.notes || "",
        logo: company.logo || ""
      });
    } else {
      setFormData({
        name: "",
        industry: "",
        website: "",
        address: "",
        notes: "",
        logo: ""
      });
    }
    setIsEditing(initialEditing || !company);
    setErrors({});
  }, [company, initialEditing]);
  
  if (!isOpen) return null;
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }
    
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = "Please enter a valid website URL (including http:// or https://)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!validateForm()) return;
    
    onSave(formData);
    toast.success(company ? "Company updated successfully" : "Company created successfully");
    onClose();
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this company? This will not delete associated contacts.")) {
      onDelete(company.Id);
      toast.success("Company deleted successfully");
      onClose();
    }
  };
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  
  const companyContacts = contacts.filter(contact => 
    contact.companyId && contact.companyId.toString() === company?.Id.toString()
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-slate-200 p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isEditing && company && (
                <Avatar 
                  src={company.logo}
                  alt={company.name}
                  fallback={company.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                  size="lg"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {isEditing ? (company ? "Edit Company" : "Add Company") : company?.name}
                </h2>
                {!isEditing && company?.industry && (
                  <p className="text-sm text-slate-600 mt-1">{company.industry}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isEditing && company && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                    size="sm"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleDelete}
                    size="sm"
                    className="text-error hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                onClick={onClose}
                size="sm"
                className="p-2"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <FormField
                label="Company Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={errors.name}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Industry"
                  value={formData.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                />
                
                <FormField
                  label="Website"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  error={errors.website}
                  placeholder="https://example.com"
                />
              </div>
              
              <FormField
                label="Address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              
              <FormField
                label="Notes"
              >
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Add notes about this company..."
                />
              </FormField>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    if (!company) onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {company ? "Save Changes" : "Create Company"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                      Company Information
                    </h3>
                    <div className="space-y-3">
                      {company.website && (
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="Globe" className="w-4 h-4 text-slate-400" />
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {company.website}
                          </a>
                        </div>
                      )}
                      {company.address && (
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="MapPin" className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{company.address}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Users" className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">
                          {companyContacts.length} contact{companyContacts.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                      Activity
                    </h3>
                    <div className="space-y-3">
                      {company.createdAt && (
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="Calendar" className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">
                            Added {format(new Date(company.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {company.notes && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                    Notes
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-700 whitespace-pre-wrap">{company.notes}</p>
                  </div>
                </div>
              )}
              
              {companyContacts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
                    Contacts ({companyContacts.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {companyContacts.map(contact => (
                      <ContactCard
                        key={contact.Id}
                        contact={contact}
                        company={company}
                        onEdit={() => onEditContact(contact)}
                        onDelete={() => onDeleteContact(contact.Id)}
                        onViewDetails={() => onViewContact(contact)}
                        className="hover:scale-100"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;