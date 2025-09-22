class WeatherService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'weather_c';
  }

  async getForecast() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "precipitation_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 7, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching weather forecast:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getCurrentWeather() {
    try {
      const forecast = await this.getForecast();
      if (forecast.length > 0) {
        return forecast[0];
      }
      return null;
    } catch (error) {
      console.error("Error fetching current weather:", error?.response?.data?.message || error);
      return null;
    }
  }

  async getWeatherByDate(date) {
    try {
      const targetDate = new Date(date).toISOString().split('T')[0];
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "precipitation_c"}}
        ],
        where: [
          {"FieldName": "date_c", "Operator": "EqualTo", "Values": [targetDate]}
        ],
        pagingInfo: {"limit": 1, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.data && response.data.length > 0) {
        return response.data[0];
      }

      return null;
    } catch (error) {
      console.error("Error fetching weather by date:", error?.response?.data?.message || error);
      return null;
    }
  }
}

export const weatherService = new WeatherService();