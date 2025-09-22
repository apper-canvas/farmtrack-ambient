import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const WeatherCard = ({ weather, isToday = false }) => {
  const getWeatherIcon = (condition) => {
    const iconMap = {
      "sunny": "Sun",
      "cloudy": "Cloud",
      "rainy": "CloudRain",
      "stormy": "CloudLightning",
      "snowy": "CloudSnow",
      "foggy": "CloudDrizzle",
      "windy": "Wind"
    };
    return iconMap[condition.toLowerCase()] || "Sun";
  };

  const getBackgroundGradient = (condition) => {
    const gradientMap = {
      "sunny": "from-yellow-400 to-orange-500",
      "cloudy": "from-gray-400 to-gray-600", 
      "rainy": "from-blue-500 to-blue-700",
      "stormy": "from-purple-600 to-indigo-800",
      "snowy": "from-blue-200 to-blue-400",
      "foggy": "from-gray-300 to-gray-500",
      "windy": "from-teal-400 to-cyan-600"
    };
    return gradientMap[condition.toLowerCase()] || "from-blue-400 to-blue-600";
  };

  return (
<Card className={`text-center relative overflow-hidden ${isToday ? 'ring-2 ring-primary-500 ring-opacity-50' : ''}`}>
      <div className="relative z-10">
        <div className="text-sm font-medium text-gray-600 mb-2">
          {new Date(weather.date_c).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
        
        <div className={`mx-auto mb-3 h-16 w-16 rounded-full bg-gradient-to-br ${getBackgroundGradient(weather.condition_c)} flex items-center justify-center shadow-lg`}>
          <ApperIcon name={getWeatherIcon(weather.condition_c)} className="h-8 w-8 text-white" />
        </div>
        
        <div className="mb-2">
          <span className="text-2xl font-bold text-gray-900">
            {typeof weather.temperature_c === 'string' ? JSON.parse(weather.temperature_c).high : weather.temperature_c}°
          </span>
<span className="text-lg text-gray-600 ml-1">
            {typeof weather.temperature_c === 'string' ? JSON.parse(weather.temperature_c).low : weather.temperature_c}°
          </span>
        </div>
        
        <div className="text-sm text-gray-600 capitalize font-medium mb-3">
          {weather.condition_c}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1">
<ApperIcon name="Droplets" className="h-3 w-3" />
            <span>{weather.humidity_c}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="CloudRain" className="h-3 w-3" />
            <span>{weather.precipitation_c}%</span>
          </div>
        </div>
      </div>
      
      {isToday && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 opacity-10 pointer-events-none"></div>
      )}
    </Card>
  );
};

export default WeatherCard;