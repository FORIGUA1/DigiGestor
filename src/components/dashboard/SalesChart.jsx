import React from "react";
import { motion } from "framer-motion";

const SalesChart = ({ data }) => {
  const maxHeight = 150;
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Ventas Mensuales</h3>
        <select className="text-sm border rounded-md px-2 py-1 bg-white text-gray-700">
          <option>Este Año</option>
          <option>Año Anterior</option>
        </select>
      </div>
      <div className="flex items-end h-[200px] gap-2">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * maxHeight;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ duration: 1, delay: index * 0.05 }}
                className="w-full bg-indigo-500 rounded-t-sm"
              ></motion.div>
              <div className="text-xs mt-2 text-gray-600">{item.month}</div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SalesChart;