import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ListChecks, Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
  const { currentUser } = useAuth();
  const userName = currentUser?.profile?.name || currentUser?.email;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Bienvenido, <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{userName}</span>!
      </h1>
      <p className="text-xl text-gray-300 mb-8">Organiza tu vida y tus finanzas en un solo lugar.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Link to="/tasks">
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(168, 85, 247, 0.3), 0 4px 6px -2px rgba(168, 85, 247, 0.2)" }}
            className="bg-slate-800 p-8 rounded-xl shadow-lg cursor-pointer"
          >
            <ListChecks size={48} className="mx-auto mb-4 text-purple-400" />
            <h2 className="text-2xl font-semibold mb-2">Gestionar Tareas</h2>
            <p className="text-gray-400">Crea, organiza y comparte tus tareas pendientes.</p>
          </motion.div>
        </Link>
        <Link to="/finances">
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(236, 72, 153, 0.3), 0 4px 6px -2px rgba(236, 72, 153, 0.2)" }}
            className="bg-slate-800 p-8 rounded-xl shadow-lg cursor-pointer"
          >
            <Wallet size={48} className="mx-auto mb-4 text-pink-500" />
            <h2 className="text-2xl font-semibold mb-2">Controlar Finanzas</h2>
            <p className="text-gray-400">Lleva un registro de tus gastos e ingresos.</p>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default HomePage;