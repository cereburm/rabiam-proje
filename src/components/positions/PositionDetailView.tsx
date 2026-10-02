import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Briefcase,
  Users,
  Percent,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Star,
  UserCheck,
  UserX
} from 'lucide-react';
import { Position, MatchResult, Employee } from '../../types';
import { matchingService } from '../../services/matchingService';
import { ScoreDisplay } from '../common/ScoreDisplay';
import { DecisionNotice } from '../common/DecisionNotice';
import { IMPORTANCE_LABELS, CANDIDATE_STATUS_META } from '../../constants/branding';

interface PositionDetailViewProps {
  position: Position;
  employees: Employee[];
  onBack: () => void;
  onSelectCandidate: (candidateId: string, positionId: string) => void;
  onToggleFavorite?: (candidateId: string) => void;
  onCallInterview?: (candidateId: string) => void;
  onCancelInterview?: (candidateId: string) => void;
}

export const PositionDetailView: React.FC<PositionDetailViewProps> = ({
  position,
  employees,
  onBack,
  onSelectCandidate,
  onToggleFavorite,
  onCallInterview,
  onCancelInterview,
}) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'strong' | 'moderate'>('all');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    matchingService.getMatchesForPosition(position.id).then((res) => {
      if (mounted) {
        setMatches(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [position.id, employees]);

  // Filter candidates by match strength tab
  const filteredMatches = matches.filter((m) => {
    if (activeTab === 'strong') return m.breakdown.overallScore >= 85;
    if (activeTab === 'moderate') return m.breakdown.overallScore < 85 && m.breakdown.overallScore >= 70;
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation & Breadcrumb Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Pozisyon Listesine Dön</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          ID: {position.id}
        </span>
      </div>

      {/* Position Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {position.title}
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200">
                {position.status === 'active' ? 'Aktif Pozisyon' : position.status === 'in_review' ? 'İncelemede' : 'Kapalı'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {position.workType}
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              {position.description}
            </p>
          </div>

          {/* Quick Metrics Cluster */}
          <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-6 shrink-0">
            <div className="text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Başvuru
              </span>
              <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                {position.applicantsCount}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div className="text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Ortalama Uyum
              </span>
              <span className="text-xl font-bold font-mono tabular-nums text-blue-600">
                %{position.averageMatchScore}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div className="text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Min. Deneyim
              </span>
              <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                {position.experienceYearsRequired} Yıl
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Support Advisory */}
      <DecisionNotice score={position.averageMatchScore} />

      {/* SECTION A: POZİSYON GEREKSİNİMLERİ (Gereksinim Vektörü) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Pozisyon Gereksinim Vektörü (R)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              İki taraflı eşleştirmede kullanılan ağırlıklandırılmış yetkinlik beklentileri (Toplam Ağırlık = %100)
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {position.requirements.length} Yetkinlik Kriteri
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {position.requirements.map((req, idx) => {
            const importanceStyle = IMPORTANCE_LABELS[req.importance] || IMPORTANCE_LABELS.medium;
            return (
              <div
                key={req.competencyId || idx}
                className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-200 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 leading-snug">
                      {req.competencyName}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${importanceStyle.badge}`}
                    >
                      {importanceStyle.label}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono tabular-nums">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-sans">Ağırlık</span>
                    <span className="font-bold text-blue-700 text-sm">
                      %{req.weight}
                    </span>
                  </div>

                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-sans">Min. Seviye</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {req.requiredLevel} / 5
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION B: EŞLEŞEN ADAYLAR (Skorlara Göre Sıralı Liste) */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>İki Taraflı Uyum Analizi & Aday Sıralaması</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Gereksinim vektörü ile aday yetkinlik vektörlerinin optimizasyon sonucu
            </p>
          </div>

          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tüm Adaylar ({matches.length})
            </button>
            <button
              onClick={() => setActiveTab('strong')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'strong'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Güçlü Uyum (≥%85)
            </button>
            <button
              onClick={() => setActiveTab('moderate')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'moderate'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              İnceleme Önerilen
            </button>
          </div>
        </div>

        {/* Candidate List Card */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Eşleştirme motoru aday vektörlerini analiz ediyor...
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Bu filtre kriterinde aday bulunamadı.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredMatches.map((match, rank) => {
                const emp = employees.find((e) => e.id === match.employee.id) || match.employee;
                const breakdown = match.breakdown;
                const isTopDemo = emp.id === 'emp_ayse_yilmaz';
                const statusMeta = CANDIDATE_STATUS_META[emp.status] || CANDIDATE_STATUS_META.review_pending;

                return (
                  <div
                    key={emp.id}
                    onClick={() => onSelectCandidate(emp.id, position.id)}
                    className={`p-4 hover:bg-slate-50/90 transition-colors cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      isTopDemo ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    {/* Rank & Profile */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-mono tabular-nums font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                        #{rank + 1}
                      </div>

                      {/* Favorite Button */}
                      {onToggleFavorite && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(emp.id);
                          }}
                          title={emp.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                          className="p-1 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer shrink-0"
                        >
                          <Star className={`w-4 h-4 ${emp.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                        </button>
                      )}

                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-xs shrink-0 border border-blue-200">
                        {emp.name.split(' ').map((n) => n[0]).join('')}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors">
                            {emp.name}
                          </span>
                          {isTopDemo && (
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200">
                              Lider Aday
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-semibold border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                          >
                            <span className={`w-1 h-1 rounded-full ${statusMeta.dot}`} />
                            {statusMeta.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {emp.education} · {emp.experienceYears} Yıl Deneyim
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                          <span className="text-emerald-700 font-medium">
                            ✓ {breakdown.strongMatchCount} Güçlü Yetkinlik
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-500">
                            {breakdown.gapCount === 0 ? 'Tam Karşılama' : `${breakdown.gapCount} Gelişim Alanı`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown & Score */}
                    <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end">
                      {/* Sub-scores */}
                      <div className="hidden lg:flex items-center gap-4 text-right text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Yetkinlik</span>
                          <span className="font-mono tabular-nums font-semibold text-slate-800">
                            %{breakdown.competencyFitScore}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Deneyim</span>
                          <span className="font-mono tabular-nums font-semibold text-slate-800">
                            %{breakdown.experienceFitScore}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Temel Şart</span>
                          <span className="font-mono tabular-nums font-semibold text-slate-800">
                            %{breakdown.coreRequirementScore}
                          </span>
                        </div>
                      </div>

                      {/* Overall Match Circle / Display */}
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">Genel Uyum</span>
                        <ScoreDisplay score={breakdown.overallScore} size="sm" />
                      </div>

                      {/* Quick Interview action */}
                      {emp.status === 'interviewing' ? (
                        onCancelInterview && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCancelInterview(emp.id);
                            }}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            İptal
                          </button>
                        )
                      ) : (
                        onCallInterview && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCallInterview(emp.id);
                            }}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Mülakata Çağır
                          </button>
                        )
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCandidate(emp.id, position.id);
                        }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                      >
                        <span>İki Taraflı Karşılaştırma</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
