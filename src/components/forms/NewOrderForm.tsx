import React, { useState } from 'react';
import { Utensils, Truck } from 'lucide-react'; // Instale: npm install lucide-react
import { SelectableGroup } from '../ui/SelectableGroup';
import { OrderSummaryModal } from '../features/admin/OrderSummaryModal';

// Tipos para facilitar a manutenção
type PaymentMethod = 'pix' | 'credito' | 'debito' | 'dinheiro';
type OrderType = 'feijoada' | 'marmita';

export const NewOrderForm: React.FC = () => {
  // --- Estados Gerais ---
  const [clientName, setClientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [orderType, setOrderType] = useState<OrderType>('feijoada');

  // --- Estados da Marmita ---
  const [marmitaSize, setMarmitaSize] = useState('');
  const [protein, setProtein] = useState('');
  const [beanType, setBeanType] = useState('');
  const [sideDish, setSideDish] = useState('');

  // --- Estados da Feijoada ---
  const [feijoadaType, setFeijoadaType] = useState('');
  const [kitSize, setKitSize] = useState('');
  const [feijoadaSize, setFeijoadaSize] = useState('');
  const [justFeijoadaSize, setJustFeijoadaSize] = useState('');

  // --- Estados do Modal de Resumo ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrderData, setCurrentOrderData] = useState<any>(null);

  // Função de Envio
  const handleGenerateOrder = () => {
    // Validação simples
    if (!clientName) {
      alert('Digite o nome do cliente');
      return;
    }

    const orderData = {
      client: clientName,
      payment: paymentMethod || 'dinheiro',
      type: orderType,
      date: new Date().toLocaleString('pt-BR'),
      details: orderType === 'marmita'
        ? { size: marmitaSize, protein, beanType, sideDish }
        : { type: feijoadaType, kit: kitSize, normal: feijoadaSize, only: justFeijoadaSize }
    };

    setCurrentOrderData(orderData);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* 1. Nome do Cliente */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Cliente</label>
        <input
          type="text"
          placeholder="Digite o nome do cliente"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* 2. Forma de Pagamento */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-4">Forma de Pagamento</label>
        <SelectableGroup 
          gridCols={2}
          selected={paymentMethod}
          onChange={setPaymentMethod}
          options={[
            { label: 'Pix', value: 'pix' },
            { label: 'Crédito', value: 'credito' },
            { label: 'Débito', value: 'debito' },
            { label: 'Dinheiro', value: 'dinheiro' },
          ]}
        />
      </div>

      {/* 3. Tipo de Pedido (Toggle Principal) */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-4">Tipo de Pedido</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setOrderType('feijoada')}
            className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all ${
              orderType === 'feijoada' 
                ? 'border-teal-400 bg-teal-50 text-teal-700' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Utensils className="w-8 h-8 mb-2" />
            <span className="font-medium">Feijoada</span>
          </button>

          <button
            onClick={() => setOrderType('marmita')}
            className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all ${
              orderType === 'marmita' 
                ? 'border-teal-400 bg-teal-50 text-teal-700' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Truck className="w-8 h-8 mb-2" />
            <span className="font-medium">Marmita</span>
          </button>
        </div>
      </div>

      {/* 4. Opções Dinâmicas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        
        {/* --- FORMULÁRIO MARMITA --- */}
        {orderType === 'marmita' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Opções de Marmita</h3>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Tamanho</label>
              <SelectableGroup gridCols={3} selected={marmitaSize} onChange={setMarmitaSize}
                options={[{ label: 'P', value: 'P' }, { label: 'M', value: 'M' }, { label: 'G', value: 'G' }]} 
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Proteína</label>
              <SelectableGroup gridCols={2} selected={protein} onChange={setProtein}
                options={[
                  { label: 'Estrogonofe', value: 'estrogonofe' },
                  { label: 'Bife na Chapa', value: 'bife_chapa' },
                  { label: 'Bife Acebolado', value: 'bife_acebolado' },
                  { label: 'Bife com Ovo', value: 'bife_ovo' },
                ]} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm text-gray-600 mb-2">Tipo de Feijão</label>
                  <SelectableGroup gridCols={2} selected={beanType} onChange={setBeanType}
                    options={[{ label: 'Preto', value: 'preto' }, { label: 'Marrom', value: 'marrom' }]} 
                  />
               </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Acompanhamentos</label>
              <SelectableGroup gridCols={3} selected={sideDish} onChange={setSideDish}
                options={[
                  { label: 'Macarrão', value: 'macarrao' },
                  { label: 'Batata', value: 'batata' },
                  { label: 'Legumes', value: 'legumes' },
                ]} 
              />
            </div>
          </div>
        )}

        {/* --- FORMULÁRIO FEIJOADA --- */}
        {orderType === 'feijoada' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Opções de Feijoada</h3>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Tipo</label>
              <SelectableGroup gridCols={2} selected={feijoadaType} onChange={setFeijoadaType}
                options={[{ label: 'Magra', value: 'magra' }, { label: 'Mista', value: 'mista' }]} 
              />
            </div>

            {/* Note: Nos prints parece que Kit, Feijoada e Só Feijoada são opções mutuamente exclusivas 
                OU tamanhos diferentes para categorias diferentes. Vou assumir seleção única por linha aqui */}
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Kit Feijoada</label>
              <SelectableGroup gridCols={2} selected={kitSize} onChange={(v) => {setKitSize(v); setFeijoadaSize(''); setJustFeijoadaSize('')}}
                options={[{ label: 'M', value: 'M' }, { label: 'G', value: 'G' }]} 
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Feijoada (Prato)</label>
              <SelectableGroup gridCols={3} selected={feijoadaSize} onChange={(v) => {setFeijoadaSize(v); setKitSize(''); setJustFeijoadaSize('')}}
                options={[{ label: 'P', value: 'P' }, { label: 'M', value: 'M' }, { label: 'G', value: 'G' }]} 
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Só Feijoada (Guarnição)</label>
              <SelectableGroup gridCols={3} selected={justFeijoadaSize} onChange={(v) => {setJustFeijoadaSize(v); setKitSize(''); setFeijoadaSize('')}}
                options={[{ label: 'P', value: 'P' }, { label: 'M', value: 'M' }, { label: 'G', value: 'G' }]} 
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. Botão de Ação */}
      <button
        onClick={handleGenerateOrder}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-lg shadow-md transition-colors text-lg"
      >
        Gerar Comanda
      </button>

      <OrderSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={currentOrderData}
      />
    </div>
  );
};