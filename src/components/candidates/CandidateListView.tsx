import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  Star,
  UserCheck,
  UserX,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { Employee, Position, EmployeeStatus } from '../../types';
import { ScoreDisplay } from '../common/ScoreDisplay';
import { CANDIDATE_STATUS_META } from '../../constants/branding';

interface CandidateListViewProps {
  employees: Employee[];
  positions: Position[];
  onSelectCandidate: (candidateId: string, positionId?: string) => void;
  onToggleFavorite: (candidateId: string) => void;
  onCallInterview: (candidateId: string) => void;
  onCancelInterview: (candidateId: string) => void;
}

export const CandidateListView: React.FC<CandidateListViewProps> = ({
  employees,
  positions,
  onSelectCandidate,
  onToggleFavorite,
  onCallInterview,
  onCancelInterview,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [minExpFilter, setMinExpFilter] = useState<number>(0);
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'name' | 'exp_desc' | 'exp_asc' | 'comp_desc'>('exp_desc');

  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.department)));
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const q = searchTerm.toLowerCase().trim();
        const matchSearch =
          !q ||
          emp.name.toLowerCase().includes(q) ||
          emp.title.toLowerCase().includes(q) ||
          emp.department.toLowerCase().includes(q) ||
          emp.competencies.some((c) => (c.competencyName || '').toLowerCase().includes(q));

        const matchDept = selectedDept === 'ALL' || emp.department === selectedDept;
        const matchStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;
        const matchExp = emp.experienceYears >= minExpFilter;
        const matchFav = !favoritesOnly || !!emp.isFavorite;

        return matchSearch && matchDept && matchStatus && matchExp && matchFav;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name, 'tr');
        if (sortBy === 'exp_desc') return b.experienceYears - a.experienceYears;
        if (sortBy === 'exp_asc') return a.experienceYears - b.experienceYears;
        if (sortBy === 'comp_desc') return b.competencies.length - a.competencies.length;
        return 0;
      });
  }, [employees, searchTerm, selectedDept, selectedStatus, minExpFilter, favoritesOnly, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDept('ALL');
    setSelectedStatus('ALL');
    setMinExpFilter(0);
    setFavoritesOnly(false);
    setSortBy('exp_desc');
  };

  const isFiltered =
    searchTerm ||
    selectedDept !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    minExpFilter > 0 ||
    favoritesOnly;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Aday & Yetenek Havuzu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sağlık işletmesi genelinde kayıtlı aday ve çalışanların yetkinlik envanteri
          </p>
        </div>
      </div>

      {/* Advanced Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Aday adı, unvan, birim veya yetkinlik ara..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            >
              <option value="ALL">Tüm Departmanlar</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
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
              <option value="review_pending">İnceleniyor</option>
              <option value="interviewing">Mülakata Çağrıldı</option>
              <option value="available">Müsait / Yeni</option>
              <option value="placed">Kabul Edildi</option>
              <option value="rejected">Reddedildi</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            >
              <option value="exp_desc">Deneyim: Çoktan Aza</option>
              <option value="exp_asc">Deneyim: Azdan Çoğa</option>
              <option value="comp_desc">Yetkinlik Sayısı: Çoktan Aza</option>
              <option value="name">İsim: A - Z</option>
            </select>
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* Experience pill tabs */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-[11px] text-slate-400">Deneyim:</span>
              {[
                { label: 'Tümü', val: 0 },
                { label: '2+ Yıl', val: 2 },
                { label: '4+ Yıl', val: 4 },
                { label: '6+ Yıl', val: 6 },
              ].map((pill) => (
                <button
                  key={pill.val}
                  onClick={() => setMinExpFilter(pill.val)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    minExpFilter === pill.val
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Favorites toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
              <input
                type="checkbox"
                checked={favoritesOnly}
                onChange={(e) => setFavoritesOnly(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1 font-medium">
                <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                Sadece Favoriler
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span>
              Toplam <strong className="text-slate-900 font-mono tabular-nums">{filteredEmployees.length}</strong> aday listelendi
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

      {/* Talent Pool Grid / Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3 w-10 text-center">Fav</th>
                <th className="py-3 px-4">Aday & Pozisyon Hedefi</th>
                <th className="py-3 px-4">Eğitim & Deneyim</th>
                <th className="py-3 px-4">Kayıtlı Yetkinlikler</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 space-y-2">
                    <p>Arama ve filtreleme kriterlerine uygun aday bulunamadı.</p>
                    <button
                      onClick={handleClearFilters}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Filtreleri Temizle
                    </button>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const targetPos = positions.find((p) => p.id === emp.appliedPositionId);
                  const isAyse = emp.id === 'emp_ayse_yilmaz';
                  const statusMeta = CANDIDATE_STATUS_META[emp.status] || CANDIDATE_STATUS_META.review_pending;

                  return (
                    <tr
                      key={emp.id}
                      onClick={() => onSelectCandidate(emp.id, emp.appliedPositionId)}
                      className={`hover:bg-slate-50/90 transition-colors cursor-pointer ${
                        isAyse ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Favorite Button */}
                      <td
                        className="py-3 px-3 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(emp.id);
                        }}
                      >
                        <button
                          title={emp.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                          className="p-1 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              emp.isFavorite ? 'text-amber-500 fill-amber-500' : ''
                            }`}
                          />
                        </button>
                      </td>

                      <td className="py-3 px-4 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-xs shrink-0 border border-blue-200">
                            {emp.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                              <span>{emp.name}</span>
                              {isAyse && (
                                <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded font-medium">
                                  Lider Aday
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {targetPos ? targetPos.title : emp.title}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium truncate max-w-xs">
                          {emp.education}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {emp.experienceYears} Yıl Tecrübe · {emp.department}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono tabular-nums font-semibold text-slate-800">
                          {emp.competencies.length} Yetkinlik
                        </span>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                          {emp.competencies.slice(0, 3).map((c) => c.competencyName).join(', ')}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                          {statusMeta.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {/* Quick Interview Action Button */}
                          {emp.status === 'interviewing' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onCancelInterview(emp.id);
                              }}
                              title="Mülakatı İptal Et"
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                              İptal Et
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onCallInterview(emp.id);
                              }}
                              title="Mülakata Çağır"
                              className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Mülakata Çağır
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectCandidate(emp.id, emp.appliedPositionId);
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>İki Taraflı Analiz</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
