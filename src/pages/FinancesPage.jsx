import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import TransactionItem from "@/components/finances/TransactionItem";
import ShareTransactionDialog from "@/components/finances/ShareTransactionDialog";
import FinanceSummary from "@/components/finances/FinanceSummary";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const FinancesPage = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState("gasto");
  
  const [filterType, setFilterType] = useState("todos");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMonth, setFilterMonth] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);

  const [transactionToShare, setTransactionToShare] = useState(null);
  const [availableUsersToShare, setAvailableUsersToShare] = useState([]);

  const { toast } = useToast();

  const fetchFinances = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);

    const { data: ownedFinancesData, error: ownedError } = await supabase
      .from('finances')
      .select(`
        *,
        shared_with_users:shared_finances(shared_with_user_id)
      `)
      .eq('user_id', currentUser.id);

    if (ownedError) {
      toast({ title: "Error cargando finanzas", description: ownedError.message, variant: "destructive" });
    }

    const { data: sharedFinancesRecords, error: sharedError } = await supabase
      .from('shared_finances')
      .select(`
        finance_id,
        owner_id,
        finances (
          *,
          owner_profile:profiles (id, name, email)
        )
      `)
      .eq('shared_with_user_id', currentUser.id);

    if (sharedError) {
      toast({ title: "Error cargando finanzas compartidas", description: sharedError.message, variant: "destructive" });
    }

    const combinedFinances = [];
    if (ownedFinancesData) {
      combinedFinances.push(...ownedFinancesData.map(f => ({...f, is_shared_finance: false})));
    }
    if (sharedFinancesRecords) {
       const formattedSharedFinances = sharedFinancesRecords.map(record => ({
        ...record.finances,
        id: record.finances.id,
        is_shared_finance: true,
        owner_id: record.owner_id,
        owner_profile: record.finances.owner_profile
      }));
      combinedFinances.push(...formattedSharedFinances);
    }
    
    const uniqueFinances = Array.from(new Map(combinedFinances.map(finance => [finance.id, finance])).values());
    
    setTransactions(uniqueFinances.map(t => ({...t, amount: parseFloat(t.amount) })) || []);
    setLoading(false);
  }, [currentUser, toast]);

  useEffect(() => {
    fetchFinances();
  }, [fetchFinances]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email')
        .neq('id', currentUser.id);

      if (error) {
        toast({ title: "Error cargando usuarios", description: error.message, variant: "destructive" });
      } else {
        setAvailableUsersToShare(data || []);
      }
    };
    fetchUsers();
  }, [currentUser, toast]);

  const handleAddTransaction = async () => {
    if (description.trim() === "" || amount.trim() === "") {
      toast({ title: "Error", description: "Descripción y monto son requeridos.", variant: "destructive" });
      return;
    }
    const transactionData = {
      user_id: currentUser.id,
      description,
      amount: parseFloat(amount),
      category: category || null,
      date,
      type,
    };
    const { data: newTransaction, error } = await supabase.from('finances').insert(transactionData).select().single();
    if (error) {
      toast({ title: "Error añadiendo transacción", description: error.message, variant: "destructive" });
    } else if (newTransaction) {
      setTransactions(prev => [...prev, {...newTransaction, amount: parseFloat(newTransaction.amount), is_shared_finance: false, shared_with_users: []}]);
      setDescription("");
      setAmount("");
      setCategory("");
      toast({ title: "Transacción añadida", description: "Tu nueva transacción ha sido registrada." });
    }
  };

  const handleDeleteTransaction = async (id) => {
    const { error } = await supabase.from('finances').delete().eq('id', id);
    if (error) {
      toast({ title: "Error eliminando transacción", description: error.message, variant: "destructive" });
    } else {
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({ title: "Transacción eliminada" });
    }
  };

  const handleEditTransaction = async (id, updatedProps) => {
    const { error } = await supabase.from('finances').update(updatedProps).eq('id', id);
    if (error) {
      toast({ title: "Error actualizando transacción", description: error.message, variant: "destructive" });
    } else {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedProps, amount: parseFloat(updatedProps.amount) } : t));
      toast({ title: "Transacción actualizada" });
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const typeMatch = filterType === "todos" || t.type === filterType;
    const categoryMatch = filterCategory === "" || (t.category && t.category.toLowerCase().includes(filterCategory.toLowerCase()));
    const monthMatch = filterMonth === "todos" || new Date(t.date).toISOString().slice(0, 7) === filterMonth;
    return typeMatch && categoryMatch && monthMatch;
  });

  const totalIngresos = filteredTransactions.filter(t => t.type === "ingreso").reduce((sum, t) => sum + t.amount, 0);
  const totalGastos = filteredTransactions.filter(t => t.type === "gasto").reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIngresos - totalGastos;

  const categoriesList = [...new Set(transactions.map(t => t.category).filter(Boolean))];
  const months = [...new Set(transactions.map(t => new Date(t.date).toISOString().slice(0, 7)))].sort().reverse();

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div></div>;
  }
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Mis Finanzas</h1>
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
              <Label htmlFor="filter-type" className="text-sm text-gray-400">Tipo</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="filter-type" className="bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-gray-200">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ingreso">Ingresos</SelectItem>
                  <SelectItem value="gasto">Gastos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-month" className="text-sm text-gray-400">Mes</Label>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger id="filter-month" className="bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-gray-200">
                  <SelectItem value="todos">Todos</SelectItem>
                  {months.map(month => <SelectItem key={month} value={month}>{new Date(month + '-02').toLocaleString('es-CO', { month: 'long', year: 'numeric' })}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-category-fin" className="text-sm text-gray-400">Categoría</Label>
              <Input 
                id="filter-category-fin"
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

      <FinanceSummary totalIngresos={totalIngresos} totalGastos={totalGastos} balance={balance} formatCurrency={formatCurrency} />

      <div className="bg-slate-800 p-6 rounded-lg shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">Nueva Transacción</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" className="bg-slate-700 border-slate-600 md:col-span-2" />
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Monto (COP $)" className="bg-slate-700 border-slate-600" />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-gray-200">
              <SelectItem value="gasto">Gasto</SelectItem>
              <SelectItem value="ingreso">Ingreso</SelectItem>
            </SelectContent>
          </Select>
          <Input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoría (opcional)" className="bg-slate-700 border-slate-600" list="finance-category-suggestions" />
          <datalist id="finance-category-suggestions">
            {categoriesList.map(cat => <option key={cat} value={cat} />)}
          </datalist>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-slate-700 border-slate-600" />
        </div>
        <Button onClick={handleAddTransaction} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3">
          <Plus size={18} className="mr-2" /> Añadir Transacción
        </Button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(transaction => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
                onShare={setTransactionToShare}
                formatCurrency={formatCurrency}
              />
            ))
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 py-8"
            >
              No hay transacciones que mostrar. ¡Empieza añadiendo algunas!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <ShareTransactionDialog
        isOpen={!!transactionToShare}
        onClose={() => setTransactionToShare(null)}
        transaction={transactionToShare}
        availableUsers={availableUsersToShare}
        onShareSuccess={fetchFinances}
      />

    </motion.div>
  );
};

export default FinancesPage;