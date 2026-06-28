// src/services/api.ts
import type { Myth, User } from "../types";

// Datos de prueba (Mock Data) para ver el Front con vida real de inmediato
const MOCK_MYTHS: Myth[] = [
  {
    id: "1",
    title: "El Trauco",
    category: "criatura",
    origin: "Chiloé, Chile",
    summary: "Entidad de pequeña estatura y rostro grotesco que habita los bosques densos, conocido por su mirada magnética y su hacha de piedra.",
    content: "El Trauco es una de las deidades ctónicas más famosas de la mitología chilota. Mide no más de 90 centímetros, viste ropa hecha de quilineja y porta un hacha de piedra mágica con la que derriba árboles de un solo golpe para demostrar su fuerza. Se dice que posee una mirada tan poderosa que puede dejar estúpido o deforme a quien lo desafíe, y utiliza su magnetismo para atraer de forma irresistible a las mujeres jóvenes que se adentran solas en el bosque.",
    imageUrl: "https://images.unsplash.com/photo-1601987177651-8edfe6c20009?q=80&w=600&auto=format&fit=crop", // Una foto oscura de bosque místico
    dangerLevel: "Alto",
    tags: ["bosque", "mitología-chilota", "hechizo"]
  },
  {
    id: "2",
    title: "La Pincoya",
    category: "deidad",
    origin: "Chiloé, Chile",
    summary: "Criatura marina de extraordinaria belleza que personifica la abundancia o la escasez de los mariscos y peces en las costas sureñas.",
    content: "La Pincoya es una mujer de larga cabellera dorada que habita en las profundidades del mar. Cuando realiza su danza ritual de espaldas al océano, significa que los peces y mariscos escasearán debido a la molestia de la naturaleza. En cambio, si baila mirando hacia el mar, es augurio de una pesca abundante para las comunidades locales. Los pescadores cuidan celosamente de no sobreexplotar las playas para no ahuyentar su favor.",
    imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=600&auto=format&fit=crop", // Foto marina nocturna o mística
    dangerLevel: "Bajo",
    tags: ["mar", "abundancia", "protectora"]
  },
  {
    id: "3",
    title: "El Caleuche",
    category: "leyenda",
    origin: "Chiloé, Chile",
    summary: "El legendario barco fantasma que navega los mares del sur, envuelto en una densa neblina y resplandeciendo con luces de fiesta.",
    content: "El Caleuche es un buque maldito que surca las aguas australes a gran velocidad, incluso bajo el agua. Está tripulado por brujos poderosos y por náufragos que han sido esclavizados, quienes recuperan su pierna normal solo cuando suben a bordo. Se manifiesta siempre en medio de una neblina artificial que él mismo genera, iluminado por luces multicolores y haciendo eco de una música festiva hipnótica que atrae a los navegantes hacia su perdición.",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=600&auto=format&fit=crop", // Foto oscura de barco o mar tenebroso
    dangerLevel: "Extremo",
    tags: ["barco-fantasma", "brujería", "océano"]
  }
];

// Memoria volátil temporal para guardar las búsquedas en el cliente mientras no hay backend
let localRecentSearches: string[] = ["Trauco", "Caleuche", "Chiloé"];
const MOCK_POPULAR_SEARCHES: string[] = ["La Pincoya", "Camahueto", "Basilisco", "Invunche"];

export const CoreService = {
  // Obtiene los mitos (ahora devuelve los datos de prueba inmediatamente)
  getMyths: async (): Promise<Myth[]> => {
    // Simulamos una respuesta de red ultra rápida
    return Promise.resolve(MOCK_MYTHS);
  },

  // Obtiene el historial inicial
  getRecentSearches: async (): Promise<string[]> => {
    return Promise.resolve(localRecentSearches);
  },

  // Permite que la barra agregue nuevas búsquedas sin caerse
  saveSearch: async (query: string): Promise<void> => {
    if (query && !localRecentSearches.includes(query)) {
      localRecentSearches = [query, ...localRecentSearches.slice(0, 4)];
    }
    return Promise.resolve();
  },

 // Simulación básica del usuario
  getCurrentUser: async (): Promise<User | null> => {
    return Promise.resolve({
      id: "user_123",
      username: "Sebastián",
      email: "seba@example.com",
      favorites: ["1"]
    })
  },
  // Agrega una búsqueda al historial
  addRecentSearch: async (query: string): Promise<string[]> => {
    const cleanQuery = query.trim();
    if (cleanQuery && !localRecentSearches.includes(cleanQuery)) {
      // Mantenemos un límite de 5 búsquedas para no saturar la UI
      localRecentSearches = [cleanQuery, ...localRecentSearches.slice(0, 4)];
    }
    return Promise.resolve(localRecentSearches);
  },
  // Obtiene las búsquedas más sugeridas
  getPopularSearches: async (): Promise<string[]> => {
    return Promise.resolve(MOCK_POPULAR_SEARCHES);
  },

  // Limpia por completo el historial
  clearRecentSearches: async (): Promise<void> => {
    localRecentSearches = [];
    return Promise.resolve();
  },
  //Simula la verificación de la sesión activa en el Home
  getActiveSession: async (): Promise<any> => {
    // Retorna una sesión simulada exitosa o nula si quieres probar deslogueado
    return Promise.resolve({ token: "mock_token_xyz" });
  },
  //Simula la barra de búsqueda filtrando localmente el array estático
  searchMyths: async (query: string, category?: string): Promise<Myth[]> => {
    const lowerQuery = query.toLowerCase().trim();
    
    let filtered = MOCK_MYTHS;

    // Si hay texto en la barra, filtramos por título, resumen o etiquetas
    if (lowerQuery) {
      filtered = filtered.filter(myth => 
        myth.title.toLowerCase().includes(lowerQuery) ||
        myth.summary.toLowerCase().includes(lowerQuery) ||
        myth.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Si seleccionaste una categoría (ej: "Criatura"), filtramos también por eso
    if (category && category !== "Todos") {
      filtered = filtered.filter(myth => myth.category === category);
    }

    return Promise.resolve(filtered);
  }
};