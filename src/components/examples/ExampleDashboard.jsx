import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  LineChart as LineChartIcon, 
  PieChart as PieChartLucide, 
  Activity, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Bell,
  Search,
  Menu,
  User,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import SalesChart from "@/components/dashboard/SalesChart";
import VisitorsChart from "@/components/dashboard/VisitorsChart";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import SalesByCategoryChart from "@/components/dashboard/SalesByCategoryChart";
import TopProductsTable from "@/components/dashboard/TopProductsTable";


const salesData = [
  { month: "Ene", value: 4500 }, { month: "Feb", value: 5200 }, { month: "Mar", value: 4800 },
  { month: "Abr", value: 5800 }, { month: "May", value: 6000 }, { month: "Jun", value: 6500 },
  { month: "Jul", value: 7000 }, { month: "Ago", value: 7200 }, { month: "Sep", value: 6800 },
  { month: "Oct", value: 7500 }, { month: "Nov", value: 8000 }, { month: "Dic", value: 8500 }
];

const visitorData = [
  { month: "Ene", value: 1200 }, { month: "Feb", value: 1400 }, { month: "Mar", value: 1800 },
  { month: "Abr", value: 1600 }, { month: "May", value: 2000 }, { month: "Jun", value: 2200 },
  { month: "Jul", value: 2400 }, { month: "Ago", value: 2600 }, { month: "Sep", value: 2800 },
  { month: "Oct", value: 3000 }, { month: "Nov", value: 3200 }, { month: "Dic", value: 3400 }
];

const categoryData = [
  { name: "Electrónica", value: 35 }, { name: "Ropa", value: 25 }, { name: "Hogar", value: 20 },
  { name: "Deportes", value: 15 }, { name: "Otros", value: 5 }
];

const recentOrders = [
  { id: "#ORD-001", customer: "Juan Pérez", date: "15 May 2025", amount: 125.99, status: "Completado" },
  { id: "#ORD-002", customer: "María García", date: "14 May 2025", amount: 89.50, status: "Procesando" },
  { id: "#ORD-003", customer: "Carlos López", date: "14 May 2025", amount: 245.00, status: "Completado" },
  { id: "#ORD-004", customer: "Ana Martínez", date: "13 May 2025", amount: 65.75, status: "Enviado" },
  { id: "#ORD-005", customer: "Roberto Sánchez", date: "12 May 2025", amount: 189.99, status: "Completado" }
];

const topProducts = [
  { name: "Smartphone XYZ", sales: 245, revenue: 122500 },
  { name: "Laptop Pro 15", sales: 189, revenue: 283500 },
  { name: "Auriculares Inalámbricos", sales: 312, revenue: 31200 },
  { name: "Smartwatch Series 5", sales: 156, revenue: 31200 }
];


const ExampleDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>
            <p className="text-gray-600">Bienvenido de nuevo, Admin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard title="Ventas Totales" value="€24,780" trend="+12.5%" icon={<DollarSign />} iconBg="bg-green-100" iconColor="text-green-600" delay={0} />
            <StatsCard title="Nuevos Clientes" value="1,482" trend="+8.2%" icon={<Users />} iconBg="bg-blue-100" iconColor="text-blue-600" delay={0.1} />
            <StatsCard title="Pedidos" value="856" trend="+4.9%" icon={<ShoppingCart />} iconBg="bg-purple-100" iconColor="text-purple-600" delay={0.2} />
            <StatsCard title="Ingresos" value="€18,245" trend="-2.4%" icon={<Activity />} iconBg="bg-amber-100" iconColor="text-amber-600" delay={0.3} trendColor="text-red-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SalesChart data={salesData} />
            <VisitorsChart data={visitorData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentOrdersTable orders={recentOrders} />
            <SalesByCategoryChart data={categoryData} />
          </div>
          
          <TopProductsTable products={topProducts} />
        </main>
      </div>
    </div>
  );
};

export default ExampleDashboard;