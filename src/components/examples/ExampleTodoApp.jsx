import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Circle, Trash2, Plus, Star, StarOff } from "lucide-react";

const ExampleTodoApp = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Crear diseño de página web", completed: true, priority: "alta" },
    { id: 2, text: "Reunión con cliente a las 14:00", completed: false, priority: "alta" },
    { id: 3, text: "Revisar correos electrónicos", completed: false, priority: "media" },
    { id: 4, text: "Actualizar redes sociales", completed: false, priority: "baja" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("media");
  const [filter, setFilter] = useState("todas");
  const { toast } = useToast();

  const addTask = () => {
    if (newTask.trim() === "") {
      toast({
        title: "Error",
        description: "La tarea no puede estar vacía",
        variant: "destructive",
      });
      return;
    }

    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      priority: priority,
    };

    setTasks([...tasks, task]);
    setNewTask("");
    toast({
      title: "Tarea añadida",
      description: "La tarea se ha añadido correctamente",
    });
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast({
      title: "Tarea eliminada",
      description: "La tarea se ha eliminado correctamente",
    });
  };

  const togglePriority = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const newPriority = 
            task.priority === "baja" ? "media" : 
            task.priority === "media" ? "alta" : "baja";
          
          return { ...task, priority: newPriority };
        }
        return task;
      })
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "todas") return true;
    if (filter === "pendientes") return !task.completed;
    if (filter === "completadas") return task.completed;
    if (filter === "alta") return task.priority === "alta";
    if (filter === "media") return task.priority === "media";
    if (filter === "baja") return task.priority === "baja";
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "alta": return "text-red-500";
      case "media": return "text-amber-500";
      case "baja": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">Lista de Tareas</h2>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Añadir nueva tarea..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === "Enter" && addTask()}
            />
            
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="baja">Prioridad Baja</option>
              <option value="media">Prioridad Media</option>
              <option value="alta">Prioridad Alta</option>
            </select>
            
            <Button onClick={addTask} className="flex items-center gap-2">
              <Plus size={18} />
              <span>Añadir</span>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-b">
            <Button 
              variant={filter === "todas" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("todas")}
            >
              Todas
            </Button>
            <Button 
              variant={filter === "pendientes" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("pendientes")}
            >
              Pendientes
            </Button>
            <Button 
              variant={filter === "completadas" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("completadas")}
            >
              Completadas
            </Button>
            <Button 
              variant={filter === "alta" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("alta")}
              className="text-red-500"
            >
              Prioridad Alta
            </Button>
            <Button 
              variant={filter === "media" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("media")}
              className="text-amber-500"
            >
              Prioridad Media
            </Button>
            <Button 
              variant={filter === "baja" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("baja")}
              className="text-green-500"
            >
              Prioridad Baja
            </Button>
          </div>

          <div className="divide-y">
            <AnimatePresence>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleComplete(task.id)}
                        className="focus:outline-none"
                      >
                        {task.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400" />
                        )}
                      </button>
                      <span
                        className={`flex-1 ${
                          task.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePriority(task.id)}
                        className={`focus:outline-none ${getPriorityColor(task.priority)}`}
                        title={`Prioridad ${task.priority}`}
                      >
                        {task.priority === "alta" ? (
                          <Star className="h-5 w-5 fill-current" />
                        ) : task.priority === "media" ? (
                          <Star className="h-5 w-5" />
                        ) : (
                          <StarOff className="h-5 w-5" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No hay tareas que mostrar
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExampleTodoApp;