import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ListChecks, Wallet, Share2, UserCircle, Settings, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return null; 
  }
  
  const userName = currentUser.profile?.name || currentUser.email;

  return (
    <nav className="bg-slate-800/50 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
            >
              DigiGestor
            </motion.div>
          </Link>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink icon={<Home size={18}/>} to="/">Inicio</NavLink>
              <NavLink icon={<ListChecks size={18}/>} to="/tasks">Tareas</NavLink>
              <NavLink icon={<Wallet size={18}/>} to="/finances">Finanzas</NavLink>
              <NavLink icon={<Share2 size={18}/>} to="/shared">Compartido</NavLink>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 group relative">
              <Button variant="ghost" className="flex items-center space-x-2">
                <UserCircle size={20} />
                <span>{userName}</span>
              </Button>
              <div className="absolute right-0 mt-12 w-48 bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none group-hover:pointer-events-auto">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white">
                  <Settings size={16} className="inline mr-2" /> Perfil
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300"
                >
                  <LogOut size={16} className="inline mr-2" /> Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Button variant="ghost" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink icon={<Home size={18}/>} to="/" onClick={() => setMenuOpen(false)}>Inicio</MobileNavLink>
              <MobileNavLink icon={<ListChecks size={18}/>} to="/tasks" onClick={() => setMenuOpen(false)}>Tareas</MobileNavLink>
              <MobileNavLink icon={<Wallet size={18}/>} to="/finances" onClick={() => setMenuOpen(false)}>Finanzas</MobileNavLink>
              <MobileNavLink icon={<Share2 size={18}/>} to="/shared" onClick={() => setMenuOpen(false)}>Compartido</MobileNavLink>
              <MobileNavLink icon={<UserCircle size={18}/>} to="/profile" onClick={() => setMenuOpen(false)}>Perfil</MobileNavLink>
              <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-slate-700" onClick={() => { logout(); setMenuOpen(false); }}>
                <LogOut size={18} className="mr-2"/> Cerrar Sesión
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ to, children, icon }) => (
  <Link
    to={to}
    className="text-gray-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
  >
    {icon} {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick, icon }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-gray-300 hover:bg-slate-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 transition-colors"
  >
    {icon} {children}
  </Link>
);

export default Navbar;