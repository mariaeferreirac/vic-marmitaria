import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface SelectableGroupProps {
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
  gridCols?: number;
}

export const SelectableGroup: React.FC<SelectableGroupProps> = ({ 
  options, 
  selected, 
  onChange,
  gridCols = 2
}) => {
  const gridColsClass =
    gridCols === 1 ? 'grid-cols-1' :
    gridCols === 2 ? 'grid-cols-2' :
    gridCols === 3 ? 'grid-cols-3' :
    gridCols === 4 ? 'grid-cols-4' :
    'grid-cols-2';

  return (
    <div className={`grid ${gridColsClass} gap-3`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`
            w-full p-3 rounded-md border text-sm font-medium transition-all
            ${selected === opt.value 
              ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' 
              : 'border-gray-200 bg-white text-gray-600 hover:border-teal-200'
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};