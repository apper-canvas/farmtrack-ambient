import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const navigation = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Crops", path: "/crops", icon: "Sprout" },
    { name: "Tasks", path: "/tasks", icon: "CheckSquare" },
    { name: "Finances", path: "/finances", icon: "DollarSign" },
    { name: "Weather", path: "/weather", icon: "Cloud" }
  ];

  const isActivePath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
              <ApperIcon name="Sprout" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                FarmTrack Pro
              </h1>
              <p className="text-xs text-gray-500">Agriculture Management</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  isActivePath(item.path)
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
{/* User Menu and Logout */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated && user && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Welcome, {user.firstName || user.emailAddress}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              icon="LogOut"
            >
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-40">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActivePath(item.path)
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                <ApperIcon name={item.icon} className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
))}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                icon="LogOut"
                className="w-full"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;