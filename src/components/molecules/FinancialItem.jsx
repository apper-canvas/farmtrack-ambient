import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const FinancialItem = ({ financial, onEdit, onDelete }) => {
  const isIncome = financial.type_c === "income";
  const amount = parseFloat(financial.amount_c || 0);

  const getCategoryIcon = (category, type) => {
    if (type === "income") {
      const incomeIcons = {
        "sales": "DollarSign",
        "grants": "Gift",
        "other": "TrendingUp"
      };
      return incomeIcons[category?.toLowerCase()] || "TrendingUp";
    } else {
      const expenseIcons = {
        "seeds": "Sprout",
        "fertilizer": "Leaf", 
        "equipment": "Wrench",
        "fuel": "Fuel",
        "labor": "Users",
        "utilities": "Zap",
        "other": "TrendingDown"
      };
      return expenseIcons[category?.toLowerCase()] || "TrendingDown";
    }
  };

  return (
    <Card className={`border-l-4 ${isIncome ? 'border-l-green-500 bg-gradient-to-r from-green-50 to-green-25' : 'border-l-red-500 bg-gradient-to-r from-red-50 to-red-25'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-md ${
            isIncome 
              ? 'bg-gradient-to-br from-green-100 to-green-200' 
              : 'bg-gradient-to-br from-red-100 to-red-200'
          }`}>
            <ApperIcon 
name={getCategoryIcon(financial.category_c, financial.type_c)} 
              className={`h-6 w-6 ${isIncome ? 'text-green-700' : 'text-red-700'}`} 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">
                {financial.description_c}
              </h3>
              <span className={`text-xl font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                {isIncome ? '+' : '-'}${amount.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
<div className="flex items-center space-x-1 text-gray-500">
                <ApperIcon name="Calendar" className="h-4 w-4" />
                <span>{format(new Date(financial.date_c), "MMM dd, yyyy")}</span>
              </div>
              
              <Badge 
                variant={isIncome ? "success" : "danger"} 
                size="sm"
              >
                {financial.category_c}
              </Badge>
              
              <Badge variant="outline" size="sm">
                {isIncome ? "Income" : "Expense"}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(financial)}
            icon="Edit"
          >
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(financial.Id)}
            icon="Trash2"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FinancialItem;