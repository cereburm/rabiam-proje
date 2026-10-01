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
  SlidersHorizontal
} from 'lucide-react';
import { Employee, Position } from '../../types';
import { ScoreDisplay } from '../common/ScoreDisplay';

interface CandidateListViewProps {
  employees: Employee[];
  positions: Position[];
  onSelectCandidate: (candidateId: string, positionId?: string) => void;
}

export const CandidateListView: React.FC<CandidateListViewProps> = ({
  employees,
  positions,
  onSelectCandidate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.department)));
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = selectedDept === 'ALL' || emp.department === selectedDept;
      const matchStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, searchTerm, selectedDept, selectedStatus]);

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

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Aday adı, uzmanlık veya birim ara..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">Tüm Departmanlar</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="review_pending">İnceleme Bekliyor</option>
              <option value="interviewing">Mülakat Aşamasında</option>
              <option value="available">Müsait / Havuzda</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Toplam <strong className="text-slate-900 font-mono">{filteredEmployees.length}</strong> aday listelendi
          </span>
          {(searchTerm || selectedDept !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('ALL');
                setSelectedStatus('ALL');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>
      </div>

      {/* Talent Pool Grid / Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Aday & Pozisyon Hedefi</th>
                <th className="py-3 px-4">Eğitim & Deneyim</th>
                <th className="py-3 px-4">Kayıtlı Yetkinlik Sayısı</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const targetPos = positions.find((p) => p.id === emp.appliedPositionId);
                const isAyse = emp.id === 'emp_ayse_yilmaz';

                return (
                  <tr
                    key={emp.id}
                    onClick={() => onSelectCandidate(emp.id, emp.appliedPositionId)}
                    className={`hover:bg-slate-50/90 transition-colors cursor-pointer ${
                      isAyse ? 'bg-blue-50/30' : ''
                    }`}
                  >
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
                                Örnek Vaka
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
                      <div className="text-[10px] text-slate-400">
                        Doğrulanmış Vektör
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${
                          emp.status === 'review_pending'
                            ? 'text-amber-800 bg-amber-50 border border-amber-200'
                            : emp.status === 'interviewing'
                            ? 'text-blue-800 bg-blue-50 border border-blue-200'
                            : 'text-slate-700 bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {emp.status === 'review_pending'
                          ? 'İnceleme Bekliyor'
                          : emp.status === 'interviewing'
                          ? 'Mülakat Aşamasında'
                          : 'Müsait'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCandidate(emp.id, emp.appliedPositionId);
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <span>İki Taraflı Analiz</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
