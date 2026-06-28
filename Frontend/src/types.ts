// src/types.ts

export interface Myth {
  id: string;
  title: string;
  category: "mito" | "leyenda" | "criatura" | "brujería" | "deidad" | "espíritu";
  summary: string;
  content: string;
  origin: string;
  dangerLevel: "Bajo" | "Medio" | "Alto" | "Extremo";
  tags: string[];
  imageUrl: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  favorites: string[];
  role?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}