import React from "react";

const FinanceSummary = ({ totalIngresos, totalGastos, balance, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div className="bg-slate-800 p-4 rounded-lg shadow-md">
        <h3 className="text-sm text-green-400 uppercase">Ingresos Totales</h3>
        <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIngresos)}</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg shadow-md">
        <h3 className="text-sm text-red-400 uppercase">Gastos Totales</h3>
        <p className="text-2xl font-bold text-red-400">{formatCurrency(totalGastos)}</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg shadow-md">
        <h3 className={`text-sm uppercase ${balance >= 0 ? 'text-purple-400' : 'text-orange-400'}`}>Balance</h3>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-purple-400' : 'text-orange-400'}`}>{formatCurrency(balance)}</p>
      </div>
    </div>
  );
};

export default FinanceSummary;