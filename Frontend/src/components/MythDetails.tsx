// src/components/MythDetails.tsx
import React from "react";
import { X, ShieldAlert, MapPin, Tag } from "lucide-react";
import type { Myth } from "../types";

interface MythDetailsProps {
  myth: Myth | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isLoggedIn: boolean;
  onAuthPrompt: () => void;
}

export default function MythDetails({
  myth,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  isLoggedIn,
  onAuthPrompt,
}: MythDetailsProps) {
  if (!isOpen || !myth) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Contenedor del Modal */}
      <div className="relative w-full max-w-2xl bg-[#121212] border border-gold/30 rounded-lg overflow-hidden max-h-[90vh] flex flex-col shadow-[0_0_30px_rgba(197,160,89,0.15)]">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-sm bg-[#080808]/60 border border-white/5 text-slate-400 hover:text-gold transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Imagen de Cabecera */}
        <div className="relative h-56 w-full flex-shrink-0 bg-[#0a0a0a] border-b border-white/5">
          <img
            src={myth.imageUrl}
            alt={myth.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
          
          <div className="absolute bottom-4 left-6 space-y-1">
            <span className="px-2.5 py-0.5 rounded-sm text-[9px] font-mono tracking-widest uppercase bg-gold/10 border border-gold/30 text-gold">
              {myth.category}
            </span>
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-white tracking-wide uppercase">
              {myth.title}
            </h2>
          </div>
        </div>

        {/* Contenido Deslizable */}
        <div className="p-6 overflow-y-auto space-y-6 font-inter text-sm text-slate-300 leading-relaxed">
          
          {/* Fila de Datos Rápidos */}
          <div className="grid grid-cols-2 gap-4 bg-[#181818] p-4 rounded-sm border border-white/5 text-xs">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
              <div>
                <p className="text-slate-500 uppercase tracking-wider font-mono text-[10px]">Procedencia</p>
                <p className="text-slate-200 font-semibold">{myth.origin}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-gold flex-shrink-0" />
              <div>
                <p className="text-slate-500 uppercase tracking-wider font-mono text-[10px]">Nivel de Peligro</p>
                <p className={`font-semibold ${
                  myth.dangerLevel === "Extremo" || myth.dangerLevel === "Alto" 
                    ? "text-red-400" 
                    : "text-green-400"
                }`}>{myth.dangerLevel}</p>
              </div>
            </div>
          </div>

          {/* Relato Completo */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-xs font-bold tracking-widest text-gold uppercase">El Relato Ancestral</h4>
            <p className="whitespace-pre-line text-slate-300">{myth.content}</p>
          </div>

          {/* Etiquetas / Tags */}
          <div className="pt-4 border-t border-white/5">
            <div className="flex flex-wrap gap-1.5 items-center">
              <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
              {myth.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-[#080808] border border-white/5 rounded-sm text-[10px] text-slate-400 font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Barra de Acciones Inferior */}
        <div className="p-4 bg-[#080808] border-t border-white/5 flex items-center justify-between flex-shrink-0">
          <button
            onClick={isLoggedIn ? onToggleFavorite : onAuthPrompt}
            className={`px-4 py-2 rounded-sm border text-xs font-semibold uppercase tracking-wider transition-all ${
              isFavorite
                ? "bg-red-950/20 border-red-500/30 text-red-400 hover:bg-transparent"
                : "border-gold/40 text-gold hover:bg-gold/10"
            }`}
          >
            {isFavorite ? "Quitar de la Bitácora" : "Añadir a mis Saberes"}
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cerrar Lectura
          </button>
        </div>

      </div>
    </div>
  );
}