import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit3, Share2, TrendingUp, TrendingDown, CalendarDays, Tag, Users } from "lucide-react";

const TransactionItem = ({ transaction, onDelete, onEdit, onShare, formatCurrency }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(transaction.description);
  const [editAmount, setEditAmount] = useState(transaction.amount.toString());
  const [editCategory, setEditCategory] = useState(transaction.category || "");
  const [editDate, setEditDate] = useState(transaction.date);
  const [editType, setEditType] = useState(transaction.type);

  const handleEdit = () => {
    onEdit(transaction.id, { 
      description: editDescription, 
      amount: parseFloat(editAmount), 
      category: editCategory, 
      date: editDate,
      type: editType 
    });
    setIsEditing(false);
  };

  const typeColor = transaction.type === "ingreso" ? "text-green-400" : "text-red-400";
  const typeBorderColor = transaction.type === "ingreso" ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10";
  const isSharedWithUser = transaction.shared_with_users && transaction.shared_with_users.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`p-4 rounded-lg border ${typeBorderColor} transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-md`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Descripción" className="bg-slate-700 border-slate-600" />
          <Input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} placeholder="Monto" className="bg-slate-700 border-slate-600" />
          <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} placeholder="Categoría" className="bg-slate-700 border-slate-600" />
          <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="bg-slate-700 border-slate-600" />
          <Select value={editType} onValueChange={setEditType}>
            <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-gray-200">
              <SelectItem value="ingreso">Ingreso</SelectItem>
              <SelectItem value="gasto">Gasto</SelectItem>
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
            <div>
              <p className={`text-lg font-medium ${typeColor}`}>{transaction.description}</p>
              <p className={`text-2xl font-bold ${typeColor}`}>
                {transaction.type === "ingreso" ? "+" : "-"} {formatCurrency(transaction.amount)}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                {transaction.category && <span className="flex items-center gap-1"><Tag size={12}/>{transaction.category}</span>}
                <span className="flex items-center gap-1"><CalendarDays size={12}/>{new Date(transaction.date).toLocaleDateString('es-CO')}</span>
                {isSharedWithUser && <span className="flex items-center gap-1"><Users size={12}/>Compartido</span>}
                {transaction.is_shared_finance && transaction.owner_profile && <span className="flex items-center gap-1 text-purple-400"><Users size={12}/>De: {transaction.owner_profile.name}</span>}
              </div>
            </div>
            {transaction.type === "ingreso" ? <TrendingUp className={`h-8 w-8 ${typeColor}`} /> : <TrendingDown className={`h-8 w-8 ${typeColor}`} />}
          </div>
          {!transaction.is_shared_finance && (
            <div className="flex gap-2 mt-3 justify-end">
              <Button onClick={() => setIsEditing(true)} variant="ghost" size="icon" className="text-gray-400 hover:text-purple-400 h-8 w-8"><Edit3 size={16} /></Button>
              <Button onClick={() => onShare(transaction)} variant="ghost" size="icon" className="text-gray-400 hover:text-green-400 h-8 w-8"><Share2 size={16} /></Button>
              <Button onClick={() => onDelete(transaction.id)} variant="ghost" size="icon" className="text-gray-400 hover:text-red-400 h-8 w-8"><Trash2 size={16} /></Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default TransactionItem;