import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const renderStatus = (status) => {
  let color;
  switch (status) {
    case "Completado": color = "bg-green-100 text-green-800"; break;
    case "Procesando": color = "bg-blue-100 text-blue-800"; break;
    case "Enviado": color = "bg-purple-100 text-purple-800"; break;
    case "Cancelado": color = "bg-red-100 text-red-800"; break;
    default: color = "bg-gray-100 text-gray-800";
  }
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{status}</span>;
};

const RecentOrdersTable = ({ orders }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Pedidos Recientes</h3>
        <Button variant="outline" size="sm">Ver Todos</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Importe</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{order.customer}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{order.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">€{order.amount.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm">{renderStatus(order.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentOrdersTable;