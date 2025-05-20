import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({ title, value, trend, icon, iconBg, iconColor, delay, trendColor = "text-green-600" }) => {
  const TrendIcon = trend.startsWith("+") ? TrendingUp : TrendingDown;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className={`p-2 ${iconBg} rounded-lg`}>
          {React.cloneElement(icon, { className: `h-5 w-5 ${iconColor}` })}
        </div>
      </div>
      <div className="flex items-end">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span className={`ml-2 text-sm font-medium ${trendColor} flex items-center`}>
          <TrendIcon className="h-4 w-4 mr-1" />
          {trend.substring(1)}
        </span>
      </div>
    </motion.div>
  );
};

export default StatsCard;