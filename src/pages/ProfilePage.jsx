import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Lock, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const { currentUser, updateProfile, updatePassword } = useAuth();
  const [name, setName] = useState(currentUser?.profile?.name || currentUser?.email || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const { toast } = useToast();

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    await updateProfile(name, email);
    setLoadingProfile(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (password === "") {
        toast({ title: "Error de Contraseña", description: "La nueva contraseña no puede estar vacía.", variant: "destructive" });
        return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Error de Contraseña", description: "Las contraseñas no coinciden.", variant: "destructive" });
      return;
    }
    setLoadingPassword(true);
    const success = await updatePassword(password);
    setLoadingPassword(false);
    if (success) {
      setPassword("");
      setConfirmPassword("");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
        Configuración de Perfil
      </h1>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 p-6 rounded-lg shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Información Personal</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <Label htmlFor="profile-name" className="text-gray-300">Nombre</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                disabled={loadingProfile}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="profile-email" className="text-gray-300">Correo Electrónico</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                disabled={loadingProfile}
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold" disabled={loadingProfile}>
            {loadingProfile ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : <Save size={18} className="mr-2" />}
            Guardar Cambios
          </Button>
        </form>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 p-6 rounded-lg shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Cambiar Contraseña</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <Label htmlFor="new-password" className="text-gray-300">Nueva Contraseña</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                placeholder="••••••••"
                disabled={loadingPassword}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="confirm-password" className="text-gray-300">Confirmar Nueva Contraseña</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                placeholder="••••••••"
                disabled={loadingPassword}
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold" disabled={loadingPassword}>
             {loadingPassword ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : <Save size={18} className="mr-2" />}
            Cambiar Contraseña
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;