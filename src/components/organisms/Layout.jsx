import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Header from "./Header";

const Layout = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;