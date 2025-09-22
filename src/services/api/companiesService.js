class CompaniesService {
  constructor() {
    this.tableName = 'company_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "logo_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform database fields to UI format
      return response.data.map(company => ({
        Id: company.Id,
        name: company.name_c || '',
        industry: company.industry_c || '',
        website: company.website_c || '',
        address: company.address_c || '',
        notes: company.notes_c || '',
        logo: company.logo_c || '',
        createdAt: company.created_at_c || ''
      }));
      
    } catch (error) {
      console.error("Error fetching companies:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "logo_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      // Transform database fields to UI format
      const company = response.data;
      return {
        Id: company.Id,
        name: company.name_c || '',
        industry: company.industry_c || '',
        website: company.website_c || '',
        address: company.address_c || '',
        notes: company.notes_c || '',
        logo: company.logo_c || '',
        createdAt: company.created_at_c || ''
      };
      
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(companyData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          name_c: companyData.name || '',
          industry_c: companyData.industry || '',
          website_c: companyData.website || '',
          address_c: companyData.address || '',
          notes_c: companyData.notes || '',
          logo_c: companyData.logo || '',
          created_at_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          // Transform database fields to UI format
          const company = result.data;
          return {
            Id: company.Id,
            name: company.name_c || '',
            industry: company.industry_c || '',
            website: company.website_c || '',
            address: company.address_c || '',
            notes: company.notes_c || '',
            logo: company.logo_c || '',
            createdAt: company.created_at_c || ''
          };
        } else {
          throw new Error(result.message || 'Failed to create company');
        }
      }
      
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, companyData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields for update operation
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: companyData.name || '',
          industry_c: companyData.industry || '',
          website_c: companyData.website || '',
          address_c: companyData.address || '',
          notes_c: companyData.notes || '',
          logo_c: companyData.logo || ''
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          // Transform database fields to UI format
          const company = result.data;
          return {
            Id: company.Id,
            name: company.name_c || '',
            industry: company.industry_c || '',
            website: company.website_c || '',
            address: company.address_c || '',
            notes: company.notes_c || '',
            logo: company.logo_c || '',
            createdAt: company.created_at_c || ''
          };
        } else {
          throw new Error(result.message || 'Failed to update company');
        }
      }
      
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || 'Failed to delete company');
        }
      }
      
      return true;
      
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new CompaniesService();

export default new CompaniesService();