import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ListChecks, Wallet, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

const SharedPage = () => {
  const { currentUser } = useAuth();
  const [sharedTasks, setSharedTasks] = useState([]);
  const [sharedFinances, setSharedFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSharedItems = async () => {
      if (!currentUser) return;
      setLoading(true);

      // Fetch tasks shared with the current user
      const { data: sharedTasksData, error: tasksError } = await supabase
        .from('shared_tasks')
        .select(`
          task:tasks!inner (
            id, text, category, priority, due_date, completed,
            owner:profiles!tasks_user_id_fkey ( name, email )
          )
        `)
        .eq('shared_with_user_id', currentUser.id);

      if (tasksError) {
        toast({ title: "Error cargando tareas compartidas", description: tasksError.message, variant: "destructive" });
      } else {
        setSharedTasks(sharedTasksData.map(item => ({...item.task, ownerName: item.task.owner?.name || 'Desconocido' })) || []);
      }

      // Fetch finances shared with the current user
      const { data: sharedFinancesData, error: financesError } = await supabase
        .from('shared_finances')
        .select(`
          finance:finances!inner (
            id, description, amount, category, date, type,
            owner:profiles!finances_user_id_fkey ( name, email )
          )
        `)
        .eq('shared_with_user_id', currentUser.id);
      
      if (financesError) {
        toast({ title: "Error cargando finanzas compartidas", description: financesError.message, variant: "destructive" });
      } else {
        setSharedFinances(sharedFinancesData.map(item => ({...item.finance, ownerName: item.finance.owner?.name || 'Desconocido'})) || []);
      }
      
      setLoading(false);
    };

    fetchSharedItems();
  }, [currentUser, toast]);


  const TaskCard = ({ task }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 p-4 rounded-lg shadow-md border border-purple-500/30"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-100"}`}>{task.text}</h3>
          <p className="text-xs text-gray-400">Categoría: {task.category || "N/A"}</p>
          <p className="text-xs text-gray-400">Prioridad: {task.priority}</p>
           {task.due_date && <p className="text-xs text-gray-400">Vence: {new Date(task.due_date).toLocaleDateString()}</p>}
        </div>
        <ListChecks className="text-purple-400" />
      </div>
      <div className="mt-2 pt-2 border-t border-slate-700 flex items-center text-xs text-gray-500">
        <UserCircle size={14} className="mr-1 text-purple-400" /> Compartido por: {task.ownerName}
      </div>
    </motion.div>
  );

  const FinanceCard = ({ finance }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-800 p-4 rounded-lg shadow-md border ${finance.type === 'ingreso' ? 'border-green-500/30' : 'border-red-500/30'}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-medium ${finance.type === 'ingreso' ? 'text-green-400' : 'text-red-400'}`}>{finance.description}</h3>
          <p className={`text-xl font-bold ${finance.type === 'ingreso' ? 'text-green-400' : 'text-red-400'}`}>
            {finance.type === 'ingreso' ? '+' : '-'} €{parseFloat(finance.amount).toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">Categoría: {finance.category || "N/A"}</p>
          <p className="text-xs text-gray-400">Fecha: {new Date(finance.date).toLocaleDateString()}</p>
        </div>
        <Wallet className={finance.type === 'ingreso' ? 'text-green-400' : 'text-red-400'} />
      </div>
      <div className="mt-2 pt-2 border-t border-slate-700 flex items-center text-xs text-gray-500">
        <UserCircle size={14} className={`mr-1 ${finance.type === 'ingreso' ? 'text-green-400' : 'text-red-400'}`} /> Compartido por: {finance.ownerName}
      </div>
    </motion.div>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-6">Contenido Compartido Contigo</h1>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-200 flex items-center">
          <ListChecks className="mr-3 text-purple-400" /> Tareas Compartidas
        </h2>
        {sharedTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sharedTasks.map(task => <TaskCard key={`task-${task.id}`} task={task} />)}
          </div>
        ) : (
          <p className="text-gray-400">Nadie ha compartido tareas contigo todavía.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-200 flex items-center">
          <Wallet className="mr-3 text-pink-500" /> Finanzas Compartidas
        </h2>
        {sharedFinances.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sharedFinances.map(finance => <FinanceCard key={`finance-${finance.id}`} finance={finance} />)}
          </div>
        ) : (
          <p className="text-gray-400">Nadie ha compartido finanzas contigo todavía.</p>
        )}
      </section>
    </motion.div>
  );
};

export default SharedPage;