import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const ContactModal = ({ 
  contact, 
  company,
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  companies = [],
  isEditing: initialEditing = false 
}) => {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    companyId: "",
    notes: "",
    lastContacted: "",
    avatar: ""
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        phone: contact.phone || "",
        jobTitle: contact.jobTitle || "",
        companyId: contact.companyId || "",
        notes: contact.notes || "",
        lastContacted: contact.lastContacted || "",
        avatar: contact.avatar || ""
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        jobTitle: "",
        companyId: "",
        notes: "",
        lastContacted: "",
        avatar: ""
      });
    }
    setIsEditing(initialEditing || !contact);
    setErrors({});
  }, [contact, initialEditing]);
  
  if (!isOpen) return null;
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!validateForm()) return;
    
    const contactData = {
      ...formData,
      lastContacted: formData.lastContacted || new Date().toISOString()
    };
    
    onSave(contactData);
    toast.success(contact ? "Contact updated successfully" : "Contact created successfully");
    onClose();
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      onDelete(contact.Id);
      toast.success("Contact deleted successfully");
      onClose();
    }
  };
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  
  const fullName = contact ? `${contact.firstName} ${contact.lastName}` : "New Contact";
  const selectedCompany = companies.find(c => c.Id.toString() === formData.companyId);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-slate-200 p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isEditing && contact && (
                <Avatar 
                  src={contact.avatar}
                  alt={fullName}
                  fallback={`${contact.firstName[0]}${contact.lastName[0]}`}
                  size="lg"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {isEditing ? (contact ? "Edit Contact" : "Add Contact") : fullName}
                </h2>
                {!isEditing && contact && (
                  <div className="flex items-center space-x-2 mt-1">
                    {contact.jobTitle && (
                      <span className="text-sm text-slate-600">{contact.jobTitle}</span>
                    )}
                    {company && (
                      <Badge variant="outline">{company.name}</Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!isEditing && contact && (
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  error={errors.firstName}
                  required
                />
                <FormField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  error={errors.lastName}
                  required
                />
              </div>
              
              <FormField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={errors.email}
              />
              
              <FormField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              
              <FormField
                label="Job Title"
                value={formData.jobTitle}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
              />
              
              <FormField
                label="Company"
              >
                <select
                  value={formData.companyId}
                  onChange={(e) => handleChange("companyId", e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company.Id} value={company.Id.toString()}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </FormField>
              
              <FormField
                label="Notes"
              >
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Add notes about this contact..."
                />
              </FormField>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    if (!contact) onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {contact ? "Save Changes" : "Create Contact"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      {contact.email && (
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="Mail" className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{contact.email}</span>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="Phone" className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{contact.phone}</span>
                        </div>
                      )}
                      {selectedCompany && (
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="Building2" className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{selectedCompany.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                      Activity
                    </h3>
                    <div className="space-y-3">
                      {contact.lastContacted && (
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="Clock" className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">
                            Last contacted {format(new Date(contact.lastContacted), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                      )}
                      {contact.createdAt && (
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="Calendar" className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">
                            Added {format(new Date(contact.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {contact.notes && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                    Notes
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-700 whitespace-pre-wrap">{contact.notes}</p>
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

export default ContactModal;