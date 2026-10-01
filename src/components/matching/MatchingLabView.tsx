import React, { useState, useMemo } from 'react';
import {
  GitCompare,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Info,
  Scale
} from 'lucide-react';
import { Position, Employee, PositionRequirement } from '../../types';
import { matchingService } from '../../services/matchingService';
import { ScoreDisplay } from '../common/ScoreDisplay';
import { DecisionNotice } from '../common/DecisionNotice';

interface MatchingLabViewProps {
  positions: Position[];
  employees: Employee[];
  onOpenCandidateDetail: (candidateId: string, positionId: string) => void;
}

export const MatchingLabView: React.FC<MatchingLabViewProps> = ({
  positions,
  employees,
  onOpenCandidateDetail,
}) => {
  const [selectedPositionId, setSelectedPositionId] = useState<string>(
    positions[0]?.id || 'pos_yogun_bakim_hemsiresi'
  );
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    employees[0]?.id || 'emp_ayse_yilmaz'
  );

  // Editable weights for the current simulation
  const position = useMemo(
    () => positions.find((p) => p.id === selectedPositionId) || positions[0],
    [positions, selectedPositionId]
  );
  const employee = useMemo(
    () => employees.find((e) => e.id === selectedEmployeeId) || employees[0],
    [employees, selectedEmployeeId]
  );

  const [customWeights, setCustomWeights] = useState<Record<string, number>>({});

  // Sync initial weights when position changes
  React.useEffect(() => {
    if (position) {
      const initial: Record<string, number> = {};
      position.requirements.forEach((r) => {
        initial[r.competencyId] = r.weight;
      });
      setCustomWeights(initial);
    }
  }, [position]);

  const handleWeightChange = (competencyId: string, value: number) => {
    setCustomWeights((prev) => ({
      ...prev,
      [competencyId]: value,
    }));
  };

  const handleResetWeights = () => {
    if (position) {
      const initial: Record<string, number> = {};
      position.requirements.forEach((r) => {
        initial[r.competencyId] = r.weight;
      });
      setCustomWeights(initial);
    }
  };

  // Build simulated requirement list
  const simulatedRequirements: PositionRequirement[] = useMemo(() => {
    if (!position) return [];
    return position.requirements.map((r) => ({
      ...r,
      weight: customWeights[r.competencyId] !== undefined ? customWeights[r.competencyId] : r.weight,
    }));
  }, [position, customWeights]);

  const totalSimulatedWeight = useMemo(() => {
    return Object.values(customWeights).reduce((a, b) => a + b, 0);
  }, [customWeights]);

  // Run dynamic match
  const matchResult = useMemo(() => {
    if (!position || !employee) return null;
    return matchingService.simulateCustomMatch(
      position.title,
      simulatedRequirements,
      position.experienceYearsRequired,
      employee
    );
  }, [position, employee, simulatedRequirements]);

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-blue-600" />
          <span>Eşleştirme Motoru & İki Taraflı Optimizasyon Laboratuvarı</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Açık proje gereksinim vektörleri ile çalışan yetkinlik vektörlerinin etkileşimli simülasyon ortamı
        </p>
      </div>

      {/* Academic Architecture Diagram (Section 20) */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Akademik Model Mimarisi: İki Taraflı Eşleştirme Hattı (Two-Sided Matching Pipeline)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Sağlık İK Karar Destek Algoritması
          </span>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-blue-400 font-mono">01. GİRDİ</span>
            <div className="font-semibold text-slate-200 mt-1">Pozisyon Gereksinimleri</div>
            <span className="text-[10px] text-slate-500 mt-1">Klinik Standart</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-blue-400 font-mono">02. AĞIRLIK</span>
            <div className="font-semibold text-slate-200 mt-1">Yetkinlik Ağırlıklandırma</div>
            <span className="text-[10px] text-slate-500 mt-1">Σwᵢ = %100</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-emerald-400 font-mono">03. ADAY</span>
            <div className="font-semibold text-slate-200 mt-1">Çalışan Yetkinlik Vektörü</div>
            <span className="text-[10px] text-slate-500 mt-1">C = [c₁...cₙ]</span>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800/80 flex flex-col justify-between">
            <span className="text-[10px] text-amber-300 font-mono">04. MOTOR</span>
            <div className="font-semibold text-blue-200 mt-1">İki Taraflı Eşleştirme</div>
            <span className="text-[10px] text-blue-400 mt-1">Vektör Çarpımı</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-amber-400 font-mono">05. SKOR</span>
            <div className="font-semibold text-slate-200 mt-1">Uyum Skoru Hesabı</div>
            <span className="text-[10px] text-slate-500 mt-1">Normalize [0-100]</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-rose-400 font-mono">06. AÇIK</span>
            <div className="font-semibold text-slate-200 mt-1">Yetkinlik Açığı Analizi</div>
            <span className="text-[10px] text-slate-500 mt-1">Eğitim İhtiyacı</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] text-emerald-400 font-mono">07. ÇIKTI</span>
            <div className="font-semibold text-slate-200 mt-1">İK Karar Desteği</div>
            <span className="text-[10px] text-slate-500 mt-1">Uzman Onayı</span>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Test Parameters & Weight Sliders */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Simülasyon Parametreleri</span>
              </h3>
              <button
                onClick={handleResetWeights}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Varsayılan Ağırlıklar</span>
              </button>
            </div>

            {/* Position Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Açık Pozisyon Seçimi (Gereksinim Vektörü):
              </label>
              <select
                value={selectedPositionId}
                onChange={(e) => setSelectedPositionId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Candidate Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Aday / Çalışan Seçimi (Yetkinlik Vektörü):
              </label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} — {e.title} ({e.experienceYears} Yıl)
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Weights Adjuster */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">
                  Yetkinlik Ağırlıklarını Anlık Değiştir:
                </span>
                <span
                  className={`font-mono tabular-nums font-bold ${
                    totalSimulatedWeight === 100
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  Toplam: %{totalSimulatedWeight}
                </span>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {position.requirements.map((req) => {
                  const currentWeight =
                    customWeights[req.competencyId] !== undefined
                      ? customWeights[req.competencyId]
                      : req.weight;

                  return (
                    <div key={req.competencyId} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-800 font-medium truncate max-w-[200px]">
                          {req.competencyName}
                        </span>
                        <span className="font-mono tabular-nums font-bold text-blue-700">
                          %{currentWeight}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="5"
                        value={currentWeight}
                        onChange={(e) =>
                          handleWeightChange(req.competencyId, Number(e.target.value))
                        }
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Real-time Recalculated Output */}
        <div className="lg:col-span-7 space-y-4">
          {matchResult ? (
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-5">
              {/* Output Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider block">
                    Anlık Optimizasyon Sonucu
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {employee.name} ➔ {position.title}
                  </h3>
                </div>

                <ScoreDisplay score={matchResult.breakdown.overallScore} size="lg" showLabel />
              </div>

              {/* Sub-scores metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 block">Yetkinlik Uyumu</span>
                  <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                    %{matchResult.breakdown.competencyFitScore}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 block">Deneyim Uyumu</span>
                  <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                    %{matchResult.breakdown.experienceFitScore}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 block">Temel Şartlar</span>
                  <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                    %{matchResult.breakdown.coreRequirementScore}
                  </span>
                </div>
              </div>

              {/* Live Vector Comparison Items */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-800">
                  Yetkinlik Vektörleri Karşılaştırma Matrisi:
                </div>
                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 text-xs">
                  {matchResult.comparisons.map((c) => (
                    <div
                      key={c.competencyId}
                      className="p-2.5 flex items-center justify-between gap-3 hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 truncate">
                          {c.competencyName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Simüle Ağırlık: %{c.weight}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
                        <span className="text-slate-500">
                          Beklenen: <strong>{c.requiredLevel}/5</strong>
                        </span>
                        <span className="text-blue-700">
                          Aday: <strong>{c.candidateLevel}/5</strong>
                        </span>
                        <span
                          className={`font-semibold ${
                            c.candidateLevel >= c.requiredLevel
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          %{c.complianceRate} Uyum
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision support note */}
              <DecisionNotice
                score={matchResult.breakdown.overallScore}
                statement={matchResult.breakdown.decisionSupportStatement}
              />

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => onOpenCandidateDetail(employee.id, position.id)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <span>Tam Profil Raporunu Aç</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
