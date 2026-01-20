import React, { useRef } from 'react';
import { X, Printer } from 'lucide-react';

interface OrderData {
  client: string;
  payment: string;
  type: 'feijoada' | 'marmita';
  details: any;
  date: string;
}

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: OrderData | null;
}

export const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({ isOpen, onClose, data }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    // A mágica da impressão acontece via CSS global (ver passo 3), 
    // mas chamamos a função nativa do navegador aqui.
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      
      {/* Container Branco do Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fadeIn print:shadow-none print:w-full print:max-w-none">
        
        {/* --- ÁREA IMPRESSA (ID importante para o CSS) --- */}
        <div id="printable-content" className="p-8 print:p-0" ref={printRef}>
          
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">COMANDA</h2>
            <p className="text-sm text-gray-500 mt-1">{data.date}</p>
          </div>

          {/* Divisor Tracejado */}
          <div className="border-b-2 border-dashed border-gray-300 my-4"></div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Cliente</span>
              <p className="text-lg font-medium text-gray-800">{data.client || 'Cliente não identificado'}</p>
            </div>

            <div>
              <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Forma de Pagamento</span>
              <p className="text-lg font-medium text-gray-800 capitalize">{data.payment}</p>
            </div>
          </div>

          <div className="border-b-2 border-dashed border-gray-300 my-6"></div>

          <div className="bg-gray-50 p-4 rounded-md print:bg-transparent print:p-0">
            <span className="text-xs text-gray-400 uppercase font-bold block mb-3">Pedido</span>
            
            <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase">
              {data.type}
            </h3>

            {/* Renderização Dinâmica dos Detalhes */}
            <div className="space-y-2 text-sm text-gray-700">
              {Object.entries(data.details).map(([key, value]) => {
                // Filtra campos vazios
                if (!value) return null;
                
                // Formata labels (ex: beanType -> Feijão)
                const labelMap: Record<string, string> = {
                  size: 'Tamanho',
                  protein: 'Proteína',
                  beanType: 'Feijão',
                  sideDish: 'Acompanhamentos',
                  kit: 'Kit',
                  type: 'Tipo',
                  normal: 'Feijoada',
                  only: 'Só Feijoada'
                };

                return (
                  <div key={key} className="flex justify-between items-end border-b border-dotted border-gray-300 pb-1">
                    <span className="font-medium text-gray-500">{labelMap[key] || key}:</span>
                    <span className="font-bold text-gray-800 text-right">{String(value)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
           {/* Rodapé da impressão (pode ser uma mensagem de agradecimento) */}
           <div className="hidden print:block mt-8 text-center text-xs text-gray-400">
              <p>Obrigado pela preferência!</p>
              <p>www.seurestaurante.com.br</p>
           </div>
        </div>

        {/* --- BOTÕES DE AÇÃO (Não aparecem na impressão) --- */}
        <div className="p-6 bg-gray-50 flex gap-3 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Printer size={18} />
            Imprimir
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};