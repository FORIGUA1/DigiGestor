import React from "react";
import { motion } from "framer-motion";

const SalesByCategoryChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;
  const colors = ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Ventas por Categoría</h3>
        <select className="text-sm border rounded-md px-2 py-1 bg-white text-gray-700">
          <option>Este Mes</option>
          <option>Mes Anterior</option>
        </select>
      </div>
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {data.map((item, index) => {
            const percent = (item.value / total) * 100;
            const startAngle = cumulativePercent * 3.6;
            cumulativePercent += percent;
            const endAngle = cumulativePercent * 3.6;
            const startX = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
            const startY = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
            const endX = 50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180));
            const endY = 50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180));
            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
            const pathData = `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
            return (
              <motion.path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}
        </svg>
      </div>
      <div className="mt-6 space-y-2">
        {data.map((category, index) => (
          <div key={index} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></div>
            <span className="text-sm text-gray-600">{category.name}</span>
            <span className="ml-auto text-sm font-medium">{category.value}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SalesByCategoryChart;