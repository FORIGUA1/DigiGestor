import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, Edit3, Share2, Filter, Star, StarOff, CalendarDays, Tag, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit, onShare }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editCategory, setEditCategory] = useState(task.category || "");
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.due_date || "");

  const handleEdit = () => {
    onEdit(task.id, { text: editText, category: editCategory, priority: editPriority, due_date: editDueDate });
    setIsEditing(false);
  };

  const priorityColors = {
    baja: "border-green-500/50 bg-green-500/10 text-green-400",
    media: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
    alta: "border-red-500/50 bg-red-500/10 text-red-400",
  };
  
  const isSharedWithUser = task.shared_with_users && task.shared_with_users.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`p-4 rounded-lg border ${priorityColors[task.priority]} ${task.completed ? "opacity-60" : ""} transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-md`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="bg-slate-700 border-slate-600" />
          <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} placeholder="Categoría" className="bg-slate-700 border-slate-600" />
          <Input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="bg-slate-700 border-slate-600" />
          <Select value={editPriority} onValueChange={setEditPriority}>
            <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder="Prioridad" /></SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-gray-200">
              <SelectItem value="baja">Baja</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={handleEdit} size="sm" className="bg-purple-600 hover:bg-purple-700">Guardar</Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">Cancelar</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => onToggleComplete(task.id, !task.completed)}
                className="mt-1 border-slate-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
              />
              <div>
                <Label htmlFor={`task-${task.id}`} className={`text-lg font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-100"}`}>
                  {task.text}
                </Label>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  {task.category && <span className="flex items-center gap-1"><Tag size={12}/>{task.category}</span>}
                  {task.due_date && <span className="flex items-center gap-1"><CalendarDays size={12}/>{new Date(task.due_date).toLocaleDateString()}</span>}
                  {isSharedWithUser && <span className="flex items-center gap-1"><Users size={12}/>Compartido</span>}
                  {task.is_shared_task && task.owner_profile && <span className="flex items-center gap-1 text-purple-400"><Users size={12}/>De: {task.owner_profile.name}</span>}

                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {task.priority === "alta" && <Star size={16} className="text-red-400 fill-red-400" />}
              {task.priority === "media" && <Star size={16} className="text-yellow-400" />}
              {task.priority === "baja" && <StarOff size={16} className="text-green-400" />}
            </div>
          </div>
          {!task.is_shared_task && (
            <div className="flex gap-2 mt-3 justify-end">
              <Button onClick={() => setIsEditing(true)} variant="ghost" size="icon" className="text-gray-400 hover:text-purple-400 h-8 w-8"><Edit3 size={16} /></Button>
              <Button onClick={() => onShare(task)} variant="ghost" size="icon" className="text-gray-400 hover:text-green-400 h-8 w-8"><Share2 size={16} /></Button>
              <Button onClick={() => onDelete(task.id)} variant="ghost" size="icon" className="text-gray-400 hover:text-red-400 h-8 w-8"><Trash2 size={16} /></Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

const TasksPage = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("media");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [filterPriority, setFilterPriority] = useState("todas");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [filterCategory, setFilterCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [taskToShare, setTaskToShare] = useState(null);
  const [shareWithUserId, setShareWithUserId] = useState("");
  const [availableUsersToShare, setAvailableUsersToShare] = useState([]);

  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!currentUser) return;
    setLoading(true);
    
    // Fetch tasks owned by the current user
    const { data: ownedTasksData, error: ownedError } = await supabase
      .from('tasks')
      .select(`
        *,
        shared_with_users:shared_tasks(shared_with_user_id)
      `)
      .eq('user_id', currentUser.id);

    if (ownedError) {
      toast({ title: "Error cargando tareas", description: ownedError.message, variant: "destructive" });
    }

    // Fetch tasks shared with the current user
    const { data: sharedTasksRecords, error: sharedError } = await supabase
      .from('shared_tasks')
      .select(`
        task_id,
        owner_id,
        tasks (
          *,
          owner_profile:profiles (id, name, email)
        )
      `)
      .eq('shared_with_user_id', currentUser.id);

    if (sharedError) {
      toast({ title: "Error cargando tareas compartidas", description: sharedError.message, variant: "destructive" });
    }
    
    const combinedTasks = [];
    if (ownedTasksData) {
      combinedTasks.push(...ownedTasksData.map(t => ({...t, is_shared_task: false})));
    }
    if (sharedTasksRecords) {
      const formattedSharedTasks = sharedTasksRecords.map(record => ({
        ...record.tasks,
        id: record.tasks.id, 
        is_shared_task: true,
        owner_id: record.owner_id,
        owner_profile: record.tasks.owner_profile
      }));
      combinedTasks.push(...formattedSharedTasks);
    }
    
    // Remove duplicates by task ID, prioritizing owned tasks if a task is both owned and shared (though this shouldn't happen with correct logic)
    const uniqueTasks = Array.from(new Map(combinedTasks.map(task => [task.id, task])).values());

    setTasks(uniqueTasks || []);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchTasks();
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email')
        .neq('id', currentUser.id); // Exclude current user

      if (error) {
        toast({ title: "Error cargando usuarios", description: error.message, variant: "destructive" });
      } else {
        setAvailableUsersToShare(data || []);
      }
    };
    fetchUsers();
  }, [currentUser]);


  const handleAddTask = async () => {
    if (newTaskText.trim() === "") {
      toast({ title: "Error", description: "La tarea no puede estar vacía.", variant: "destructive" });
      return;
    }
    const taskData = {
      user_id: currentUser.id,
      text: newTaskText,
      category: newTaskCategory || null,
      priority: newTaskPriority,
      due_date: newTaskDueDate || null,
      completed: false,
    };
    const { data, error } = await supabase.from('tasks').insert(taskData).select().single();
    if (error) {
      toast({ title: "Error añadiendo tarea", description: error.message, variant: "destructive" });
    } else if (data) {
      setTasks(prevTasks => [...prevTasks, {...data, is_shared_task: false, shared_with_users: []}]);
      setNewTaskText("");
      setNewTaskCategory("");
      setNewTaskDueDate("");
      toast({ title: "Tarea añadida", description: "Tu nueva tarea ha sido creada." });
    }
  };

  const handleToggleComplete = async (id, completed) => {
    const { error } = await supabase.from('tasks').update({ completed }).eq('id', id);
    if (error) {
      toast({ title: "Error actualizando tarea", description: error.message, variant: "destructive" });
    } else {
      setTasks(prevTasks => prevTasks.map(task => task.id === id ? { ...task, completed } : task));
    }
  };

  const handleDeleteTask = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      toast({ title: "Error eliminando tarea", description: error.message, variant: "destructive" });
    } else {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      toast({ title: "Tarea eliminada", description: "La tarea ha sido eliminada." });
    }
  };

  const handleEditTask = async (id, updatedProps) => {
    const { error } = await supabase.from('tasks').update(updatedProps).eq('id', id);
    if (error) {
      toast({ title: "Error actualizando tarea", description: error.message, variant: "destructive" });
    } else {
      setTasks(prevTasks => prevTasks.map(task => task.id === id ? { ...task, ...updatedProps } : task));
      toast({ title: "Tarea actualizada", description: "Los cambios en la tarea han sido guardados." });
    }
  };

 const handleShareTask = async () => {
    if (!taskToShare || !shareWithUserId) {
      toast({ title: "Error", description: "Selecciona una tarea y un usuario para compartir.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from('shared_tasks').insert({
      task_id: taskToShare.id,
      owner_id: currentUser.id,
      shared_with_user_id: shareWithUserId
    });

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast({ title: "Información", description: "Esta tarea ya está compartida con este usuario." });
      } else {
        toast({ title: "Error compartiendo tarea", description: error.message, variant: "destructive" });
      }
    } else {
      // Optimistically update UI or refetch
      const targetUser = availableUsersToShare.find(u => u.id === shareWithUserId);
      toast({ title: "Tarea compartida", description: `Has compartido "${taskToShare.text}" con ${targetUser?.name || 'el usuario'}.` });
      fetchTasks(); // Refetch to get updated sharing info
    }
    setTaskToShare(null);
    setShareWithUserId("");
  };


  const filteredTasks = tasks.filter(task => {
    const priorityMatch = filterPriority === "todas" || task.priority === filterPriority;
    const statusMatch = filterStatus === "todas" || (filterStatus === "completadas" && task.completed) || (filterStatus === "pendientes" && !task.completed);
    const categoryMatch = filterCategory === "" || (task.category && task.category.toLowerCase().includes(filterCategory.toLowerCase()));
    return priorityMatch && statusMatch && categoryMatch;
  });

  const categories = [...new Set(tasks.map(task => task.category).filter(Boolean))];

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Mis Tareas</h1>
        <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="flex items-center gap-2">
          <Filter size={16} /> {showFilters ? "Ocultar" : "Mostrar"} Filtros
        </Button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800 p-4 rounded-lg shadow-md space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4"
          >
            <div>
              <Label htmlFor="filter-priority" className="text-sm text-gray-400">Prioridad</Label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger id="filter-priority" className="bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-gray-200">
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-status" className="text-sm text-gray-400">Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger id="filter-status" className="bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-gray-200">
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="pendientes">Pendientes</SelectItem>
                  <SelectItem value="completadas">Completadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-category" className="text-sm text-gray-400">Categoría</Label>
              <Input 
                id="filter-category"
                type="text" 
                placeholder="Buscar por categoría..." 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-700 border-slate-600" 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-800 p-6 rounded-lg shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">Nueva Tarea</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Descripción de la tarea"
            className="bg-slate-700 border-slate-600 md:col-span-2"
          />
          <Input
            type="text"
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value)}
            placeholder="Categoría (opcional)"
            className="bg-slate-700 border-slate-600"
            list="category-suggestions"
          />
          <datalist id="category-suggestions">
            {categories.map(cat => <option key={cat} value={cat} />)}
          </datalist>

          <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
            <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder="Prioridad" /></SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-gray-200">
              <SelectItem value="baja">Baja</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <Label htmlFor="due-date" className="text-sm text-gray-400">Fecha Límite (opcional)</Label>
            <Input
              id="due-date"
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="bg-slate-700 border-slate-600"
            />
          </div>
          <Button onClick={handleAddTask} className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3">
            <Plus size={18} className="mr-2" /> Añadir Tarea
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
                onShare={setTaskToShare}
              />
            ))
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 py-8"
            >
              No hay tareas que coincidan con tus filtros, ¡o quizás es hora de añadir algunas!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={!!taskToShare} onOpenChange={() => setTaskToShare(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-gray-200">
          <DialogHeader>
            <DialogTitle>Compartir Tarea: {taskToShare?.text}</DialogTitle>
            <DialogDescription className="text-gray-400">
              Selecciona un usuario para compartir esta tarea.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={shareWithUserId} onValueChange={setShareWithUserId}>
              <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder="Seleccionar usuario..." /></SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-gray-200">
                {availableUsersToShare.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleShareTask} className="bg-purple-600 hover:bg-purple-700">Compartir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
};

export default TasksPage;