import React from "react";
import { motion } from "framer-motion";

const VisitorsChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (item.value / maxValue) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Visitantes</h3>
        <select className="text-sm border rounded-md px-2 py-1 bg-white text-gray-700">
          <option>Este Año</option>
          <option>Año Anterior</option>
        </select>
      </div>
      <div className="relative h-[200px] w-full">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.polyline
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
            points={points}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600">
          {data.filter((_, i) => i % 3 === 0).map((item, index) => (
            <div key={index}>{item.month}</div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default VisitorsChart;