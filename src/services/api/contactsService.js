import contactsData from "@/services/mockData/contacts.json";

class ContactsService {
  constructor() {
    this.storageKey = "contactflow_contacts";
    this.initializeData();
  }

  initializeData() {
    const storedData = localStorage.getItem(this.storageKey);
    if (!storedData) {
      localStorage.setItem(this.storageKey, JSON.stringify(contactsData));
    }
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveData(contacts) {
    localStorage.setItem(this.storageKey, JSON.stringify(contacts));
  }

  async getAll() {
    await this.delay();
    return [...this.getData()];
  }

  async getById(id) {
    await this.delay();
    const contacts = this.getData();
    const contact = contacts.find(c => c.Id === parseInt(id));
    return contact ? { ...contact } : null;
  }

  async create(contactData) {
    await this.delay();
    const contacts = this.getData();
    const maxId = contacts.length > 0 ? Math.max(...contacts.map(c => c.Id)) : 0;
    
    const newContact = {
      ...contactData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      lastContacted: contactData.lastContacted || new Date().toISOString()
    };

    contacts.push(newContact);
    this.saveData(contacts);
    return { ...newContact };
  }

  async update(id, contactData) {
    await this.delay();
    const contacts = this.getData();
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Contact not found");
    }

    const updatedContact = {
      ...contacts[index],
      ...contactData,
      Id: parseInt(id)
    };

    contacts[index] = updatedContact;
    this.saveData(contacts);
    return { ...updatedContact };
  }

  async delete(id) {
    await this.delay();
    const contacts = this.getData();
    const filteredContacts = contacts.filter(c => c.Id !== parseInt(id));
    
    if (filteredContacts.length === contacts.length) {
      throw new Error("Contact not found");
    }

    this.saveData(filteredContacts);
    return true;
  }

  async getByCompanyId(companyId) {
    await this.delay();
    const contacts = this.getData();
    return contacts.filter(c => c.companyId && c.companyId.toString() === companyId.toString());
  }
}

export default new ContactsService();