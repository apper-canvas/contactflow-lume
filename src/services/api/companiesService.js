import companiesData from "@/services/mockData/companies.json";

class CompaniesService {
  constructor() {
    this.storageKey = "contactflow_companies";
    this.initializeData();
  }

  initializeData() {
    const storedData = localStorage.getItem(this.storageKey);
    if (!storedData) {
      localStorage.setItem(this.storageKey, JSON.stringify(companiesData));
    }
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveData(companies) {
    localStorage.setItem(this.storageKey, JSON.stringify(companies));
  }

  async getAll() {
    await this.delay();
    return [...this.getData()];
  }

  async getById(id) {
    await this.delay();
    const companies = this.getData();
    const company = companies.find(c => c.Id === parseInt(id));
    return company ? { ...company } : null;
  }

  async create(companyData) {
    await this.delay();
    const companies = this.getData();
    const maxId = companies.length > 0 ? Math.max(...companies.map(c => c.Id)) : 0;
    
    const newCompany = {
      ...companyData,
      Id: maxId + 1,
      contactIds: [],
      createdAt: new Date().toISOString()
    };

    companies.push(newCompany);
    this.saveData(companies);
    return { ...newCompany };
  }

  async update(id, companyData) {
    await this.delay();
    const companies = this.getData();
    const index = companies.findIndex(c => c.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Company not found");
    }

    const updatedCompany = {
      ...companies[index],
      ...companyData,
      Id: parseInt(id)
    };

    companies[index] = updatedCompany;
    this.saveData(companies);
    return { ...updatedCompany };
  }

  async delete(id) {
    await this.delay();
    const companies = this.getData();
    const filteredCompanies = companies.filter(c => c.Id !== parseInt(id));
    
    if (filteredCompanies.length === companies.length) {
      throw new Error("Company not found");
    }

    this.saveData(filteredCompanies);
    return true;
  }
}

export default new CompaniesService();