import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Building2,
  Users,
  CheckCircle,
  GraduationCap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CompetencyGapReport, DepartmentReadiness, Position } from '../../types';
import { analyticsService } from '../../services/analyticsService';
import { DecisionNotice } from '../common/DecisionNotice';

interface AnalyticsViewProps {
  positions: Position[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ positions }) => {
  const [gaps, setGaps] = useState<CompetencyGapReport[]>([]);
  const [departments, setDepartments] = useState<DepartmentReadiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      analyticsService.getCompetencyGapReport(),
      analyticsService.getDepartmentReadiness(),
    ]).then(([gapRes, deptRes]) => {
      if (mounted) {
        setGaps(gapRes);
        setDepartments(deptRes);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Sağlık İşletmesi Yetkinlik Açığı & Stratejik İK Analitiği
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Açık pozisyonların gereksinim vektörleri ile mevcut iş gücü ve aday havuzu arasındaki yapısal yetkinlik açıkları
        </p>
      </div>

      {/* Decision Support Advisory */}
      <DecisionNotice statement="Yetkinlik açığı analizi; dış işe alım maliyetlerini azaltmak ve iç yetenek gelişim rotasyonlarını optimize etmek için İK yönetimine veri sağlar." />

      {/* Top 3 Critical Gap Highlights (Section 13) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-rose-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                1. En Yüksek Açık
              </span>
              <span className="text-2xl font-bold font-mono tabular-nums text-rose-700">
                %38
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-3">
              İleri Yaşam Desteği (ALS / ACLS)
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Yoğun bakım ve acil servis pozisyonlarında aranan seviye 4.2 iken, aday havuzu ortalaması 2.6 düzeyindedir.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs flex items-center justify-between text-slate-600">
            <span>Stratejik Aksiyon:</span>
            <strong className="text-blue-700 font-semibold">Dış İşe Alım & Resertifikasyon</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                2. Kritik Açık
              </span>
              <span className="text-2xl font-bold font-mono tabular-nums text-amber-700">
                %24
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-3">
              Yoğun Bakım Klinik Deneyimi
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Genel yoğun bakım ve KVC ünitelerinde 4/5 seviye talep edilirken genel aday profili 3.0 seviyesindedir.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs flex items-center justify-between text-slate-600">
            <span>Stratejik Aksiyon:</span>
            <strong className="text-blue-700 font-semibold">İç Süpervizyonlu Rotasyon</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                3. Gelişen Alan
              </span>
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-800">
                %18
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-3">
              Dijital Sağlık & HBYS Sistemleri
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Elektronik karar destek ve ileri HBYS modülü kullanımı için oryantasyon açığı tespit edilmiştir.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs flex items-center justify-between text-slate-600">
            <span>Stratejik Aksiyon:</span>
            <strong className="text-blue-700 font-semibold">Hizmet İçi E-Öğrenme</strong>
          </div>
        </div>
      </div>

      {/* Main Table: Competency Deficit Matrix */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Kurumsal Yetkinlik İhtiyaç & Açık Dağılım Tablosu
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pozisyon gereksinimleri (Talep) vs. Mevcut Havuz (Arz) Analizi
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {gaps.length} Yetkinlik İncelendi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Yetkinlik</th>
                <th className="py-3 px-4">Talep Eden Pozisyon</th>
                <th className="py-3 px-4">Gereken Ort. Seviye</th>
                <th className="py-3 px-4">Mevcut Havuz Ort.</th>
                <th className="py-3 px-4 min-w-[160px]">Açık Oranı (%)</th>
                <th className="py-3 px-4">Önerilen İK Stratejisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gaps.map((gap) => (
                <tr key={gap.competencyId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {gap.competencyName}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600">
                    {gap.demandCount} Pozisyon
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-800 font-medium">
                    {gap.averageRequiredLevel} / 5
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600">
                    {gap.talentPoolAverageLevel} / 5
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full ${
                            gap.severity === 'high'
                              ? 'bg-rose-500'
                              : gap.severity === 'medium'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(100, gap.deficitRate * 2.5)}%` }}
                        />
                      </div>
                      <span className="font-mono tabular-nums font-bold text-slate-900">
                        %{gap.deficitRate}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        gap.strategicAction === 'Dış İşe Alım'
                          ? 'text-rose-800 bg-rose-50 border-rose-200'
                          : gap.strategicAction === 'İç Hizmet İçi Eğitim'
                          ? 'text-amber-800 bg-amber-50 border-amber-200'
                          : 'text-blue-800 bg-blue-50 border-blue-200'
                      }`}
                    >
                      {gap.strategicAction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Readiness Grid */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Departman Bazlı Yetenek Hazırlık Düzeyi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Klinik departmanların açık kadro doluluk ve yetkinlik karşılama indeksleri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-xs font-bold text-slate-900">{dept.department}</h3>
                <span className="font-mono font-bold text-blue-700 text-xs">
                  %{dept.averageMatchRate} Uyum
                </span>
              </div>

              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${dept.averageMatchRate}%` }}
                />
              </div>

              <div className="space-y-1 text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span>Açık Pozisyon:</span>
                  <span className="font-mono font-medium text-slate-800">
                    {dept.openPositions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Değerlendirilen Aday:</span>
                  <span className="font-mono font-medium text-slate-800">
                    {dept.candidatesCount}
                  </span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Kritik İhtiyaç:</span>
                  <span className="font-medium truncate max-w-[130px]">
                    {dept.topGapCompetency}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
