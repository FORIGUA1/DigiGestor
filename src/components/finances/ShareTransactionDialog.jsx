import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

const ShareTransactionDialog = ({ isOpen, onClose, transaction, availableUsers, onShareSuccess }) => {
  const [shareWithUserId, setShareWithUserId] = useState("");
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleShareTransaction = async () => {
    if (!transaction || !shareWithUserId) {
      toast({ title: "Error", description: "Selecciona una transacción y un usuario.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from('shared_finances').insert({
      finance_id: transaction.id,
      owner_id: currentUser.id,
      shared_with_user_id: shareWithUserId
    });

    if (error) {
      if (error.code === '23505') { 
        toast({ title: "Información", description: "Esta transacción ya está compartida con este usuario." });
      } else {
        toast({ title: "Error compartiendo transacción", description: error.message, variant: "destructive" });
      }
    } else {
      const targetUser = availableUsers.find(u => u.id === shareWithUserId);
      toast({ title: "Transacción compartida", description: `Has compartido la transacción con ${targetUser?.name || 'el usuario'}.` });
      if (onShareSuccess) onShareSuccess();
    }
    setShareWithUserId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-gray-200">
        <DialogHeader>
          <DialogTitle>Compartir Transacción: {transaction?.description}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Selecciona un usuario para compartir esta transacción.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select value={shareWithUserId} onValueChange={setShareWithUserId}>
            <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder="Seleccionar usuario..." /></SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-gray-200">
              {availableUsers.map(user => (
                <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleShareTransaction} className="bg-purple-600 hover:bg-purple-700">Compartir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTransactionDialog;