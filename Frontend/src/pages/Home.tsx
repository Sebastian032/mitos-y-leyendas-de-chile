// src/pages/Home.tsx
import { useState, useEffect } from "react";
import { CoreService, Myth, User } from "../services/api";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import AuthModal from "../components/AuthModal";
import MythDetails from "../components/MythDetails";
import MythCard from "../components/MythCard";
import { Code2, Eye, Database, FolderGit, Info } from "lucide-react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [myths, setMyths] = useState<Myth[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedMyth, setSelectedMyth] = useState<Myth | null>(null);
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showDevGuide, setShowDevGuide] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const allMyths = await CoreService.getMyths();
      setMyths(allMyths);
      const session = CoreService.getActiveSession();
      if (session && session.user) {
        setCurrentUser(session.user);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const filterData = async () => {
      let results = await CoreService.searchMyths(searchQuery);
      if (activeCategory === "favorites" && currentUser) {
        results = results.filter(m => currentUser.favorites.includes(m.id));
      } else if (activeCategory !== "all" && activeCategory !== "favorites") {
        results = results.filter(m => m.category === activeCategory);
      }
      setMyths(results);
    };
    filterData();
  }, [searchQuery, activeCategory, currentUser]);

  const handleSectionChange = (section: string) => {
    setActiveCategory(section);
    setSearchQuery("");
  };

  const handleToggleFavorite = async (mythId: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    const updatedUser = await CoreService.toggleFavorite(mythId);
    if (updatedUser) {
      setCurrentUser({ ...updatedUser });
    }
  };

  const isMythFavorite = (mythId: string) => {
    if (!currentUser) return false;
    return currentUser.favorites.includes(mythId);
  };

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#e2e2e2] flex flex-col mystic-bg">
      {/* Background Graphics */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5 mix-blend-color-dodge"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1600')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent"></div>
      </div>

      <Header
        activeSection={activeCategory}
        onSectionChange={handleSectionChange}
        onAuthClick={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onLogout={() => {
          CoreService.logout();
          setCurrentUser(null);
          if (activeCategory === "favorites") setActiveCategory("all");
        }}
      />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col justify-start">
        {/* Hero Intro */}
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto space-y-4">
          <h2 className="font-cinzel text-xs md:text-sm tracking-[0.4em] text-gold mb-2 opacity-90 uppercase">
            Repositorio de Tradición Chilena
          </h2>
          <h1 className="font-cinzel text-4xl md:text-6xl mb-6 leading-tight tracking-tight text-white uppercase font-bold">
            Desvela los Secretos <br/> de la Mitología Chilota
          </h1>
        </div>

        <SearchBar onSearch={setSearchQuery} initialQuery={searchQuery} />

        {/* Category Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 my-10">
          {[
            { id: "all", label: "Todos los Saberes" },
            { id: "mito", label: "Mitos" },
            { id: "leyenda", label: "Leyendas" },
            { id: "criatura", label: "Criaturas" },
            { id: "brujería", label: "Brujería Chilota" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 text-xs font-inter uppercase tracking-widest border transition-all ${
                activeCategory === cat.id ? "bg-gold/10 border-gold/50 text-gold" : "bg-[#111111]/60 border-white/5 text-slate-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Myths Grid utilizando nuestro nuevo MythCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myths.length > 0 ? (
            myths.map((myth) => (
              <MythCard
                key={myth.id}
                myth={myth}
                isFav={isMythFavorite(myth.id)}
                onToggleFavorite={handleToggleFavorite}
                onExplore={(m) => {
                  setSelectedMyth(m);
                  setIsDetailsOpen(true);
                }}
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center border border-dashed border-white/5 bg-[#121212]/30 rounded-lg">
              <p className="text-slate-400 text-xs">No se encontraron registros de saberes antiguos.</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals y popups */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={() => {
        const session = CoreService.getActiveSession();
        if (session?.user) setCurrentUser(session.user);
      }} />

      <MythDetails
        myth={selectedMyth}
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setSelectedMyth(null); }}
        isFavorite={selectedMyth ? isMythFavorite(selectedMyth.id) : false}
        onToggleFavorite={() => selectedMyth && handleToggleFavorite(selectedMyth.id)}
        isLoggedIn={!!currentUser}
        onAuthPrompt={() => { setIsDetailsOpen(false); setIsAuthOpen(true); }}
      />
    </div>
  );
}