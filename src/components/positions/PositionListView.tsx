import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  ChevronRight,
  SlidersHorizontal,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';
import { Position } from '../../types';
import { ScoreDisplay } from '../common/ScoreDisplay';

interface PositionListViewProps {
  positions: Position[];
  onSelectPosition: (positionId: string) => void;
  onOpenNewPositionModal: () => void;
  onUpdateStatus?: (positionId: string, status: Position['status']) => void;
}

export const PositionListView: React.FC<PositionListViewProps> = ({
  positions,
  onSelectPosition,
  onOpenNewPositionModal,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'applicants_desc' | 'title'>('score_desc');

  // Unique departments for filter
  const departments = useMemo(() => {
    const deps = new Set(positions.map((p) => p.department));
    return Array.from(deps);
  }, [positions]);

  // Filtered and sorted positions
  const filteredPositions = useMemo(() => {
    return positions
      .filter((pos) => {
        const q = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !q ||
          pos.title.toLowerCase().includes(q) ||
          pos.department.toLowerCase().includes(q) ||
          pos.description.toLowerCase().includes(q);

        const matchesDept =
          selectedDepartment === 'ALL' || pos.department === selectedDepartment;

        const matchesStatus =
          selectedStatus === 'ALL' || pos.status === selectedStatus;

        const matchesScore = pos.averageMatchScore >= minScoreFilter;

        return matchesSearch && matchesDept && matchesStatus && matchesScore;
      })
      .sort((a, b) => {
        if (sortBy === 'score_desc') return b.averageMatchScore - a.averageMatchScore;
        if (sortBy === 'score_asc') return a.averageMatchScore - b.averageMatchScore;
        if (sortBy === 'applicants_desc') return b.applicantsCount - a.applicantsCount;
        if (sortBy === 'title') return a.title.localeCompare(b.title, 'tr');
        return 0;
      });
  }, [positions, searchTerm, selectedDepartment, selectedStatus, minScoreFilter, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('ALL');
    setSelectedStatus('ALL');
    setMinScoreFilter(0);
    setSortBy('score_desc');
  };

  const isFiltered =
    searchTerm || selectedDepartment !== 'ALL' || selectedStatus !== 'ALL' || minScoreFilter > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Açık Pozisyonlar & Proje Gereksinimleri
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sağlık işletmesinde açık olan pozisyonların yetkinlik vektörleri ve başvuru uyum oranları
          </p>
        </div>

        <button
          onClick={onOpenNewPositionModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Pozisyon Oluştur</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pozisyon veya gereksinim ara..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            >
              <option value="ALL">Tüm Departmanlar</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="active">Aktif Pozisyonlar</option>
              <option value="in_review">İnceleme Aşamasında</option>
              <option value="closed">Tamamlanmış / Kapalı</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            >
              <option value="score_desc">Uyum Skoru: Yüksekten Düşüğe</option>
              <option value="score_asc">Uyum Skoru: Düşükten Yükseğe</option>
              <option value="applicants_desc">Başvuru Sayısı: Çoktan Aza</option>
              <option value="title">Pozisyon Adı: A - Z</option>
            </select>
          </div>
        </div>

        {/* Secondary row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Min Score Slider */}
          <div className="flex items-center gap-2 max-w-xs w-full">
            <span className="text-xs text-slate-500 shrink-0">Min. Uyum Skoru:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-xs font-mono tabular-nums font-semibold text-slate-800 w-10 text-right">
              %{minScoreFilter}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span>
              Toplam <strong className="text-slate-900 font-mono tabular-nums">{filteredPositions.length}</strong> pozisyon listelendi
            </span>

            {isFiltered && (
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Filtreleri Temizle</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Positions Table / Cards */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Pozisyon & Departman</th>
                <th className="py-3 px-4">Açılış Tarihi</th>
                <th className="py-3 px-4 text-center">Başvuru Sayısı</th>
                <th className="py-3 px-4">Gereksinim Vektörü</th>
                <th className="py-3 px-4">Ortalama Uyum</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPositions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 space-y-2">
                    <p>Arama veya filtreleme kriterlerine uygun pozisyon bulunamadı.</p>
                    <button
                      onClick={handleClearFilters}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Filtreleri Temizle
                    </button>
                  </td>
                </tr>
              ) : (
                filteredPositions.map((pos) => {
                  const isHighlightedDemo = pos.id === 'pos_yogun_bakim_hemsiresi';
                  return (
                    <tr
                      key={pos.id}
                      onClick={() => onSelectPosition(pos.id)}
                      className={`hover:bg-slate-50/90 transition-colors cursor-pointer ${
                        isHighlightedDemo ? 'bg-blue-50/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 min-w-[220px]">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                            {pos.title}
                          </span>
                          {isHighlightedDemo && (
                            <span className="text-[10px] text-blue-700 bg-blue-100/70 border border-blue-200 px-1.5 py-0.5 rounded font-medium">
                              Demo Pozisyonu
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {pos.department} · {pos.workType}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono tabular-nums">
                        {pos.openDate}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap font-mono tabular-nums font-medium text-slate-900">
                        {pos.applicantsCount} Aday
                      </td>

                      <td className="py-3.5 px-4 min-w-[180px]">
                        <div className="text-slate-600 text-[11px] truncate max-w-xs">
                          {pos.requirements.length} Yetkinlik Kriteri ({pos.requirements.map(r => r.competencyName || r.competencyId).slice(0, 2).join(', ')}...)
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Min. {pos.experienceYearsRequired} Yıl Tecrübe
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <ScoreDisplay score={pos.averageMatchScore} size="sm" />
                      </td>

                      <td
                        className="py-3.5 px-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {onUpdateStatus ? (
                          <select
                            value={pos.status}
                            onChange={(e) => onUpdateStatus(pos.id, e.target.value as Position['status'])}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border cursor-pointer ${
                              pos.status === 'active'
                                ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                                : pos.status === 'in_review'
                                ? 'text-amber-800 bg-amber-50 border-amber-200'
                                : 'text-slate-600 bg-slate-100 border-slate-200'
                            }`}
                          >
                            <option value="active">Aktif</option>
                            <option value="in_review">İncelemede</option>
                            <option value="closed">Kapalı / Arşiv</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${
                              pos.status === 'active'
                                ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                                : pos.status === 'in_review'
                                ? 'text-amber-800 bg-amber-50 border border-amber-200'
                                : 'text-slate-600 bg-slate-100 border border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                pos.status === 'active'
                                  ? 'bg-emerald-600'
                                  : pos.status === 'in_review'
                                  ? 'bg-amber-600'
                                  : 'bg-slate-400'
                              }`}
                            />
                            {pos.status === 'active'
                              ? 'Aktif'
                              : pos.status === 'in_review'
                              ? 'İncelemede'
                              : 'Kapalı'}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPosition(pos.id);
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Detay & Adaylar</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
