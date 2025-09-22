class CropService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'crop_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "field_location_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        orderBy: [{"fieldName": "planting_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "field_location_c"}},
          {"field": {"Name": "quantity_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(cropData) {
    try {
      const params = {
        records: [{
          Name: cropData.name_c || cropData.name || 'New Crop',
          name_c: cropData.name_c || cropData.name,
          variety_c: cropData.variety_c || cropData.variety,
          planting_date_c: cropData.planting_date_c || cropData.plantingDate,
          expected_harvest_c: cropData.expected_harvest_c || cropData.expectedHarvest,
          field_location_c: cropData.field_location_c || cropData.fieldLocation,
          quantity_c: parseFloat(cropData.quantity_c || cropData.quantity || 0),
          status_c: cropData.status_c || cropData.status || 'planted',
          notes_c: cropData.notes_c || cropData.notes
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

      throw new Error("Failed to create crop");
    } catch (error) {
      console.error("Error creating crop:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, cropData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include fields that are being updated
      if (cropData.name_c !== undefined || cropData.name !== undefined) {
        updateData.name_c = cropData.name_c || cropData.name;
        updateData.Name = cropData.name_c || cropData.name;
      }
      if (cropData.variety_c !== undefined || cropData.variety !== undefined) {
        updateData.variety_c = cropData.variety_c || cropData.variety;
      }
      if (cropData.planting_date_c !== undefined || cropData.plantingDate !== undefined) {
        updateData.planting_date_c = cropData.planting_date_c || cropData.plantingDate;
      }
      if (cropData.expected_harvest_c !== undefined || cropData.expectedHarvest !== undefined) {
        updateData.expected_harvest_c = cropData.expected_harvest_c || cropData.expectedHarvest;
      }
      if (cropData.field_location_c !== undefined || cropData.fieldLocation !== undefined) {
        updateData.field_location_c = cropData.field_location_c || cropData.fieldLocation;
      }
      if (cropData.quantity_c !== undefined || cropData.quantity !== undefined) {
        updateData.quantity_c = parseFloat(cropData.quantity_c || cropData.quantity || 0);
      }
      if (cropData.status_c !== undefined || cropData.status !== undefined) {
        updateData.status_c = cropData.status_c || cropData.status;
      }
      if (cropData.notes_c !== undefined || cropData.notes !== undefined) {
        updateData.notes_c = cropData.notes_c || cropData.notes;
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

      throw new Error("Failed to update crop");
    } catch (error) {
      console.error("Error updating crop:", error?.response?.data?.message || error);
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
      console.error("Error deleting crop:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const cropService = new CropService();