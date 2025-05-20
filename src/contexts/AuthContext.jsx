import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async (userId) => {
    if (!userId) return null;
    // Damos un pequeño respiro para que el trigger pueda actuar
    // await new Promise(resolve => setTimeout(resolve, 500)); 

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // PGRST116: No rows found. Esto es esperado si el trigger aún no ha creado el perfil.
      // Podríamos reintentar o simplemente devolver null. Por ahora, devolvemos null.
      console.warn(`Profile not found for user ${userId}. Trigger might be pending or failed.`);
      return null;
    } else if (error) {
      console.error('Error fetching profile:', error);
      toast({ title: "Error obteniendo perfil", description: `Detalle: ${error.message}`, variant: "destructive" });
      return null; 
    }
    return profile || null;
  }, [toast]);

  useEffect(() => {
    setLoading(true);
    const getSessionAndProfile = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        setLoading(false);
        return;
      }

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setCurrentUser({ ...session.user, profile });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setCurrentUser({ ...session.user, profile });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Error de inicio de sesión", description: error.message, variant: "destructive" });
      return false;
    }
    if (data.user && !data.user.email_confirmed_at) {
        toast({ title: "Confirmación Requerida", description: "Por favor, confirma tu correo electrónico antes de iniciar sesión.", variant: "default", duration: 7000 });
        await supabase.auth.signOut(); 
        return false;
    }
    // El perfil se cargará a través de onAuthStateChange
    toast({ title: "Inicio de sesión exitoso" });
    return true;
  };

  const register = async (name, email, password) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name } // Importante para que el trigger handle_new_user pueda acceder al nombre
      }
    });

    if (authError) {
      toast({ title: "Error de registro", description: authError.message, variant: "destructive" });
      return false;
    }
    
    // Ya no intentamos el upsert desde el cliente. Confiamos en el trigger de Supabase.
    // El trigger 'handle_new_user' (SECURITY DEFINER) debería crear la entrada en 'profiles'.
    // onAuthStateChange se activará y llamará a fetchUserProfile para obtener los datos.
    
    if (authData.user) {
      toast({ title: "Registro exitoso", description: "Por favor revisa tu correo para confirmar tu cuenta. Serás redirigido." });
      return true; 
    }
    return false;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Error al cerrar sesión", description: error.message, variant: "destructive" });
      return;
    }
    setCurrentUser(null);
    toast({ title: "Sesión cerrada" });
  };

  const updateProfile = async (name, email) => {
    if (!currentUser || !currentUser.id) {
        toast({ title: "Error", description: "Usuario no autenticado.", variant: "destructive" });
        return false;
    }

    const userUpdates = {};
    if (email && email !== currentUser.email) {
      userUpdates.email = email;
    }

    if (Object.keys(userUpdates).length > 0) {
      const { data: updatedAuthUser, error: userError } = await supabase.auth.updateUser(userUpdates);
      if (userError) {
        toast({ title: "Error actualizando email en auth", description: userError.message, variant: "destructive" });
        return false;
      }
      if (updatedAuthUser && updatedAuthUser.user) {
         setCurrentUser(prev => ({ ...prev, ...updatedAuthUser.user, profile: prev?.profile ? { ...prev.profile, email: updatedAuthUser.user.email } : null }));
      }
    }
    
    const profileDataToUpdate = {
        name: name || currentUser.profile?.name,
        email: userUpdates.email || currentUser.email, 
        updated_at: new Date().toISOString()
    };

    const { data: updatedProfile, error: profileError } = await supabase
      .from('profiles')
      .update(profileDataToUpdate)
      .eq('id', currentUser.id)
      .select()
      .single();

    if (profileError) {
      toast({ title: "Error actualizando perfil en DB", description: profileError.message, variant: "destructive" });
      return false;
    }
    
    setCurrentUser(prev => ({ 
      ...prev, 
      profile: updatedProfile 
    }));
    toast({ title: "Perfil actualizado" });
    return true;
  };

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Error actualizando contraseña", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Contraseña actualizada" });
    return true;
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;