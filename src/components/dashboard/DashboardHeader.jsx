import React from "react";
import { Bell, Search, Menu } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <Menu className="h-6 w-6 text-gray-500 mr-4 md:hidden" />
          <h1 className="text-xl font-bold text-indigo-600">AdminDashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <button className="relative p-2 text-gray-500 hover:text-indigo-600 focus:outline-none">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
            AS
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;