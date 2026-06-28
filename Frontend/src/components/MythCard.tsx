// src/components/MythCard.tsx
import React from "react";
import { Heart, MapPin, ChevronRight } from "lucide-react";
import type { Myth } from "../types";

interface MythCardProps {
  myth: Myth;
  isFav: boolean;
  onToggleFavorite: (id: string) => void;
  onExplore: (myth: Myth) => void;
}

export default function MythCard({ myth, isFav, onToggleFavorite, onExplore }: MythCardProps) {
  return (
    <div
      id={`myth-card-${myth.id}`}
      className="group relative bg-[#141414df] border border-white/5 hover:border-gold/30 rounded-lg overflow-hidden p-6 flex flex-col justify-between hover:shadow-[0_0_20px_rgba(197,160,89,0.08)] transition-all duration-300 transform hover:-translate-y-1"
    >
      <div>
        {/* Upper Badges & Heart */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-2.5 py-0.5 rounded-sm text-[9px] font-mono tracking-widest uppercase bg-[#080808] border border-white/5 text-gold">
            {myth.category}
          </span>
          
          <button
            id={`card-favorite-btn-${myth.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(myth.id);
            }}
            className={`p-1.5 rounded-sm border transition-all ${
              isFav
                ? "bg-red-950/20 border-red-500/25 text-red-400"
                : "bg-[#080808] border-white/5 text-slate-500 hover:text-gold"
            }`}
            title={isFav ? "Quitar de guardados" : "Guardar en bitácora"}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Image Thumbnail */}
        <div className="h-44 w-full bg-[#0a0a0a] rounded-sm overflow-hidden mb-4 relative border border-white/5">
          <img
            src={myth.imageUrl}
            alt={myth.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 mix-blend-luminosity group-hover:mix-blend-normal"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 to-transparent"></div>
          <div className="absolute bottom-2 left-2 flex items-center space-x-1.5 text-[9px] text-slate-300 bg-[#080808]/80 px-2 py-1 rounded-sm border border-white/5 uppercase tracking-wider font-mono">
            <MapPin className="w-3 h-3 text-gold" />
            <span>{myth.origin}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-cinzel text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors tracking-wide">
          {myth.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-slate-400 line-clamp-3 mb-6 leading-relaxed font-inter">
          {myth.summary}
        </p>
      </div>

      {/* Action button */}
      <button
        id={`card-view-btn-${myth.id}`}
        onClick={() => onExplore(myth)}
        className="w-full py-2.5 border border-gold/30 text-gold hover:bg-gold hover:text-[#080808] text-xs font-semibold uppercase tracking-wider transition-all rounded-sm flex items-center justify-center space-x-1"
      >
        <span>Explorar Relato</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}