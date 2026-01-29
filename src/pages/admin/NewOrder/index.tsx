import React from 'react';
import { NewOrderForm } from '../../../components/forms/NewOrderForm';
// Importe seu layout aqui se estiver usando um wrapper global ou use o AdminLayout diretamente
// import { AdminLayout } from '../../../layouts/AdminLayout';

export const NewOrderPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Cabeçalho da Página */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center gap-3">
        <div className="w-14 h-14 flex items-center justify-center">
          {/* Logo Vic Marmitaria (arquivo em public/logo-vic.png) */}
          <img
            src="/logo-vic.png"
            alt="Vic Marmitaria"
            className="w-full h-full object-contain rounded-md"
          />
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