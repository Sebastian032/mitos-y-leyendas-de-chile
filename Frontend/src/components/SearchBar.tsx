/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent, MouseEvent } from "react";
import { CoreService } from "../services/api";
import { Search, ArrowRight, History, Flame, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchBar({ onSearch, initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Load search logs on mount or focus
  const loadSearchData = () => {
    setRecentSearches(CoreService.getRecentSearches());
    setPopularSearches(CoreService.getPopularSearches());
  };

  useEffect(() => {
    loadSearchData();
  }, [isFocused]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      CoreService.addRecentSearch(trimmed);
    }
    onSearch(trimmed);
    setIsFocused(false);
  };

  const handleSelectTerm = (term: string) => {
    setQuery(term);
    CoreService.addRecentSearch(term);
    onSearch(term);
    setIsFocused(false);
  };

  const handleClearRecent = (e: MouseEvent) => {
    e.stopPropagation();
    CoreService.clearRecentSearches();
    setRecentSearches([]);
  };

  return (
    <div 
      id="search-bar-container" 
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto"
    >
      {/* SEARCH FORM */}
      <form 
        onSubmit={handleSubmit}
        className={`relative flex items-center bg-[#101010df] border rounded-lg transition-all duration-300 shadow-2xl ${
          isFocused 
            ? "border-gold ring-2 ring-gold/10 shadow-[0_0_20px_rgba(197,160,89,0.15)] bg-[#121212]" 
            : "border-gold/30 hover:border-gold/50"
        }`}
      >
        <div className="pl-5 pr-2 py-4 flex items-center text-gold">
          <Search className="w-5 h-5 opacity-70" />
        </div>

        <input
          id="search-input-field"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            loadSearchData();
          }}
          placeholder="Busca un mito, criatura o leyenda (ej: El Caleuche)..."
          className="w-full py-4 text-slate-100 placeholder-slate-500 font-inter text-sm md:text-base bg-transparent border-0 outline-none focus:ring-0"
        />

        {query && (
          <button
            id="search-clear-btn"
            type="button"
            onClick={() => {
              setQuery("");
              onSearch("");
            }}
            className="p-1.5 mr-1 text-slate-500 hover:text-slate-300 hover:bg-[#1a1a1a] rounded-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Enter Indicator & Submit Button */}
        <div className="flex items-center space-x-2 mr-2">
          {!query && (
            <kbd className="hidden sm:inline-block bg-gold text-[#080808] px-2 py-1 rounded text-[10px] font-bold">
              ENTER
            </kbd>
          )}
          <button
            id="search-submit-btn"
            type="submit"
            className="flex items-center justify-center h-10 w-10 rounded-sm bg-gold hover:bg-gold-hover text-[#080808] border border-gold/30 transition-all active:scale-95 group"
            title="Buscar"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </form>

      {/* DROPDOWN FOR RECENT & POPULAR SEARCHES */}
      {isFocused && (
        <div 
          id="search-dropdown-panel"
          className="absolute left-0 right-0 mt-3 bg-[#0a0a0af5] border border-gold/20 backdrop-blur-md rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.9)] z-30 overflow-hidden divide-y divide-slate-900/80 animate-fade-in"
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="flex items-center space-x-2 text-xs font-semibold text-slate-400 tracking-wider uppercase font-inter">
                  <History className="w-3.5 h-3.5 text-gold" />
                  <span>Búsquedas Recientes</span>
                </span>
                <button 
                  id="clear-history-btn"
                  onClick={handleClearRecent}
                  className="text-[10px] text-slate-500 hover:text-red-400 font-mono transition-colors"
                >
                  Limpiar historial
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {recentSearches.map((term, index) => (
                  <button
                    id={`recent-search-item-${index}`}
                    key={`recent-${index}`}
                    onClick={() => handleSelectTerm(term)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-sm border border-slate-800 bg-[#121212]/50 text-xs text-slate-300 hover:border-gold/40 hover:bg-gold/5 hover:text-gold transition-all duration-150"
                  >
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-4">
            <span className="flex items-center space-x-2 text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2.5 px-1 font-inter">
              <Flame className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span>Las más Buscadas</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {popularSearches.map((term, index) => (
                <button
                  id={`popular-search-item-${index}`}
                  key={`popular-${index}`}
                  onClick={() => handleSelectTerm(term)}
                  className="flex items-between justify-between px-3 py-2 rounded-sm text-xs text-left text-slate-400 hover:bg-[#121212] hover:text-gold transition-colors group"
                >
                  <span>{term}</span>
                  <span className="text-[10px] text-slate-600 group-hover:text-gold/60 font-mono">
                    Popular
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
