import React from 'react';
import { Search, Bell, Plus, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { APP_CONFIG } from '../../constants/branding';

interface HeaderProps {
  breadcrumb: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewPositionModal: () => void;
  onOpenHelpModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  breadcrumb,
  searchQuery,
  onSearchChange,
  onOpenNewPositionModal,
  onOpenHelpModal,
}) => {
  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between gap-4 shrink-0 z-10">
      {/* Zone 1: Contextual Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
        <span className="font-semibold text-slate-800">{APP_CONFIG.name}</span>
        {breadcrumb.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span
              className={`truncate ${
                idx === breadcrumb.length - 1
                  ? 'text-slate-900 font-medium'
                  : 'hover:text-slate-700'
              }`}
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Zone 2: Global Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pozisyon, aday veya yetkinlik ara (örn: Yoğun Bakım, Ayşe, EKG)..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Zone 3: Actions & System Status */}
      <div className="flex items-center gap-3">
        {/* Academic / Algorithm Info button */}
        {onOpenHelpModal && (
          <button
            onClick={onOpenHelpModal}
            title="İki Taraflı Eşleştirme Algoritması Hakkında Bilgi"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="hidden lg:inline text-slate-600">Model Mimarisi</span>
          </button>
        )}

        {/* Create Position Action */}
        <button
          onClick={onOpenNewPositionModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yeni Pozisyon</span>
        </button>

        {/* Date Indicator */}
        <div className="hidden xl:flex items-center gap-1 text-[11px] font-mono tabular-nums text-slate-500 pl-2 border-l border-slate-200">
          <span>01 Ekim 2026</span>
        </div>
      </div>
    </header>
  );
};
