
import React from 'react';
import { LOGO_STYLES } from '../constants';
import { LogoStyle } from '../types';

interface StylePickerProps {
  selected: LogoStyle;
  onSelect: (style: LogoStyle) => void;
}

export const StylePicker: React.FC<StylePickerProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
      {LOGO_STYLES.map((style) => (
        <button
          key={style.name}
          onClick={() => onSelect(style.name as LogoStyle)}
          className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col gap-2 ${
            selected === style.name
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-700 bg-slate-800 hover:border-slate-600'
          }`}
        >
          <span className="text-2xl">{style.icon}</span>
          <div>
            <div className="font-semibold text-sm">{style.name}</div>
            <div className="text-xs text-slate-400 line-clamp-1">{style.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
};
