class ContactsService {
  constructor() {
    this.tableName = 'contact_c';
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "last_contacted_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "avatar_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform database fields to UI format
      return response.data.map(contact => ({
        Id: contact.Id,
        firstName: contact.first_name_c || '',
        lastName: contact.last_name_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        jobTitle: contact.job_title_c || '',
        companyId: contact.company_id_c?.Id || contact.company_id_c || '',
        notes: contact.notes_c || '',
        lastContacted: contact.last_contacted_c || '',
        createdAt: contact.created_at_c || '',
        avatar: contact.avatar_c || ''
      }));
      
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "last_contacted_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "avatar_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      // Transform database fields to UI format
      const contact = response.data;
      return {
        Id: contact.Id,
        firstName: contact.first_name_c || '',
        lastName: contact.last_name_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        jobTitle: contact.job_title_c || '',
        companyId: contact.company_id_c?.Id || contact.company_id_c || '',
        notes: contact.notes_c || '',
        lastContacted: contact.last_contacted_c || '',
        createdAt: contact.created_at_c || '',
        avatar: contact.avatar_c || ''
      };
      
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(contactData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields for create operation
      // Handle lookup field (company_id_c) - send only ID value
      const params = {
        records: [{
          first_name_c: contactData.firstName || '',
          last_name_c: contactData.lastName || '',
          email_c: contactData.email || '',
          phone_c: contactData.phone || '',
          job_title_c: contactData.jobTitle || '',
          company_id_c: contactData.companyId ? parseInt(contactData.companyId) : null,
          notes_c: contactData.notes || '',
          last_contacted_c: contactData.lastContacted || new Date().toISOString(),
          created_at_c: new Date().toISOString(),
          avatar_c: contactData.avatar || ''
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
          const contact = result.data;
          return {
            Id: contact.Id,
            firstName: contact.first_name_c || '',
            lastName: contact.last_name_c || '',
            email: contact.email_c || '',
            phone: contact.phone_c || '',
            jobTitle: contact.job_title_c || '',
            companyId: contact.company_id_c?.Id || contact.company_id_c || '',
            notes: contact.notes_c || '',
            lastContacted: contact.last_contacted_c || '',
            createdAt: contact.created_at_c || '',
            avatar: contact.avatar_c || ''
          };
        } else {
          throw new Error(result.message || 'Failed to create contact');
        }
      }
      
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, contactData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include Updateable fields for update operation
      // Handle lookup field (company_id_c) - send only ID value
      const params = {
        records: [{
          Id: parseInt(id),
          first_name_c: contactData.firstName || '',
          last_name_c: contactData.lastName || '',
          email_c: contactData.email || '',
          phone_c: contactData.phone || '',
          job_title_c: contactData.jobTitle || '',
          company_id_c: contactData.companyId ? parseInt(contactData.companyId) : null,
          notes_c: contactData.notes || '',
          last_contacted_c: contactData.lastContacted || new Date().toISOString(),
          avatar_c: contactData.avatar || ''
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
          const contact = result.data;
          return {
            Id: contact.Id,
            firstName: contact.first_name_c || '',
            lastName: contact.last_name_c || '',
            email: contact.email_c || '',
            phone: contact.phone_c || '',
            jobTitle: contact.job_title_c || '',
            companyId: contact.company_id_c?.Id || contact.company_id_c || '',
            notes: contact.notes_c || '',
            lastContacted: contact.last_contacted_c || '',
            createdAt: contact.created_at_c || '',
            avatar: contact.avatar_c || ''
          };
        } else {
          throw new Error(result.message || 'Failed to update contact');
        }
      }
      
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
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
          throw new Error(result.message || 'Failed to delete contact');
        }
      }
      
      return true;
      
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByCompanyId(companyId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "last_contacted_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "avatar_c"}}
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
      return response.data.map(contact => ({
        Id: contact.Id,
        firstName: contact.first_name_c || '',
        lastName: contact.last_name_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        jobTitle: contact.job_title_c || '',
        companyId: contact.company_id_c?.Id || contact.company_id_c || '',
        notes: contact.notes_c || '',
        lastContacted: contact.last_contacted_c || '',
        createdAt: contact.created_at_c || '',
        avatar: contact.avatar_c || ''
      }));
      
    } catch (error) {
      console.error("Error fetching contacts by company:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new ContactsService();