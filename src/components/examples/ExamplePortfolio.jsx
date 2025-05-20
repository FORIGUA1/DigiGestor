import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, GitCommit as GitHub, Linkedin, Twitter, Menu, X } from 'lucide-react';

const ExamplePortfolio = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "Aplicación de Gestión de Tareas",
      category: "desarrollo web",
      image: "todo-app",
      description: "Una aplicación web completa para gestionar tareas con autenticación de usuarios, categorías y recordatorios.",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      link: "#"
    },
    {
      id: 2,
      title: "Tienda Online de Moda",
      category: "ecommerce",
      image: "ecommerce",
      description: "Plataforma de comercio electrónico con catálogo de productos, carrito de compras y pasarela de pagos.",
      technologies: ["React", "Next.js", "Stripe", "Tailwind CSS"],
      link: "#"
    },
    {
      id: 3,
      title: "Aplicación Móvil de Fitness",
      category: "desarrollo móvil",
      image: "fitness-app",
      description: "Aplicación móvil para seguimiento de entrenamientos, nutrición y progreso físico.",
      technologies: ["React Native", "Firebase", "Redux", "Expo"],
      link: "#"
    },
    {
      id: 4,
      title: "Dashboard Analítico",
      category: "desarrollo web",
      image: "dashboard",
      description: "Panel de control interactivo para visualización de datos empresariales con gráficos y reportes.",
      technologies: ["Vue.js", "D3.js", "Node.js", "PostgreSQL"],
      link: "#"
    },
    {
      id: 5,
      title: "Rediseño de Sitio Web Corporativo",
      category: "diseño ui/ux",
      image: "website",
      description: "Rediseño completo de un sitio web corporativo con enfoque en experiencia de usuario y conversión.",
      technologies: ["Figma", "HTML/CSS", "JavaScript", "WordPress"],
      link: "#"
    },
    {
      id: 6,
      title: "Aplicación de Reservas de Restaurantes",
      category: "desarrollo web",
      image: "restaurant-app",
      description: "Sistema de reservas online para restaurantes con gestión de mesas y menús.",
      technologies: ["React", "Firebase", "Styled Components", "Node.js"],
      link: "#"
    }
  ];

  const skills = [
    { name: "Desarrollo Frontend", level: 90 },
    { name: "Desarrollo Backend", level: 80 },
    { name: "Diseño UI/UX", level: 85 },
    { name: "Desarrollo Móvil", level: 75 },
    { name: "Bases de Datos", level: 70 },
    { name: "DevOps", level: 65 }
  ];

  const filteredProjects = activeTab === "todos" 
    ? projects 
    : projects.filter(project => project.category === activeTab);

  const openProjectDetails = (project) => {
    setSelectedProject(project);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  const getProjectImage = (imageName) => {
    switch (imageName) {
      case "todo-app":
        return (
          <img  alt="Interfaz de aplicación de gestión de tareas" src="https://images.unsplash.com/photo-1608403810239-ac22e2c3bac7" />
        );
      case "ecommerce":
        return (
          <img  alt="Tienda online de moda con productos" src="https://images.unsplash.com/photo-1524346522913-2599c428a1be" />
        );
      case "fitness-app":
        return (
          <img  alt="Aplicación móvil de fitness" src="https://images.unsplash.com/photo-1532288744908-b37abee2ed71" />
        );
      case "dashboard":
        return (
          <img  alt="Dashboard analítico con gráficos" src="https://images.unsplash.com/photo-1625296276703-3fbc924f07b5" />
        );
      case "website":
        return (
          <img  alt="Sitio web corporativo moderno" src="https://images.unsplash.com/photo-1688362806592-68f09d35af1f" />
        );
      case "restaurant-app":
        return (
          <img  alt="Aplicación de reservas de restaurantes" src="https://images.unsplash.com/photo-1515693421389-81c6ff3e4ea6" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-purple-700"
            >
              Carlos Martínez
            </motion.div>
            
            <div className="hidden md:flex space-x-6">
              <NavLink href="#inicio" label="Inicio" />
              <NavLink href="#proyectos" label="Proyectos" />
              <NavLink href="#habilidades" label="Habilidades" />
              <NavLink href="#contacto" label="Contacto" />
            </div>
            
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                <MobileNavLink 
                  href="#inicio" 
                  label="Inicio" 
                  onClick={() => setMobileMenuOpen(false)} 
                />
                <MobileNavLink 
                  href="#proyectos" 
                  label="Proyectos" 
                  onClick={() => setMobileMenuOpen(false)} 
                />
                <MobileNavLink 
                  href="#habilidades" 
                  label="Habilidades" 
                  onClick={() => setMobileMenuOpen(false)} 
                />
                <MobileNavLink 
                  href="#contacto" 
                  label="Contacto" 
                  onClick={() => setMobileMenuOpen(false)} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                Hola, soy <span className="text-purple-700">Carlos</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-medium mb-6 text-gray-600">
                Desarrollador Web & Diseñador UI/UX
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Creo experiencias digitales atractivas y funcionales que ayudan a las empresas a crecer y destacar en el mundo digital.
              </p>
              <div className="flex space-x-4">
                <Button className="bg-purple-700 hover:bg-purple-800">
                  Ver Proyectos
                </Button>
                <Button variant="outline">
                  Contactar
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-1/2 flex justify-center"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img  alt="Foto de perfil de Carlos Martínez" src="https://images.unsplash.com/photo-1675495667069-d18d7d78eeb2" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="proyectos" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Mis Proyectos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Una selección de mis trabajos más recientes en desarrollo web, diseño UI/UX y aplicaciones móviles.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <FilterButton 
              active={activeTab === "todos"} 
              onClick={() => setActiveTab("todos")}
            >
              Todos
            </FilterButton>
            <FilterButton 
              active={activeTab === "desarrollo web"} 
              onClick={() => setActiveTab("desarrollo web")}
            >
              Desarrollo Web
            </FilterButton>
            <FilterButton 
              active={activeTab === "diseño ui/ux"} 
              onClick={() => setActiveTab("diseño ui/ux")}
            >
              Diseño UI/UX
            </FilterButton>
            <FilterButton 
              active={activeTab === "desarrollo móvil"} 
              onClick={() => setActiveTab("desarrollo móvil")}
            >
              Desarrollo Móvil
            </FilterButton>
            <FilterButton 
              active={activeTab === "ecommerce"} 
              onClick={() => setActiveTab("ecommerce")}
            >
              E-commerce
            </FilterButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                onClick={() => openProjectDetails(project)}
              >
                <div className="h-48 overflow-hidden">
                  {getProjectImage(project.image)}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{project.title}</h3>
                  <p className="text-sm text-purple-600 mb-4 uppercase tracking-wider">
                    {project.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="habilidades" className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Mis Habilidades</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              He adquirido experiencia en diversas tecnologías y metodologías a lo largo de mi carrera profesional.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-gray-800">{skill.name}</h3>
                  <span className="text-purple-700">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-purple-600 h-2.5 rounded-full"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Contacto</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ¿Tienes un proyecto en mente? Estoy disponible para trabajar en nuevos proyectos y colaboraciones.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 bg-white p-8 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold mb-6 text-gray-800">Envíame un mensaje</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Cuéntame sobre tu proyecto..."
                  ></textarea>
                </div>
                
                <Button className="w-full bg-purple-700 hover:bg-purple-800">
                  Enviar Mensaje
                </Button>
              </form>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 bg-white p-8 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold mb-6 text-gray-800">Información de Contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-purple-700 mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800">Email</h4>
                    <p className="text-gray-600">carlos.martinez@ejemplo.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 text-purple-700 mr-4 mt-1 flex items-center justify-center">
                    📍
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Ubicación</h4>
                    <p className="text-gray-600">Madrid, España</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Redes Sociales</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-purple-700 transition-colors">
                      <GitHub className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-purple-700 transition-colors">
                      <Linkedin className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-purple-700 transition-colors">
                      <Twitter className="h-6 w-6" />
                    </a>
                  </div>
                </div>
                
                <div className="pt-6 mt-6 border-t">
                  <h4 className="font-medium text-gray-800 mb-3">Disponibilidad</h4>
                  <p className="text-gray-600 mb-4">
                    Actualmente disponible para proyectos freelance y colaboraciones a tiempo parcial.
                  </p>
                  <div className="flex items-center">
                    <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm text-green-600 font-medium">Disponible para nuevos proyectos</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-bold text-purple-400">Carlos Martínez</span>
              <p className="mt-2 text-gray-400">Desarrollador Web & Diseñador UI/UX</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <GitHub className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Carlos Martínez. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={closeProjectDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-64 md:h-80 overflow-hidden relative">
                {getProjectImage(selectedProject.image)}
                <button
                  onClick={closeProjectDetails}
                  className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{selectedProject.title}</h3>
                <p className="text-sm text-purple-600 mb-6 uppercase tracking-wider">
                  {selectedProject.category}
                </p>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3 text-gray-800">Descripción</h4>
                  <p className="text-gray-600">{selectedProject.description}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3 text-gray-800">Tecnologías</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    className="bg-purple-700 hover:bg-purple-800 flex items-center gap-2"
                    onClick={() => window.open(selectedProject.link, "_blank")}
                  >
                    <span>Ver Proyecto</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavLink = ({ href, label }) => (
  <a 
    href={href} 
    className="text-gray-600 hover:text-purple-700 font-medium transition-colors"
  >
    {label}
  </a>
);

const MobileNavLink = ({ href, label, onClick }) => (
  <a 
    href={href} 
    className="text-gray-600 hover:text-purple-700 font-medium transition-colors py-2 border-b border-gray-100"
    onClick={onClick}
  >
    {label}
  </a>
);

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full transition-colors ${
      active 
        ? "bg-purple-700 text-white" 
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

export default ExamplePortfolio;