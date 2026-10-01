import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Compass,
  GitCompare,
  BarChart3,
  Sliders,
  Hospital,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { APP_CONFIG } from '../../constants/branding';

export type NavTab = 
  | 'dashboard' 
  | 'positions' 
  | 'candidates' 
  | 'competencies' 
  | 'matching' 
  | 'analytics';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  openPositionsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  openPositionsCount
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Genel Görünüm', icon: LayoutDashboard },
    { id: 'positions', label: 'Açık Pozisyonlar', icon: Briefcase, badge: openPositionsCount },
    { id: 'candidates', label: 'Aday & Yetenek Havuzu', icon: Users },
    { id: 'competencies', label: 'Yetkinlik Havuzu', icon: Compass },
    { id: 'matching', label: 'Eşleştirme Motoru', icon: GitCompare },
    { id: 'analytics', label: 'Yetkinlik Açığı & Analitik', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-semibold tracking-tight">
          <Hospital className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-base font-bold text-white tracking-tight leading-tight">
            {APP_CONFIG.name}
          </span>
          <span className="text-[11px] text-slate-400 truncate">
            {APP_CONFIG.subtitle}
          </span>
        </div>
      </div>

      {/* Hospital / Organization Context */}
      <div className="px-5 py-3.5 border-b border-slate-800/60 bg-slate-900/60">
        <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
          Sağlık Kuruluşu
        </div>
        <div className="text-xs font-medium text-slate-200 truncate mt-0.5">
          {APP_CONFIG.organizationDefault}
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>{APP_CONFIG.hospitalDefault}</span>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
          Ana Menü
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Decision Support & Academic Tag */}
      <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>İK Karar Destek Prensibi</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Algoritma işe alım kararı vermez; objektif yetkinlik uyum vektörleri ile İK kuruluna karar desteği sunar.
        </p>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-semibold shrink-0 border border-slate-600">
            SD
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="text-xs font-medium text-white truncate">
              {APP_CONFIG.currentUser.name}
            </span>
            <span className="text-[10px] text-slate-400 truncate">
              {APP_CONFIG.currentUser.role}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
