import React, { useState, useEffect } from "react";
import WeatherCard from "@/components/molecules/WeatherCard";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { weatherService } from "@/services/api/weatherService";

const Weather = () => {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await weatherService.getForecast();
      setWeather(data);
    } catch (error) {
      setError(error.message || "Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadWeather} />;

  const todayWeather = weather[0];
  const forecastWeather = weather.slice(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Weather Forecast
          </h1>
          <p className="text-gray-600 mt-2">
            Plan your farm activities with accurate weather information
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="RefreshCw" className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Today's Weather - Featured */}
{todayWeather && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Today's Weather</h2>
            <div className="text-sm text-gray-600 font-medium">
              {new Date(todayWeather.date_c).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <WeatherCard weather={todayWeather} isToday={true} />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Detailed Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Thermometer" className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium text-gray-600">Temperature</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {todayWeather.temperature.high}° / {todayWeather.temperature.low}°
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Droplets" className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600">Humidity</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {todayWeather.humidity}%
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="CloudRain" className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Precipitation</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {todayWeather.precipitation}%
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Eye" className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium text-gray-600">Conditions</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 capitalize">
                    {todayWeather.condition}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 5-Day Forecast */}
      {forecastWeather.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">5-Day Forecast</h2>
            <ApperIcon name="Calendar" className="h-6 w-6 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {forecastWeather.map((dayWeather, index) => (
              <WeatherCard key={index} weather={dayWeather} />
            ))}
          </div>
        </Card>
      )}

      {/* Agricultural Insights */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <ApperIcon name="Lightbulb" className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Agricultural Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Weather Recommendations</h3>
            <div className="space-y-3">
              {todayWeather?.condition === "sunny" && (
                <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <ApperIcon name="Sun" className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Perfect for Fieldwork</div>
                    <div className="text-sm text-gray-600">Ideal conditions for planting, harvesting, and equipment operation</div>
                  </div>
                </div>
              )}
              
              {todayWeather?.condition === "rainy" && (
                <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <ApperIcon name="CloudRain" className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Natural Irrigation</div>
                    <div className="text-sm text-gray-600">Good for plant growth, avoid heavy machinery use</div>
                  </div>
                </div>
              )}
              
              {todayWeather?.precipitation > 70 && (
                <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <ApperIcon name="Umbrella" className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">High Rain Chance</div>
                    <div className="text-sm text-gray-600">Consider postponing outdoor activities</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Planning Tips</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <ApperIcon name="Calendar" className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Check forecast regularly</div>
                  <div className="text-sm text-gray-600">Plan farm activities 3-5 days ahead</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <ApperIcon name="Sprout" className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Optimize planting times</div>
                  <div className="text-sm text-gray-600">Use weather patterns to maximize crop success</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <ApperIcon name="Shield" className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Protect your crops</div>
                  <div className="text-sm text-gray-600">Prepare for extreme weather conditions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Weather;