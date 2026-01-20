import React from 'react';
import { NewOrderForm } from '../../../components/forms/NewOrderForm';
// Importe seu layout aqui se estiver usando um wrapper global ou use o AdminLayout diretamente
// import { AdminLayout } from '../../../layouts/AdminLayout';

export const NewOrderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Cabeçalho da Página */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
          {/* Logo ou Ícone placeholder */}
          SP
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Pedidos</h1>
          <p className="text-gray-500 text-sm">Gestão de comandas</p>
        </div>
      </div>

      {/* Renderiza o formulário */}
      <NewOrderForm />
    </div>
  );
};