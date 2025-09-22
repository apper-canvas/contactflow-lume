class LeadsService {
  constructor() {
    this.tableName = 'leads_c';
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
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "status_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform database fields to UI format
      return response.data.map(lead => ({
        Id: lead.Id,
        name: lead.name_c || '',
        email: lead.email_c || '',
        phone: lead.phone_c || '',
        companyId: lead.company_id_c?.Id || lead.company_id_c || '',
        companyName: lead.company_id_c?.Name || '',
        status: lead.status_c || 'New'
      }));
      
    } catch (error) {
      console.error("Error fetching leads:", error?.response?.data?.message || error);
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
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "status_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      // Transform database fields to UI format
      const lead = response.data;
      return {
        Id: lead.Id,
        name: lead.name_c || '',
        email: lead.email_c || '',
        phone: lead.phone_c || '',
        companyId: lead.company_id_c?.Id || lead.company_id_c || '',
        companyName: lead.company_id_c?.Name || '',
        status: lead.status_c || 'New'
      };
      
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(leadData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          name_c: leadData.name || '',
          email_c: leadData.email || '',
          phone_c: leadData.phone || '',
          company_id_c: leadData.companyId ? parseInt(leadData.companyId) : null,
          status_c: leadData.status || 'New'
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
          const lead = result.data;
          return {
            Id: lead.Id,
            name: lead.name_c || '',
            email: lead.email_c || '',
            phone: lead.phone_c || '',
            companyId: lead.company_id_c?.Id || lead.company_id_c || '',
            companyName: lead.company_id_c?.Name || '',
            status: lead.status_c || 'New'
          };
        } else {
          throw new Error(result.message || 'Failed to create lead');
        }
      }
      
    } catch (error) {
      console.error("Error creating lead:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, leadData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields for update operation
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: leadData.name || '',
          email_c: leadData.email || '',
          phone_c: leadData.phone || '',
          company_id_c: leadData.companyId ? parseInt(leadData.companyId) : null,
          status_c: leadData.status || 'New'
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
          const lead = result.data;
          return {
            Id: lead.Id,
            name: lead.name_c || '',
            email: lead.email_c || '',
            phone: lead.phone_c || '',
            companyId: lead.company_id_c?.Id || lead.company_id_c || '',
            companyName: lead.company_id_c?.Name || '',
            status: lead.status_c || 'New'
          };
        } else {
          throw new Error(result.message || 'Failed to update lead');
        }
      }
      
    } catch (error) {
      console.error("Error updating lead:", error?.response?.data?.message || error);
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
          throw new Error(result.message || 'Failed to delete lead');
        }
      }
      
      return true;
      
    } catch (error) {
      console.error("Error deleting lead:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByCompanyId(companyId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "company_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(companyId)],
          "Include": true
        }]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform database fields to UI format
      return response.data.map(lead => ({
        Id: lead.Id,
        name: lead.name_c || '',
        email: lead.email_c || '',
        phone: lead.phone_c || '',
        companyId: lead.company_id_c?.Id || lead.company_id_c || '',
        companyName: lead.company_id_c?.Name || '',
        status: lead.status_c || 'New'
      }));
      
    } catch (error) {
      console.error("Error fetching leads by company:", error?.response?.data?.message || error);
      return [];
    }
  }

  async updateStatus(id, status) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || 'Failed to update lead status');
        }
      }
      
      return true;
      
    } catch (error) {
      console.error("Error updating lead status:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new LeadsService();