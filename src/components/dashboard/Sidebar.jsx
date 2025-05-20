import React from "react";
import { Button } from "@/components/ui/button";
import { Activity, BarChart, Users, ShoppingCart, User, Settings, HelpCircle, LogOut } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { name: "overview", label: "Resumen", icon: Activity },
    { name: "analytics", label: "Analíticas", icon: BarChart },
    { name: "customers", label: "Clientes", icon: Users },
    { name: "orders", label: "Pedidos", icon: ShoppingCart },
  ];

  const secondaryNavItems = [
    { name: "profile", label: "Perfil", icon: User },
    { name: "settings", label: "Configuración", icon: Settings },
    { name: "help", label: "Ayuda", icon: HelpCircle },
  ];

  return (
    <aside className="hidden md:block w-64 bg-white h-[calc(100vh-64px)] shadow-sm">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.name}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === item.name ? "bg-indigo-50 text-indigo-600" : ""}`}
                onClick={() => setActiveTab(item.name)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 pt-8 border-t">
          <ul className="space-y-2">
            {secondaryNavItems.map(item => (
              <li key={item.name}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              </li>
            ))}
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Cerrar Sesión
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;