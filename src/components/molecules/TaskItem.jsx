import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TaskItem = ({ task, onComplete, onEdit, onDelete }) => {
  const getPriorityVariant = (priority) => {
    switch(priority?.toLowerCase()) {
      case "high": return "danger";
      case "medium": return "warning"; 
      case "low": return "info";
      default: return "default";
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      "planting": "Sprout",
      "watering": "Droplets",
      "harvesting": "ShoppingBasket",
      "maintenance": "Wrench",
      "fertilizing": "Leaf",
      "general": "CheckSquare"
    };
    return iconMap[category?.toLowerCase()] || "CheckSquare";
  };

const isOverdue = new Date(task.due_date_c) < new Date() && !task.completed_c;

  return (
    <Card className={`transition-all duration-200 ${task.completed ? 'opacity-75 bg-gradient-to-r from-green-50 to-green-100' : ''} ${isOverdue ? 'ring-2 ring-red-200' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
<button
            onClick={() => onComplete(task.Id)}
            className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              task.completed_c 
                ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-500' 
                : 'border-gray-300 hover:border-primary-500'
            }`}
          >
            {task.completed_c && <ApperIcon name="Check" className="h-3 w-3 text-white" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name={getCategoryIcon(task.category_c)} className="h-5 w-5 text-primary-600" />
              <h3 className={`font-semibold text-gray-900 ${task.completed_c ? 'line-through' : ''}`}>
                {task.title_c}
              </h3>
            </div>
            
{task.description_c && (
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {task.description_c}
              </p>
            )}
            
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-1 text-gray-500">
                <ApperIcon name="Calendar" className="h-4 w-4" />
                <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                  {format(new Date(task.due_date_c), "MMM dd, yyyy")}
                </span>
              </div>
              
              <Badge variant={getPriorityVariant(task.priority_c)} size="sm">
                {task.priority_c} Priority
              </Badge>
              
{isOverdue && !task.completed_c && (
                <Badge variant="danger" size="sm">
                  Overdue
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            icon="Edit"
          >
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.Id)}
            icon="Trash2"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskItem;