import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import SearchBar from "@/components/molecules/SearchBar";
import CompanyCard from "@/components/molecules/CompanyCard";
import CompanyModal from "@/components/organisms/CompanyModal";
import ContactModal from "@/components/organisms/ContactModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import companiesService from "@/services/api/companiesService";
import contactsService from "@/services/api/contactsService";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Company modal states
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  
  // Contact modal states
  const [selectedContact, setSelectedContact] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [companiesData, contactsData] = await Promise.all([
        companiesService.getAll(),
        contactsService.getAll()
      ]);
      setCompanies(companiesData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || "Failed to load companies");
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };
  
  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companies;
    
    const query = searchQuery.toLowerCase();
    return companies.filter(company =>
      company.name?.toLowerCase().includes(query) ||
      company.industry?.toLowerCase().includes(query) ||
      company.website?.toLowerCase().includes(query)
    );
  }, [companies, searchQuery]);
  
  const getCompanyContactCount = (companyId) => {
    return contacts.filter(contact => 
      contact.companyId && contact.companyId.toString() === companyId.toString()
    ).length;
  };
  
  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsAddingCompany(true);
    setIsCompanyModalOpen(true);
  };
  
  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsAddingCompany(false);
    setIsCompanyModalOpen(true);
  };
  
  const handleViewCompany = (company) => {
    setSelectedCompany(company);
    setIsAddingCompany(false);
    setIsCompanyModalOpen(true);
  };
  
  const handleSaveCompany = async (companyData) => {
    try {
      let savedCompany;
      if (selectedCompany) {
        savedCompany = await companiesService.update(selectedCompany.Id, companyData);
        setCompanies(prev => prev.map(c => c.Id === selectedCompany.Id ? savedCompany : c));
      } else {
        savedCompany = await companiesService.create(companyData);
        setCompanies(prev => [...prev, savedCompany]);
      }
    } catch (err) {
      toast.error("Failed to save company");
      throw err;
    }
  };
  
  const handleDeleteCompany = async (companyId) => {
    try {
      await companiesService.delete(companyId);
      setCompanies(prev => prev.filter(c => c.Id !== companyId));
      
      // Remove company association from contacts
      const updatedContacts = contacts.map(contact => {
        if (contact.companyId && contact.companyId.toString() === companyId.toString()) {
          return { ...contact, companyId: "" };
        }
        return contact;
      });
      setContacts(updatedContacts);
      
      // Update contacts in service
      for (const contact of updatedContacts) {
        if (contact.companyId === "") {
          await contactsService.update(contact.Id, contact);
        }
      }
    } catch (err) {
      toast.error("Failed to delete company");
      throw err;
    }
  };
  
  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsContactModalOpen(true);
  };
  
  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setIsContactModalOpen(true);
  };
  
  const handleSaveContact = async (contactData) => {
    try {
      const savedContact = await contactsService.update(selectedContact.Id, contactData);
      setContacts(prev => prev.map(c => c.Id === selectedContact.Id ? savedContact : c));
    } catch (err) {
      toast.error("Failed to save contact");
      throw err;
    }
  };
  
  const handleDeleteContact = async (contactId) => {
    try {
      await contactsService.delete(contactId);
      setContacts(prev => prev.filter(c => c.Id !== contactId));
    } catch (err) {
      toast.error("Failed to delete contact");
      throw err;
    }
  };
  
  const closeCompanyModal = () => {
    setIsCompanyModalOpen(false);
    setSelectedCompany(null);
    setIsAddingCompany(false);
  };
  
  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setSelectedContact(null);
  };
  
  const getContactCompany = (contact) => {
    return companies.find(company => company.Id.toString() === contact.companyId);
  };
  
  if (loading) {
    return (
      <div>
        <Header onAddCompany={handleAddCompany} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <Header onAddCompany={handleAddCompany} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Header onAddCompany={handleAddCompany} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Companies</h1>
            <p className="text-slate-600">
              Manage your business relationships and company information
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies by name, industry, or website..."
            className="max-w-lg"
          />
        </div>
        
        {filteredCompanies.length === 0 ? (
          <Empty
            icon="Building2"
            title={searchQuery ? "No companies found" : "No companies yet"}
            description={
              searchQuery
                ? "Try adjusting your search terms to find the company you're looking for."
                : "Start organizing your business relationships by adding your first company."
            }
            actionText="Add Company"
            onAction={handleAddCompany}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map(company => (
              <CompanyCard
                key={company.Id}
                company={company}
                contactCount={getCompanyContactCount(company.Id)}
                onEdit={() => handleEditCompany(company)}
                onDelete={() => handleDeleteCompany(company.Id)}
                onViewDetails={() => handleViewCompany(company)}
              />
            ))}
          </div>
        )}
      </div>
      
      <CompanyModal
        company={selectedCompany}
        contacts={contacts}
        isOpen={isCompanyModalOpen}
        onClose={closeCompanyModal}
        onSave={handleSaveCompany}
        onDelete={handleDeleteCompany}
        onEditContact={handleEditContact}
        onDeleteContact={handleDeleteContact}
        onViewContact={handleViewContact}
        isEditing={isAddingCompany}
      />
      
      <ContactModal
        contact={selectedContact}
        company={selectedContact ? getContactCompany(selectedContact) : null}
        companies={companies}
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        onSave={handleSaveContact}
        onDelete={handleDeleteContact}
        isEditing={false}
      />
    </div>
  );
};

export default CompaniesPage;