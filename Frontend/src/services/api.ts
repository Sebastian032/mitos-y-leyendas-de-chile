// src/services/api.ts
import type { Myth, User, AuthState } from "../types";

// Captura la URL del backend configurada en Docker (http://localhost:8000)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class CoreService {
  
  // 1. Obtener todos los mitos reales desde MongoDB vía FastAPI
  static async getMyths(): Promise<Myth[]> {
    const res = await fetch(`${API_BASE_URL}/api/myths`);
    if (!res.ok) throw new Error("Error al conectar con la bitácora ancestral");
    return res.json();
  }

  // 2. Buscar mitos por texto o categoría en el backend
  static async searchMyths(query: string, category?: string): Promise<Myth[]> {
    const params = new URLSearchParams({
      q: query,
      ...(category && category !== "all" && { cat: category })
    });
    
    const res = await fetch(`${API_BASE_URL}/api/myths/search?${params}`);
    if (!res.ok) throw new Error("Error en la consulta al núcleo");
    return res.json();
  }

  // 3. Crear un nuevo mito persistiéndolo en MongoDB
  static async createMyth(myth: Omit<Myth, "id">): Promise<Myth> {
    const res = await fetch(`${API_BASE_URL}/api/myths`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(myth)
    });
    if (!res.ok) throw new Error("No se pudo registrar el nuevo saber");
    return res.json();
  }

  // ---- MANEJO DE SESIÓN LOCAL (Se mantiene temporalmente en el cliente) ----
  
  static getActiveSession(): AuthState | null {
    try {
      const session = localStorage.getItem("auth_state");
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  }

  static logout(): void {
    localStorage.removeItem("auth_state");
  }

  // 4. Login mockeado (puedes migrarlo a tu endpoint de Python más adelante)
  static async login(email: string): Promise<AuthState> {
    const username = email.split("@")[0] || "Invitado";
    const state: AuthState = {
      user: {
        id: "usr_1",
        username,
        email,
        favorites: ["caleuche"]
      },
      token: "jwt_token_real_session"
    };
    localStorage.setItem("auth_state", JSON.stringify(state));
    return state;
  }

  // 5. Alternar Favorito
  static async toggleFavorite(mythId: string): Promise<User | null> {
    const session = this.getActiveSession();
    if (!session || !session.user) return null;

    const user = session.user;
    const isFav = user.favorites.includes(mythId);
    
    user.favorites = isFav 
      ? user.favorites.filter(id => id !== mythId)
      : [...user.favorites, mythId];

    session.user = user;
    localStorage.setItem("auth_state", JSON.stringify(session));
    return user;
  }
}