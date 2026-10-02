import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  ChevronRight,
  HelpCircle,
  History,
  Menu,
  X,
  User,
  Briefcase,
  Compass,
  ArrowRight
} from 'lucide-react';
import { APP_CONFIG } from '../../constants/branding';
import { Employee, Position, Competency } from '../../types';

interface HeaderProps {
  breadcrumb: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewPositionModal: () => void;
  onOpenHelpModal?: () => void;
  onOpenActivityHistory?: () => void;
  onToggleMobileMenu?: () => void;
  employees: Employee[];
  positions: Position[];
  competencies: Competency[];
  onSelectCandidate: (candidateId: string, positionId?: string) => void;
  onSelectPosition: (positionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  breadcrumb,
  searchQuery,
  onSearchChange,
  onOpenNewPositionModal,
  onOpenHelpModal,
  onOpenActivityHistory,
  onToggleMobileMenu,
  employees,
  positions,
  competencies,
  onSelectCandidate,
  onSelectPosition,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    const matchedCandidates = employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.competencies.some((c) => (c.competencyName || '').toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedPositions = positions.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedCompetencies = competencies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    ).slice(0, 3);

    const totalCount = matchedCandidates.length + matchedPositions.length + matchedCompetencies.length;

    return {
      candidates: matchedCandidates,
      positions: matchedPositions,
      competencies: matchedCompetencies,
      totalCount,
    };
  }, [searchQuery, employees, positions, competencies]);

  return (
    <header className="h-16 px-4 sm:px-6 bg-white border-b border-slate-200/80 flex items-center justify-between gap-3 shrink-0 z-30 relative">
      {/* Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 mr-1"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <span className="font-semibold text-slate-800 hidden sm:inline">{APP_CONFIG.name}</span>
        {breadcrumb.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
            <span
              className={`truncate max-w-[140px] sm:max-w-xs ${
                idx === breadcrumb.length - 1
                  ? 'text-slate-900 font-medium'
                  : 'hover:text-slate-700 hidden md:inline'
              }`}
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Global Real-Time Search with Dropdown */}
      <div className="flex-1 max-w-md relative" ref={searchContainerRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsSearchOpen(true);
            }}
            placeholder="Aday, pozisyon veya yetkinlik ara (örn: Ayşe, Yoğun Bakım, EKG)..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Real-time search dropdown panel */}
        {isSearchOpen && searchResults && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 text-xs">
            {searchResults.totalCount === 0 ? (
              <div className="p-4 text-center text-slate-400">
                "{searchQuery}" ile eşleşen kayıt bulunamadı.
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {/* Candidates Section */}
                {searchResults.candidates.length > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-blue-600" />
                      <span>Adaylar ({searchResults.candidates.length})</span>
                    </div>
                    {searchResults.candidates.map((cand) => (
                      <div
                        key={cand.id}
                        onClick={() => {
                          onSelectCandidate(cand.id, cand.appliedPositionId);
                          setIsSearchOpen(false);
                        }}
                        className="px-2.5 py-1.5 rounded-lg hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 truncate block">
                            {cand.name}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {cand.title} · {cand.experienceYears} Yıl Deneyim
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Positions Section */}
                {searchResults.positions.length > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3 text-indigo-600" />
                      <span>Pozisyonlar ({searchResults.positions.length})</span>
                    </div>
                    {searchResults.positions.map((pos) => (
                      <div
                        key={pos.id}
                        onClick={() => {
                          onSelectPosition(pos.id);
                          setIsSearchOpen(false);
                        }}
                        className="px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 truncate block">
                            {pos.title}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {pos.department} · {pos.applicantsCount} Aday
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Competencies Section */}
                {searchResults.competencies.length > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Compass className="w-3 h-3 text-teal-600" />
                      <span>Yetkinlikler ({searchResults.competencies.length})</span>
                    </div>
                    {searchResults.competencies.map((comp) => (
                      <div
                        key={comp.id}
                        className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 truncate block">
                            {comp.name}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate block">
                            {comp.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zone 3: Actions & Audit Trail */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Activity History Trigger */}
        {onOpenActivityHistory && (
          <button
            onClick={onOpenActivityHistory}
            title="İşlem Geçmişi ve Geri Alma"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors relative"
          >
            <History className="w-4 h-4 text-slate-600" />
            <span className="hidden xl:inline">İşlem Geçmişi</span>
          </button>
        )}

        {/* Academic / Algorithm Info button */}
        {onOpenHelpModal && (
          <button
            onClick={onOpenHelpModal}
            title="İki Taraflı Eşleştirme Algoritması Hakkında Bilgi"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="hidden lg:inline text-slate-700">Model Mimarisi</span>
          </button>
        )}

        {/* Create Position Action */}
        <button
          onClick={onOpenNewPositionModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Yeni Pozisyon</span>
        </button>
      </div>
    </header>
  );
};
