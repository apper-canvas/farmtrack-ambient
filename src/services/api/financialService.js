class FinancialService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'financial_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "crop_id_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching financials:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "crop_id_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching financial record ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(financialData) {
    try {
      const params = {
        records: [{
          Name: financialData.description_c || financialData.description || 'New Record',
          type_c: financialData.type_c || financialData.type || 'expense',
          category_c: financialData.category_c || financialData.category,
          amount_c: parseFloat(financialData.amount_c || financialData.amount || 0),
          description_c: financialData.description_c || financialData.description,
          date_c: financialData.date_c || financialData.date,
          crop_id_c: financialData.crop_id_c || financialData.cropId
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to create financial record");
    } catch (error) {
      console.error("Error creating financial record:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, financialData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include fields that are being updated
      if (financialData.type_c !== undefined || financialData.type !== undefined) {
        updateData.type_c = financialData.type_c || financialData.type;
      }
      if (financialData.category_c !== undefined || financialData.category !== undefined) {
        updateData.category_c = financialData.category_c || financialData.category;
      }
      if (financialData.amount_c !== undefined || financialData.amount !== undefined) {
        updateData.amount_c = parseFloat(financialData.amount_c || financialData.amount || 0);
      }
      if (financialData.description_c !== undefined || financialData.description !== undefined) {
        updateData.description_c = financialData.description_c || financialData.description;
        updateData.Name = financialData.description_c || financialData.description;
      }
      if (financialData.date_c !== undefined || financialData.date !== undefined) {
        updateData.date_c = financialData.date_c || financialData.date;
      }
      if (financialData.crop_id_c !== undefined || financialData.cropId !== undefined) {
        updateData.crop_id_c = financialData.crop_id_c || financialData.cropId;
      }

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      throw new Error("Failed to update financial record");
    } catch (error) {
      console.error("Error updating financial record:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error("Error deleting financial record:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const financialService = new FinancialService();