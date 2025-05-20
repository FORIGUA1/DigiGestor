import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { UserPlus, User, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Renombrado de loading a isSubmitting
  const navigate = useNavigate();
  const { register, currentUser, loading: authLoading } = useAuth(); // authLoading es el loading general del contexto
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, rellena todos los campos.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    const success = await register(name, email, password);
    setIsSubmitting(false);
    if (success) {
       // El toast de "Revisa tu correo" ya se muestra desde AuthContext
       setTimeout(() => {
         navigate("/login"); 
       }, 3000); // Dar tiempo para leer el toast antes de redirigir
    }
  };

  // Si el usuario ya está logueado (y no es por un registro en curso), redirigir
  if (currentUser && !authLoading && !isSubmitting) { 
    return <Navigate to="/" replace />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" // Asegurar fondo consistente
    >
      <div className="w-full max-w-md">
        <div className="bg-slate-800/70 backdrop-blur-lg shadow-2xl rounded-xl p-8 space-y-6">
          <div className="text-center">
            <motion.h1 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-2"
            >
              Crear Cuenta en DigiGestor
            </motion.h1>
            <p className="text-gray-400">Organiza tus tareas y finanzas fácilmente.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-gray-300">Nombre Completo</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 bg-slate-700 border-slate-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Tu nombre"
                  disabled={isSubmitting || authLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">Correo Electrónico</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-slate-700 border-slate-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="tu@email.com"
                  disabled={isSubmitting || authLoading}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 bg-slate-700 border-slate-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="•••••••• (mínimo 6 caracteres)"
                  disabled={isSubmitting || authLoading}
                />
              </div>
            </div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3" disabled={isSubmitting || authLoading}>
                {(isSubmitting || authLoading) ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <UserPlus size={18} className="mr-2" />
                )}
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </Button>
            </motion.div>
          </form>
          
          <p className="text-center text-sm text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;