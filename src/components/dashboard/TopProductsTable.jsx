import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const TopProductsTable = ({ products }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-6 bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Productos Más Vendidos</h3>
        <Button variant="outline" size="sm">Ver Informe</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Ventas</th>
              <th className="px-4 py-3">Ingresos</th>
              <th className="px-4 py-3">Conversión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{product.sales} unidades</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">€{product.revenue.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (product.sales / 350) * 100)}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TopProductsTable;