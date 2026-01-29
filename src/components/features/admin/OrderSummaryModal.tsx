import React, { useRef } from 'react';
import { Printer } from 'lucide-react';

interface MarmitaDetails {
  size: string;
  protein: string;
  beanType: string;
  pasta: string;
  sideDish: string | string[];
  sideCutlery: string;
}

interface FeijoadaDetailsItem {
  type: string;
  kitSize: string;
  feijoadaSize: string;
  justFeijoadaSize: string;
}

interface OrderData {
  client: string;
  payment: string;
  type: 'feijoada' | 'marmita' | 'misto';
  // details pode conter marmitas, feijoadas ou ambos, além de observation
  details: any;
  date: string;
  dailyOrderNumber?: number;
}

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: OrderData | null;
}

export const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({ isOpen, onClose, data }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

  const details: any = data.details || {};
  const hasMarmitas = Array.isArray(details.marmitas) && details.marmitas.length > 0;
  const hasFeijoadas = Array.isArray(details.feijoadas) && details.feijoadas.length > 0;
  const hasObservation = !!details.observation;

  const handlePrint = () => {
    const contentElement = printRef.current;
    if (!contentElement) return;

    const html = contentElement.innerHTML;

    const printWindow = window.open(
      '/print.html',
      '_blank',
      'width=300,height=600'
    );

    if (!printWindow) return;

    printWindow.onload = () => {
      const root = printWindow.document.getElementById('print-root');
      if (root) {
        root.innerHTML = html;
      }
      printWindow.focus();
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 300);
    };
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      
      {/* Container Branco do Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[calc(100vh-3rem)] flex flex-col overflow-hidden animate-fadeIn print:shadow-none print:w-full print:max-w-none print:max-h-none">
        
        {/* --- ÁREA IMPRESSA (ID importante para o CSS) --- */}
        <div
          id="printable-content"
          className="p-8 print:p-0 overflow-y-auto flex-1 print:overflow-visible"
          ref={printRef}
        >
          
          <div className="mb-6 print-header">
            <div className="w-12 h-12 mx-auto mb-1 flex items-center justify-center">
              <img
                src="/logo-vic.png"
                alt="Vic Marmitaria"
                className="w-full h-full object-contain rounded-md"
              />
            </div>
            <div className="title text-gray-900">VIC MARMITARIA</div>
            <div className="subtitle text-gray-600 text-xs mt-1">
              {typeof data.dailyOrderNumber === 'number'
                ? `Comanda ${String(data.dailyOrderNumber).padStart(3, '0')} · ${data.date}`
                : data.date}
            </div>
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

            {/* Renderização Dinâmica dos Detalhes (suporta marmita, feijoada ou ambos) */}
            <div className="space-y-4 text-sm text-gray-700">
              {hasMarmitas && (
                <div>
                  {details.marmitas.map((m: MarmitaDetails, index: number) => (
                    <React.Fragment key={index}>
                      <div className="border-b border-dotted border-gray-300 pb-2 mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            Marmita {index + 1}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {m.size && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-500">Tamanho:</span>
                              <span className="font-bold text-gray-800">{m.size}</span>
                            </div>
                          )}
                          {m.protein && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-500">Proteína:</span>
                              <span className="font-bold text-gray-800">{m.protein}</span>
                            </div>
                          )}
                          {m.beanType && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-500">Feijão:</span>
                              <span className="font-bold text-gray-800">{m.beanType}</span>
                            </div>
                          )}
                          {m.pasta && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-500">Macarrão:</span>
                              <span className="font-bold text-gray-800">{m.pasta}</span>
                            </div>
                          )}
                          {m.sideDish && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-500">Acompanhamentos:</span>
                              <span className="font-bold text-gray-800">
                                {Array.isArray(m.sideDish) ? m.sideDish.join(' + ') : m.sideDish}
                              </span>
                            </div>
                          )}
                          {m.sideCutlery && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-500">Talher:</span>
                              <span className="font-bold text-gray-800">{m.sideCutlery}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {index < details.marmitas.length - 1 && (
                        <div className="border-b-2 border-dashed border-gray-300 my-2" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {hasFeijoadas && (
                <div>
                  {details.feijoadas.map((f: FeijoadaDetailsItem, index: number) => (
                    <React.Fragment key={index}>
                      <div className="border-b border-dotted border-gray-300 pb-2 mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-gray-500 uppercase">Feijoada {index + 1}</span>
                        </div>
                        <div className="space-y-1">
                          {f.type && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-500">Tipo:</span>
                              <span className="font-bold text-gray-800">{f.type}</span>
                            </div>
                          )}
                          {f.kitSize && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-500">Kit Feijoada:</span>
                              <span className="font-bold text-gray-800">{f.kitSize}</span>
                            </div>
                          )}
                          {f.feijoadaSize && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-500">Feijoada Marmita:</span>
                              <span className="font-bold text-gray-800">{f.feijoadaSize}</span>
                            </div>
                          )}
                          {f.justFeijoadaSize && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-500">Só Feijoada:</span>
                              <span className="font-bold text-gray-800">{f.justFeijoadaSize}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {index < details.feijoadas.length - 1 && (
                        <div className="border-b-2 border-dashed border-gray-300 my-2" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {hasObservation && (
                <div className="border-t border-dotted border-gray-300 pt-2 mt-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Observação:</span>
                    <span className="font-bold text-gray-800 text-right max-w-[60%]">{details.observation}</span>
                  </div>
                </div>
              )}

              {!hasMarmitas && !hasFeijoadas && !hasObservation && (
                <p className="text-gray-500 italic">Nenhum item informado.</p>
              )}
            </div>
           </div>
          </div>

        {/* --- BOTÕES DE AÇÃO (Não aparecem na impressão) --- */}
        <div className="p-4 bg-gray-50 flex gap-3 print:hidden border-t border-gray-100">
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