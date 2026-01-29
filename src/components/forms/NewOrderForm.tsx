import React, { useState } from 'react';
import { Utensils, Truck } from 'lucide-react'; // Instale: npm install lucide-react
import { SelectableGroup } from '../ui/SelectableGroup';
import { OrderSummaryModal } from '../features/admin/OrderSummaryModal';

// Tipos para facilitar a manutenção
type OrderType = 'feijoada' | 'marmita' | 'misto';

type Marmita = {
  size: string;
  protein: string;
  beanType: string;
  pasta: string;
  sideDish: string[];
  sideCutlery: string;
};

type FeijoadaItem = {
  type: string;
  kitSize: string;
  feijoadaSize: string;
  justFeijoadaSize: string;
};

export const NewOrderForm: React.FC = () => {
  // --- Estados Gerais ---
  const [clientName, setClientName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [orderType, setOrderType] = useState<OrderType>('feijoada');

  // --- Estados da Marmita ---
  const [marmitas, setMarmitas] = useState<Marmita[]>([{
    size: '',
    protein: '',
    beanType: '',
    pasta: '',
    sideDish: [],
    sideCutlery: '',
  }]);
  const [activeMarmitaIndex, setActiveMarmitaIndex] = useState(0);

  // --- Estados da Feijoada ---
  const [feijoadas, setFeijoadas] = useState<FeijoadaItem[]>([
    {
      type: '',
      kitSize: '',
      feijoadaSize: '',
      justFeijoadaSize: '',
    },
  ]);
  const [activeFeijoadaIndex, setActiveFeijoadaIndex] = useState(0);

  // --- Observação ---
  const [observation, setObservation] = useState('');

  // --- Estados do Modal de Resumo ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrderData, setCurrentOrderData] = useState<any>(null);

  // --- Modal de Erro Simples ---
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isNameMissing, setIsNameMissing] = useState(false);
  const [isPaymentMissing, setIsPaymentMissing] = useState(false);

  const updateActiveMarmita = (field: keyof Marmita, value: string | string[]) => {
    setMarmitas((prev) => {
      const next = [...prev];
      next[activeMarmitaIndex] = {
        ...next[activeMarmitaIndex],
        [field]: value,
      };
      return next;
    });
  };

  const handleAddMarmita = () => {
    setMarmitas((prev) => {
      const next = [
        ...prev,
        {
          size: '',
          protein: '',
          beanType: '',
          pasta: '',
          sideDish: [],
          sideCutlery: '',
        },
      ];
      setActiveMarmitaIndex(next.length - 1);
      return next;
    });
  };

  const handleRemoveMarmita = (index: number) => {
    setMarmitas((prev) => {
      if (prev.length === 1) return prev;
      const next = prev.filter((_, i) => i !== index);
      if (activeMarmitaIndex >= next.length) {
        setActiveMarmitaIndex(next.length - 1);
      }
      return next;
    });
  };

  const updateActiveFeijoada = (field: keyof FeijoadaItem, value: string) => {
    setFeijoadas((prev) => {
      const next = [...prev];
      const current = next[activeFeijoadaIndex] || { type: '', kitSize: '', feijoadaSize: '', justFeijoadaSize: '' };

      // Mantém a lógica de exclusividade entre kit, feijoada marmita e só feijoada
      if (field === 'kitSize') {
        next[activeFeijoadaIndex] = {
          ...current,
          kitSize: value,
          feijoadaSize: '',
          justFeijoadaSize: '',
        };
      } else if (field === 'feijoadaSize') {
        next[activeFeijoadaIndex] = {
          ...current,
          feijoadaSize: value,
          kitSize: '',
          justFeijoadaSize: '',
        };
      } else if (field === 'justFeijoadaSize') {
        next[activeFeijoadaIndex] = {
          ...current,
          justFeijoadaSize: value,
          kitSize: '',
          feijoadaSize: '',
        };
      } else {
        next[activeFeijoadaIndex] = {
          ...current,
          [field]: value,
        };
      }

      return next;
    });
  };

  const handleAddFeijoada = () => {
    setFeijoadas((prev) => {
      const next = [
        ...prev,
        {
          type: '',
          kitSize: '',
          feijoadaSize: '',
          justFeijoadaSize: '',
        },
      ];
      setActiveFeijoadaIndex(next.length - 1);
      return next;
    });
  };

  const handleRemoveFeijoada = (index: number) => {
    setFeijoadas((prev) => {
      if (prev.length === 1) return prev;
      const next = prev.filter((_, i) => i !== index);
      if (activeFeijoadaIndex >= next.length) {
        setActiveFeijoadaIndex(next.length - 1);
      }
      return next;
    });
  };

  // Função de Envio
  const handleGenerateOrder = () => {
    // Validação simples
    const nameMissing = !clientName.trim();
    const paymentMissing = !paymentMethod;

    if (nameMissing || paymentMissing) {
      setIsNameMissing(nameMissing);
      setIsPaymentMissing(paymentMissing);
      setIsErrorModalOpen(true);
      return;
    }

    // Numeração diária da COMANDA (persistida em localStorage por dia)
    let dailyOrderNumber: number | undefined;
    if (typeof window !== 'undefined') {
      const today = new Date();
      const dateKey = today.toISOString().slice(0, 10); // YYYY-MM-DD
      const storageKey = `comanda-counter-${dateKey}`;

      const currentCounter = Number(window.localStorage.getItem(storageKey) || '0');
      dailyOrderNumber = currentCounter + 1;
      window.localStorage.setItem(storageKey, String(dailyOrderNumber));
    }

    const details = orderType === 'marmita'
      ? { marmitas, observation }
      : orderType === 'feijoada'
        ? { feijoadas, observation }
        : { marmitas, feijoadas, observation };

    const orderData = {
      client: clientName,
      payment: paymentMethod || 'dinheiro',
      type: orderType,
      date: new Date().toLocaleString('pt-BR'),
      dailyOrderNumber,
      details,
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
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setOrderType('feijoada')}
            className={`w-full flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all ${
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
            className={`w-full flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all ${
              orderType === 'marmita' 
                ? 'border-teal-400 bg-teal-50 text-teal-700' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Truck className="w-8 h-8 mb-2" />
            <span className="font-medium">Marmita</span>
          </button>

          <button
            onClick={() => setOrderType('misto')}
            className={`w-full flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all ${
              orderType === 'misto'
                ? 'border-teal-400 bg-teal-50 text-teal-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-lg font-semibold mb-1">Feijoada + Marmita</span>
            <span className="text-xs text-gray-500">Mesma comanda</span>
          </button>
        </div>
      </div>

      {/* 4. Opções Dinâmicas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        
        {/* --- FORMULÁRIO MARMITA --- */}
        {(orderType === 'marmita' || orderType === 'misto') && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between gap-4 border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-800">Opções de Marmita</h3>
              <div className="flex items-center gap-2 flex-wrap">
                {marmitas.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveMarmitaIndex(index)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                      activeMarmitaIndex === index
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    Marmita {index + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleAddMarmita}
                  className="px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-teal-400 text-teal-600 hover:bg-teal-50"
                >
                  + Adicionar
                </button>
              </div>
            </div>

            {marmitas[activeMarmitaIndex] && (
              <>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Tamanho</label>
              <SelectableGroup gridCols={3} selected={marmitas[activeMarmitaIndex].size} onChange={(v) => updateActiveMarmita('size', v)}
                options={[{ label: 'P', value: 'P' }, { label: 'M', value: 'M' }, { label: 'G', value: 'G' }]} 
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Proteína</label>
              <SelectableGroup gridCols={2} selected={marmitas[activeMarmitaIndex].protein} onChange={(v) => updateActiveMarmita('protein', v)}
                options={[
                  { label: 'Do dia', value: 'do_dia' },
                  { label: 'Bife na Chapa', value: 'bife_chapa' },
                  { label: 'Bife Acebolado', value: 'bife_acebolado' },
                  { label: 'Bife a Cavalo', value: 'bife_cavalo' },
                  { label: 'Bisteca na Chapa', value: 'bisteca_chapa' },
                  { label: 'Bisteca Empanada', value: 'bisteca_empanada' },
                  { label: 'Frango na Chapa', value: 'frango_chapa' },
                  { label: 'Frango Empanado', value: 'frango_empanado' }
                ]} 
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Tipo de Feijão</label>
              <SelectableGroup
                gridCols={2}
                selected={marmitas[activeMarmitaIndex].beanType}
                onChange={(v) => updateActiveMarmita('beanType', v)}
                options={[
                  { label: 'Preto', value: 'preto' },
                  { label: 'Marrom', value: 'marrom' },
                ]}
              />
            </div>

            <div className="mt-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Macarrão</label>
                <SelectableGroup gridCols={2} selected={marmitas[activeMarmitaIndex].pasta} onChange={(v) => updateActiveMarmita('pasta', v)}
                  options={[
                    { label: 'Alho e Óleo', value: 'alho e oleo' },
                    { label: 'Da casa', value: 'da_casa' }
                  ]} 
                />
              </div>
            </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Acompanhamentos</label>
                <div className="grid grid-cols-2 gap-3">
                  {['batata_frita', 'legumes'].map((value) => {
                    const label = value === 'batata_frita' ? 'Batata Frita' : 'Legumes';
                    const current = marmitas[activeMarmitaIndex];
                    const selectedSides = current?.sideDish || [];
                    const isSelected = selectedSides.includes(value);

                    const handleToggle = () => {
                      const next = isSelected
                        ? selectedSides.filter((v) => v !== value)
                        : [...selectedSides, value];
                      updateActiveMarmita('sideDish', next);
                    };

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={handleToggle}
                        className={`
                          w-full p-3 rounded-md border text-sm font-medium transition-all
                          ${isSelected
                            ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-teal-200'
                          }
                        `}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
              <label className="talher">Talher</label>
              <SelectableGroup gridCols={2} selected={marmitas[activeMarmitaIndex].sideCutlery} onChange={(v) => updateActiveMarmita('sideCutlery', v)}
                options={[
                  { label: 'Sim', value: 'sim_talher' },
                  { label: 'Não', value: 'nao_talher' },
                ]} 
              />
            </div>

            {marmitas.length > 1 && (
              <div className="pt-2 border-t flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveMarmita(activeMarmitaIndex)}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold"
                >
                  Remover esta marmita
                </button>
              </div>
            )}

              </>
            )}

          </div>
          
        )}

        {/* --- FORMULÁRIO FEIJOADA --- */}
        {(orderType === 'feijoada' || orderType === 'misto') && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between gap-4 border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-800">Opções de Feijoada</h3>
              <div className="flex items-center gap-2 flex-wrap">
                {feijoadas.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveFeijoadaIndex(index)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                      activeFeijoadaIndex === index
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    Feijoada {index + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleAddFeijoada}
                  className="px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-teal-400 text-teal-600 hover:bg-teal-50"
                >
                  + Adicionar
                </button>
              </div>
            </div>

            {feijoadas[activeFeijoadaIndex] && (
              <>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Tipo</label>
                  <SelectableGroup
                    gridCols={2}
                    selected={feijoadas[activeFeijoadaIndex].type}
                    onChange={(v) => updateActiveFeijoada('type', v)}
                    options={[
                      { label: 'Magra', value: 'magra' },
                      { label: 'Mista', value: 'mista' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Kit Feijoada</label>
                  <SelectableGroup
                    gridCols={2}
                    selected={feijoadas[activeFeijoadaIndex].kitSize}
                    onChange={(v) => updateActiveFeijoada('kitSize', v)}
                    options={[
                      { label: 'M', value: 'M' },
                      { label: 'G', value: 'G' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Feijoada Marmita</label>
                  <SelectableGroup
                    gridCols={3}
                    selected={feijoadas[activeFeijoadaIndex].feijoadaSize}
                    onChange={(v) => updateActiveFeijoada('feijoadaSize', v)}
                    options={[
                      { label: 'P', value: 'P' },
                      { label: 'M', value: 'M' },
                      { label: 'G', value: 'G' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Só Feijoada</label>
                  <SelectableGroup
                    gridCols={3}
                    selected={feijoadas[activeFeijoadaIndex].justFeijoadaSize}
                    onChange={(v) => updateActiveFeijoada('justFeijoadaSize', v)}
                    options={[
                      { label: 'P', value: 'P' },
                      { label: 'M', value: 'M' },
                      { label: 'G', value: 'G' },
                    ]}
                  />
                </div>

                {feijoadas.length > 1 && (
                  <div className="pt-2 border-t flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveFeijoada(activeFeijoadaIndex)}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold"
                    >
                      Remover esta feijoada
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Campo de Observação (comum a qualquer tipo de pedido) */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Observação</label>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y min-h-[80px]"
          />
        </div>
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

      {/* Modal de erro */}
      {isErrorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-red-600">Ops!</h2>
            <p className="text-sm text-gray-700">
              Você precisa informar{' '}
              {isNameMissing && (
                <>
                  <span className="font-semibold">NOME DO CLIENTE</span>
                  {isPaymentMissing && ' e '}
                </>
              )}
              {isPaymentMissing && (
                <span className="font-semibold">FORMA DE PAGAMENTO</span>
              )}
              {' '}para gerar a comanda.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                onClick={() => setIsErrorModalOpen(false)}
              >
                Fechar
              </button>
              <button
                className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 hover:bg-teal-600 rounded-md"
                onClick={() => {
                  setIsErrorModalOpen(false);
                  const nameInput = document.querySelector<HTMLInputElement>('input[placeholder="Digite o nome do cliente"]');
                  const paymentButtons = document.querySelectorAll<HTMLButtonElement>('button[data-payment-option="true"]');

                  if (isNameMissing && nameInput) {
                    nameInput.focus();
                  } else if (isPaymentMissing && paymentButtons.length > 0) {
                    paymentButtons[0].focus();
                  }
                }}
              >
                Ok, entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};