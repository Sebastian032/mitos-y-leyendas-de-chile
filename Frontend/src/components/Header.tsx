/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import type { User } from "../types";
import { BookOpen, User as UserIcon, LogOut, ShieldAlert, Heart, Compass, Bookmark } from "lucide-react";

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onAuthClick: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

export default function Header({
  activeSection,
  onSectionChange,
  onAuthClick,
  currentUser,
  onLogout
}: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const sections = [
    { id: "all", label: "Inicio", icon: Compass },
    { id: "mito", label: "Mitos", icon: BookOpen },
    { id: "leyenda", label: "Leyendas", icon: Bookmark },
    { id: "favorites", label: "Mis Guardados", icon: Heart, requiresAuth: true }
  ];

  return (
    <header 
      id="main-navigation-header" 
      className="sticky top-0 z-40 w-full h-20 border-b border-gold/20 bg-[#0a0a0af0] backdrop-blur-md px-6 md:px-12 flex items-center justify-between transition-all"
    >
      {/* 1. LOGO */}
      <div 
        id="header-logo-container" 
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => onSectionChange("all")}
      >
        <div className="relative flex items-center justify-center w-10 h-10 border-2 border-gold rotate-45 group-hover:bg-gold/10 transition-all duration-300">
          <span className="-rotate-45 font-cinzel font-bold text-gold text-lg">M</span>
        </div>
        <div>
          <h1 className="font-cinzel text-base md:text-lg font-bold tracking-[0.2em] text-gold group-hover:text-[#d3b476] transition-colors uppercase">
            Bestiario<span className="text-slate-100 font-sans tracking-normal font-light">Sur</span>
          </h1>
          <p className="font-mono text-[9px] text-slate-500 tracking-wider uppercase leading-none mt-0.5">
            Aquelarre de Chiloé
          </p>
        </div>
      </div>

      {/* 2. NAVIGATION SECTIONS */}
      <nav id="header-nav-menu" className="hidden md:flex items-center space-x-1">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          
          if (sec.requiresAuth && !currentUser) return null;

          return (
            <button
              id={`nav-section-btn-${sec.id}`}
              key={sec.id}
              onClick={() => onSectionChange(sec.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-sm text-xs font-inter uppercase tracking-widest transition-all duration-200 ${
                isActive
                  ? "border border-gold/30 bg-gold/5 text-gold"
                  : "text-slate-400 hover:text-gold hover:bg-slate-900/40 border border-transparent"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. SIGN IN / REGISTER / USER PROFILE */}
      <div id="header-auth-container" className="flex items-center space-x-4">
        {currentUser ? (
          <div className="relative">
            <button
              id="header-profile-menu-btn"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-sm border border-slate-800 bg-[#121212] hover:bg-slate-900 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-sm bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold text-xs">
                {currentUser.username[0].toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-slate-200 leading-tight">
                  {currentUser.username}
                </p>
                <p className="text-[9px] text-gold font-mono uppercase tracking-tight leading-none mt-0.5">
                  Iniciado
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div
                id="header-profile-dropdown"
                className="absolute right-0 mt-2 w-56 rounded-sm bg-[#0a0a0a] border border-gold/20 p-1.5 shadow-2xl z-50 animate-fade-in"
              >
                <div className="px-3 py-2 border-b border-slate-900 mb-1">
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Sesión iniciada</p>
                  <p className="text-xs font-semibold text-slate-200 truncate">{currentUser.email}</p>
                </div>

                <button
                  id="dropdown-favorites-btn"
                  onClick={() => {
                    onSectionChange("favorites");
                    setShowProfileDropdown(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-sm text-xs font-inter uppercase tracking-wider text-slate-300 hover:bg-slate-900 hover:text-gold transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Guardados ({currentUser.favorites.length})</span>
                </button>

                <button
                  id="dropdown-logout-btn"
                  onClick={() => {
                    onLogout();
                    setShowProfileDropdown(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-sm text-xs font-inter uppercase tracking-wider text-red-400 hover:bg-red-950/20 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Aquelarre</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            id="header-auth-trigger-btn"
            onClick={onAuthClick}
            className="px-5 py-2 border border-gold text-gold hover:bg-gold hover:text-[#080808] transition-all rounded-sm font-semibold uppercase text-xs tracking-tighter"
          >
            <span>Iniciar Sesión / Registro</span>
          </button>
        )}
      </div>
    </header>
  );
}
