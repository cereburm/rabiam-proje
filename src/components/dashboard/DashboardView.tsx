import React from 'react';
import {
  Briefcase,
  Users,
  Percent,
  Clock,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  GitCompare,
  CheckCircle2
} from 'lucide-react';
import { Position, Employee, CompetencyGapReport } from '../../types';
import { MetricCard } from '../common/MetricCard';
import { ScoreDisplay } from '../common/ScoreDisplay';
import { DecisionNotice } from '../common/DecisionNotice';

interface DashboardViewProps {
  positions: Position[];
  employees: Employee[];
  gaps: CompetencyGapReport[];
  onSelectPosition: (positionId: string) => void;
  onSelectCandidate: (candidateId: string, positionId?: string) => void;
  onNavigateToMatching: () => void;
  onNavigateToPositions: () => void;
  onNavigateToAnalytics: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  positions,
  employees,
  gaps,
  onSelectPosition,
  onSelectCandidate,
  onNavigateToMatching,
  onNavigateToPositions,
  onNavigateToAnalytics,
}) => {
  // Top matched candidates spotlight
  const featuredCandidates = [
    {
      id: 'emp_ayse_yilmaz',
      name: 'Ayşe Yılmaz',
      role: 'Yoğun Bakım Hemşiresi Adayı',
      targetPositionId: 'pos_yogun_bakim_hemsiresi',
      positionTitle: 'Yoğun Bakım Hemşiresi',
      score: 94,
      experience: '5 Yıl Deneyim',
      strongPoints: 'Yoğun Bakım (5/5), Resüsitasyon (5/5), EKG (4/5)',
      statusText: 'İnceleme Bekliyor',
    },
    {
      id: 'emp_burak_sahin',
      name: 'Burak Şahin',
      role: 'Acil Tıp Hemşiresi Adayı',
      targetPositionId: 'pos_acil_servis_hemsiresi',
      positionTitle: 'Acil Servis Hemşiresi',
      score: 91,
      experience: '4 Yıl Deneyim',
      strongPoints: 'Triyaj (5/5), Resüsitasyon (5/5), Kriz Yönetimi (4/5)',
      statusText: 'Mülakat Aşamasında',
    },
    {
      id: 'emp_mehmet_kaya',
      name: 'Mehmet Kaya',
      role: 'Yoğun Bakım Hemşiresi Adayı',
      targetPositionId: 'pos_yogun_bakim_hemsiresi',
      positionTitle: 'Yoğun Bakım Hemşiresi',
      score: 87,
      experience: '4 Yıl Deneyim',
      strongPoints: 'Ventilatör Yönetimi, Hasta Takibi (5/5)',
      statusText: 'Mülakat Aşamasında',
    },
    {
      id: 'emp_deniz_arslan',
      name: 'Deniz Arslan',
      role: 'Biyomedikal Teknikeri Adayı',
      targetPositionId: 'pos_biyomedikal_teknikeri',
      positionTitle: 'Sağlık Teknikeri - Biyomedikal',
      score: 85,
      experience: '5 Yıl Deneyim',
      strongPoints: 'Tıbbi Cihaz Kalibrasyonu (5/5), JCI Kalite (4/5)',
      statusText: 'İnceleme Bekliyor',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Merhaba, İK Yöneticisi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bugünkü işe alım ve yetkinlik görünümünüz — Sağlık işletmesi için iki taraflı optimizasyon motoru devrede.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onNavigateToMatching}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            <GitCompare className="w-4 h-4 text-blue-400" />
            <span>Eşleştirme Laboratuvarı</span>
          </button>
        </div>
      </div>

      {/* Decision Support Advisory Banner */}
      <DecisionNotice />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Açık Pozisyonlar"
          value="12"
          subtext="6 aktif klinik birim"
          trendText="+2 bu ay"
          trendDirection="up"
          icon={Briefcase}
        />
        <MetricCard
          label="Aktif Aday Havuzu"
          value="248"
          subtext="Doğrulanmış yetkinlik vektörü"
          trendText="+18 yeni"
          trendDirection="up"
          icon={Users}
        />
        <MetricCard
          label="Ortalama Uyum Skoru"
          value="%82"
          subtext="Açık gereksinim optimizasyonu"
          trendText="+4.2%"
          trendDirection="up"
          icon={Percent}
        />
        <MetricCard
          label="İnceleme Bekleyen Adaylar"
          value="27"
          subtext="İK komisyonu inceleme havuzunda"
          trendText="Öncelikli 8 aday"
          trendDirection="down"
          icon={Clock}
        />
      </div>

      {/* Main Content Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Open Positions Awaiting Action */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Öncelikli Açık Pozisyonlar
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gereksinim vektörlerine göre anlık eşleştirilen aktif pozisyonlar
                </p>
              </div>
              <button
                onClick={onNavigateToPositions}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Tümünü Gör ({positions.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {positions.slice(0, 4).map((pos) => (
                <div
                  key={pos.id}
                  onClick={() => onSelectPosition(pos.id)}
                  className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors truncate">
                        {pos.title}
                      </span>
                      {pos.id === 'pos_yogun_bakim_hemsiresi' && (
                        <span className="text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                          Öne Çıkan Demo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{pos.department}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{pos.applicantsCount} Başvuru</span>
                      <span aria-hidden="true">·</span>
                      <span>Min. {pos.experienceYearsRequired} Yıl Deneyim</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Ortalama Uyum</div>
                      <ScoreDisplay score={pos.averageMatchScore} size="sm" />
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPosition(pos.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Adayları İncele</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Ranked Candidate Matches Spotlight */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  En Yüksek Uyum Gösteren Adaylar
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pozisyon gereksinim vektörleriyle iki taraflı eşleşen lider aday profilleri
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {featuredCandidates.map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => onSelectCandidate(cand.id, cand.targetPositionId)}
                  className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-xs shrink-0 border border-blue-200">
                      {cand.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {cand.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({cand.experience})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        Hedef: <strong className="text-slate-700">{cand.positionTitle}</strong>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        Güçlü: {cand.strongPoints}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Genel Uyum</span>
                      <ScoreDisplay score={cand.score} size="sm" />
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCandidate(cand.id, cand.targetPositionId);
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Vektör Analizi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Competency Gaps & Workforce Intelligence */}
        <div className="space-y-6">
          {/* Quick Gap Analysis Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Yetkinlik Açığı Analizi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kuruluşun hangi yetkinliklere acil ihtiyacı var?
                </p>
              </div>
              <button
                onClick={onNavigateToAnalytics}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Detay
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {gaps.slice(0, 4).map((gap) => (
                <div key={gap.competencyId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate">
                      {gap.competencyName}
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-rose-700">
                      %{gap.deficitRate} Açık
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${Math.min(100, gap.deficitRate * 2.2)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Gereken: {gap.averageRequiredLevel}/5</span>
                    <span>Havuz: {gap.talentPoolAverageLevel}/5</span>
                    <span className="text-slate-600 font-medium">{gap.strategicAction}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={onNavigateToAnalytics}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Tüm Açık Raporunu İncele</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Academic Algorithm Flow Snapshot */}
          <div className="bg-slate-900 text-slate-200 p-5 rounded-xl border border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>İki Taraflı Eşleştirme Motoru</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pozisyon gereksinim ağırlıkları ile çalışan yetkinlik seviyeleri vektörel olarak karşılaştırılır, normalize uyum katsayısı üretilir.
            </p>

            <div className="space-y-1.5 text-[11px] font-mono text-slate-400 pt-1">
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                <span>R (Gereksinim Vektörü):</span>
                <span className="text-blue-400">[w₁, r₁ ··· wₙ, rₙ]</span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                <span>C (Aday Yetkinlik Vektörü):</span>
                <span className="text-emerald-400">[c₁, c₂ ··· cₙ]</span>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800 flex justify-between">
                <span>Match Score:</span>
                <span className="text-amber-400">Σ(wᵢ × min(1, cᵢ/rᵢ))</span>
              </div>
            </div>

            <button
              onClick={onNavigateToMatching}
              className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Algoritma Simülasyonunu Başlat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
