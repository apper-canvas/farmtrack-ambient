class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "crop_id_c"}}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "completed_c"}},
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
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          Name: taskData.title_c || taskData.title || 'New Task',
          title_c: taskData.title_c || taskData.title,
          description_c: taskData.description_c || taskData.description,
          due_date_c: taskData.due_date_c || taskData.dueDate,
          priority_c: taskData.priority_c || taskData.priority || 'medium',
          category_c: taskData.category_c || taskData.category || 'general',
          completed_c: taskData.completed_c || taskData.completed || false,
          crop_id_c: taskData.crop_id_c || taskData.cropId
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

      throw new Error("Failed to create task");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include fields that are being updated
      if (taskData.title_c !== undefined || taskData.title !== undefined) {
        updateData.title_c = taskData.title_c || taskData.title;
        updateData.Name = taskData.title_c || taskData.title;
      }
      if (taskData.description_c !== undefined || taskData.description !== undefined) {
        updateData.description_c = taskData.description_c || taskData.description;
      }
      if (taskData.due_date_c !== undefined || taskData.dueDate !== undefined) {
        updateData.due_date_c = taskData.due_date_c || taskData.dueDate;
      }
      if (taskData.priority_c !== undefined || taskData.priority !== undefined) {
        updateData.priority_c = taskData.priority_c || taskData.priority;
      }
      if (taskData.category_c !== undefined || taskData.category !== undefined) {
        updateData.category_c = taskData.category_c || taskData.category;
      }
      if (taskData.completed_c !== undefined || taskData.completed !== undefined) {
        updateData.completed_c = taskData.completed_c || taskData.completed;
      }
      if (taskData.crop_id_c !== undefined || taskData.cropId !== undefined) {
        updateData.crop_id_c = taskData.crop_id_c || taskData.cropId;
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

      throw new Error("Failed to update task");
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
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
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const taskService = new TaskService();