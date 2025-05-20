import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen flex flex-col items-center justify-center text-center p-4"
    >
      <AlertTriangle className="h-24 w-24 text-yellow-400 mb-8 animate-pulse" />
      <motion.h1 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        className="text-6xl font-bold text-gray-100 mb-4"
      >
        404
      </motion.h1>
      <p className="text-2xl text-gray-300 mb-8">
        ¡Ups! Parece que te has perdido en el universo digital.
      </p>
      <p className="text-gray-400 mb-8 max-w-md">
        La página que buscas no existe o ha sido movida. No te preocupes, puedes volver al inicio.
      </p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 text-lg">
          <Link to="/">Volver al Inicio</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;