import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Header = ({ onAddContact, onAddCompany }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isContactsActive = location.pathname === "/contacts";
  const isCompaniesActive = location.pathname === "/companies";
  
  const handleAddClick = () => {
    if (isContactsActive) {
      onAddContact();
    } else if (isCompaniesActive) {
      onAddCompany();
    }
  };
  
  return (
    <header className="bg-surface border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                ContactFlow
              </h1>
            </div>
            
            <nav className="flex space-x-1">
              <button
                onClick={() => navigate("/contacts")}
                className={cn(
                  "px-4 py-2 rounded-md font-medium transition-all duration-200",
                  isContactsActive
                    ? "bg-primary-50 text-primary-700 border border-primary-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Users" className="w-4 h-4" />
                  <span>Contacts</span>
                </div>
              </button>
              
              <button
                onClick={() => navigate("/companies")}
                className={cn(
                  "px-4 py-2 rounded-md font-medium transition-all duration-200",
                  isCompaniesActive
                    ? "bg-primary-50 text-primary-700 border border-primary-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Building2" className="w-4 h-4" />
                  <span>Companies</span>
                </div>
              </button>
            </nav>
          </div>
          
          <Button onClick={handleAddClick} className="flex items-center space-x-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add {isContactsActive ? "Contact" : "Company"}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;