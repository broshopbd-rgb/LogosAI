
import React from 'react';
import { GeneratedLogo } from '../types';

interface LogoCardProps {
  logo: GeneratedLogo;
  onDownload: (url: string, name: string) => void;
  onDelete: (id: string) => void;
}

export const LogoCard: React.FC<LogoCardProps> = ({ logo, onDownload, onDelete }) => {
  return (
    <div className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all duration-300">
      <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
        <img 
          src={logo.url} 
          alt={logo.prompt} 
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      
      <div className="p-4 bg-slate-800">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300 uppercase tracking-wider mb-1">
              {logo.style}
            </span>
            <p className="text-sm text-slate-300 line-clamp-2 leading-tight">
              {logo.prompt}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onDownload(logo.url, `logo-${logo.id}.png`)}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Save
          </button>
          <button 
            onClick={() => onDelete(logo.id)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
