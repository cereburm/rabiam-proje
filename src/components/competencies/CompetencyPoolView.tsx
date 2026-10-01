import React, { useState, useMemo } from 'react';
import {
  Compass,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Competency, CompetencyCategory } from '../../types';
import { CATEGORY_LABELS } from '../../constants/branding';

interface CompetencyPoolViewProps {
  competencies: Competency[];
}

export const CompetencyPoolView: React.FC<CompetencyPoolViewProps> = ({
  competencies,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories: { key: string; label: string }[] = [
    { key: 'ALL', label: 'Tüm Yetkinlikler' },
    { key: 'clinical', label: 'Klinik Yetkinlikler' },
    { key: 'technical', label: 'Teknik Yetkinlikler' },
    { key: 'managerial', label: 'Yönetimsel Yetkinlikler' },
    { key: 'communication', label: 'İletişim Yetkinlikleri' },
    { key: 'digital', label: 'Dijital Sağlık' },
    { key: 'leadership', label: 'Liderlik' },
  ];

  const filteredCompetencies = useMemo(() => {
    return competencies.filter((comp) => {
      const matchSearch =
        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat =
        selectedCategory === 'ALL' || comp.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [competencies, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Sağlık Yetkinlik Havuzu (Competency Repository)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Sağlık işletmesinde pozisyon gereksinimleri ve çalışan değerlendirmelerinde kullanılan standart yetkinlik sözlüğü
        </p>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Yetkinlik adı veya tanımı ara..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <span className="text-xs text-slate-500 self-center">
            <strong className="font-mono text-slate-900">{filteredCompetencies.length}</strong> yetkinlik tanımlı
          </span>
        </div>

        {/* Category Pills (Functional Filter Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompetencies.map((comp) => {
          const catMeta = CATEGORY_LABELS[comp.category] || CATEGORY_LABELS.clinical;
          const isExpanded = expandedId === comp.id;

          return (
            <div
              key={comp.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between hover:border-blue-200 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${catMeta.bg} ${catMeta.color} ${catMeta.border}`}
                  >
                    {catMeta.label}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {comp.usedInPositionsCount || 0} Pozisyonda Aranan
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {comp.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {comp.description}
                </p>
              </div>

              {/* Rubric / Level Descriptions */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : comp.id)}
                  className="w-full flex items-center justify-between text-xs text-blue-600 hover:text-blue-700 font-medium py-1"
                >
                  <span>1-5 Seviye Rubriğini {isExpanded ? 'Gizle' : 'Göster'}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {isExpanded && comp.levelDescriptions && (
                  <div className="mt-2.5 space-y-1.5 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                    {Object.entries(comp.levelDescriptions).map(([lvl, desc]) => (
                      <div key={lvl} className="flex items-start gap-1.5">
                        <span className="font-mono font-bold text-slate-800 shrink-0">
                          Seviye {lvl}:
                        </span>
                        <span className="text-slate-600">{desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
