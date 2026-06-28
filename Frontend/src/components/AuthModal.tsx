/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { CoreService } from "../services/api";
import type { User, AuthState } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        if (!email) {
          setError("El correo electrónico es requerido.");
          setIsLoading(false);
          return;
        }
        await CoreService.login(email, password);
      } else {
        if (!username || !email) {
          setError("Nombre de usuario y correo son requeridos.");
          setIsLoading(false);
          return;
        }
        await CoreService.register(username, email, password);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError("Ocurrió un error al procesar la solicitud. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      id="auth-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300 animate-fade-in"
    >
      <div 
        id="auth-modal-content"
        className="relative w-full max-w-md overflow-hidden bg-[#0a0a0a] border border-gold/20 rounded-lg shadow-[0_0_50px_rgba(197,160,89,0.15)] flex flex-col"
      >
        {/* Glow decorative effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-2 border-b border-[#121212]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <h2 className="font-cinzel text-base md:text-lg font-bold tracking-wider text-gold uppercase">
              {isLogin ? "Acceso al Aquelarre" : "Registrar Iniciado"}
            </h2>
          </div>
          <button
            id="auth-close-btn"
            onClick={onClose}
            className="p-1 rounded-sm text-slate-400 hover:text-gold hover:bg-slate-900 transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#121212] px-6">
          <button
            id="auth-tab-login"
            onClick={() => { setIsLogin(true); setError(""); }}
            className={`flex-1 py-3 text-center text-xs font-inter uppercase tracking-widest border-b-2 transition-all duration-200 ${
              isLogin 
                ? "border-gold text-gold" 
                : "border-transparent text-slate-400 hover:text-gold"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            id="auth-tab-register"
            onClick={() => { setIsLogin(false); setError(""); }}
            className={`flex-1 py-3 text-center text-xs font-inter uppercase tracking-widest border-b-2 transition-all duration-200 ${
              !isLogin 
                ? "border-gold text-gold" 
                : "border-transparent text-slate-400 hover:text-gold"
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div id="auth-error-alert" className="p-3 text-xs rounded-sm border border-red-500/30 bg-red-500/10 text-red-400">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                Nombre de Brujo / Sabio
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="auth-username-input"
                  type="text"
                  required
                  placeholder="Ej: BrujoMahuida"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-white/5 bg-[#121212] text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="auth-email-input"
                type="email"
                required
                placeholder="iniciado@chiloe.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-white/5 bg-[#121212] text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
              Llave de Paso (Contraseña)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="auth-password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-white/5 bg-[#121212] text-slate-200 placeholder-slate-600 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-4 rounded-sm bg-gold hover:bg-gold-hover text-[#080808] font-semibold text-xs uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{isLoading ? "Conjurando..." : isLogin ? "Ingresar" : "Comenzar Viaje"}</span>
          </button>

          <p className="text-center text-[10px] text-slate-500 mt-4 leading-normal">
            Al registrarte aceptas los antiguos pactos de resguardo y protección del folclor chileno.
          </p>
        </form>
      </div>
    </div>
  );
}
