import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import SearchBar from "@/components/molecules/SearchBar";
import ContactCard from "@/components/molecules/ContactCard";
import ContactModal from "@/components/organisms/ContactModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import contactsService from "@/services/api/contactsService";
import companiesService from "@/services/api/companiesService";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [selectedContact, setSelectedContact] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [contactsData, companiesData] = await Promise.all([
        contactsService.getAll(),
        companiesService.getAll()
      ]);
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (err) {
      setError(err.message || "Failed to load contacts");
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };
  
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      const company = companies.find(c => c.Id.toString() === contact.companyId);
      const companyName = company?.name?.toLowerCase() || "";
      
      return fullName.includes(query) ||
             contact.email?.toLowerCase().includes(query) ||
             contact.jobTitle?.toLowerCase().includes(query) ||
             companyName.includes(query);
    });
  }, [contacts, companies, searchQuery]);
  
  const handleAddContact = () => {
    setSelectedContact(null);
    setIsAddingContact(true);
    setIsContactModalOpen(true);
  };
  
  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsAddingContact(false);
    setIsContactModalOpen(true);
  };
  
  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setIsAddingContact(false);
    setIsContactModalOpen(true);
  };
  
  const handleSaveContact = async (contactData) => {
    try {
      let savedContact;
      if (selectedContact) {
        savedContact = await contactsService.update(selectedContact.Id, contactData);
        setContacts(prev => prev.map(c => c.Id === selectedContact.Id ? savedContact : c));
      } else {
        savedContact = await contactsService.create(contactData);
        setContacts(prev => [...prev, savedContact]);
      }
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
  
  const closeModal = () => {
    setIsContactModalOpen(false);
    setSelectedContact(null);
    setIsAddingContact(false);
  };
  
  const getContactCompany = (contact) => {
    return companies.find(company => company.Id.toString() === contact.companyId);
  };
  
  if (loading) {
    return (
      <div>
        <Header onAddContact={handleAddContact} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <Header onAddContact={handleAddContact} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Header onAddContact={handleAddContact} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Contacts</h1>
            <p className="text-slate-600">
              Manage your business contacts and relationships
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name, email, company, or job title..."
            className="max-w-lg"
          />
        </div>
        
        {filteredContacts.length === 0 ? (
          <Empty
            icon="Users"
            title={searchQuery ? "No contacts found" : "No contacts yet"}
            description={
              searchQuery
                ? "Try adjusting your search terms to find the contact you're looking for."
                : "Start building your network by adding your first business contact."
            }
            actionText="Add Contact"
            onAction={handleAddContact}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map(contact => (
              <ContactCard
                key={contact.Id}
                contact={contact}
                company={getContactCompany(contact)}
                onEdit={() => handleEditContact(contact)}
                onDelete={() => handleDeleteContact(contact.Id)}
                onViewDetails={() => handleViewContact(contact)}
              />
            ))}
          </div>
        )}
      </div>
      
      <ContactModal
        contact={selectedContact}
        company={selectedContact ? getContactCompany(selectedContact) : null}
        companies={companies}
        isOpen={isContactModalOpen}
        onClose={closeModal}
        onSave={handleSaveContact}
        onDelete={handleDeleteContact}
        isEditing={isAddingContact}
      />
    </div>
  );
};

export default ContactsPage;