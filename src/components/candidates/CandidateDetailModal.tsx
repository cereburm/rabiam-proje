import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Briefcase,
  Layers,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Award,
  ChevronRight,
  Send
} from 'lucide-react';
import { MatchResult, Employee } from '../../types';
import { ScoreDisplay } from '../common/ScoreDisplay';
import { DecisionNotice } from '../common/DecisionNotice';
import { employeeService } from '../../services/employeeService';
import { IMPORTANCE_LABELS, CATEGORY_LABELS } from '../../constants/branding';

interface CandidateDetailModalProps {
  matchResult: MatchResult;
  onClose: () => void;
  onStatusChange?: (candidateId: string, status: Employee['status']) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  matchResult,
  onClose,
  onStatusChange,
}) => {
  const { employee, position, breakdown, comparisons } = matchResult;
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState<string[]>(employee.notes || []);
  const [currentStatus, setCurrentStatus] = useState<Employee['status']>(employee.status);
  const [showActionSuccess, setShowActionSuccess] = useState<string | null>(null);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const newNote = noteInput.trim();
    setNotes([newNote, ...notes]);
    setNoteInput('');
    await employeeService.addNoteToEmployee(employee.id, newNote);
  };

  const handleUpdateStatus = async (status: Employee['status'], actionName: string) => {
    setCurrentStatus(status);
    await employeeService.updateEmployeeStatus(employee.id, status);
    if (onStatusChange) onStatusChange(employee.id, status);
    setShowActionSuccess(`${actionName} işlemi başarıyla kaydedildi.`);
    setTimeout(() => setShowActionSuccess(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-5xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal Bar */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-700 bg-blue-100/70 border border-blue-200 px-2 py-0.5 rounded">
              İki Taraflı Yetkinlik Karşılaştırması
            </span>
            <span className="text-xs text-slate-500">
              Pozisyon: <strong className="text-slate-800">{position.title}</strong>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Notification Alert if status updated */}
          {showActionSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{showActionSuccess}</span>
            </div>
          )}

          {/* Top Profile Summary Card */}
          <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-sm shrink-0">
                {employee.name.split(' ').map((n) => n[0]).join('')}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    {employee.name}
                  </h1>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-800">
                    {employee.title}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    {employee.education}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {employee.experienceYears} Yıl Klinik Deneyim
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {employee.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Overall Match Circle (Section A) */}
            <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6 shrink-0 w-full md:w-auto flex items-center justify-between md:justify-start">
              <ScoreDisplay score={breakdown.overallScore} size="lg" showLabel />
            </div>
          </div>

          {/* Section A Breakdown: Competency, Experience, Core Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs">
              <span className="text-[11px] text-slate-500 font-medium block">
                Yetkinlik Uyumu (Competency Fit)
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  %{breakdown.competencyFitScore}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">Ağırlıklı Vektör</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${breakdown.competencyFitScore}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs">
              <span className="text-[11px] text-slate-500 font-medium block">
                Deneyim Uyumu (Experience Fit)
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  %{breakdown.experienceFitScore}
                </span>
                <span className="text-[11px] text-slate-500">
                  {employee.experienceYears} yıl / Min. {position.experienceYearsRequired} yıl
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${breakdown.experienceFitScore}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs">
              <span className="text-[11px] text-slate-500 font-medium block">
                Temel Gereksinimler (Core Requirements)
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  %{breakdown.coreRequirementScore}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">Zorunlu Kriterler</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${breakdown.coreRequirementScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Decision Support Advisory Banner */}
          <DecisionNotice
            score={breakdown.overallScore}
            statement={breakdown.decisionSupportStatement}
          />

          {/* SECTION B: TWO-SIDED COMPETENCY COMPARISON (ÇOK ÖNEMLİ!) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>İki Taraflı Yetkinlik Karşılaştırması</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pozisyon Gereksinimi (Sol) vs. Aday Yetkinliği (Sağ) Vektör Eşleşmesi
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-100/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600 py-2.5 px-4">
                <div className="col-span-4 uppercase tracking-wider">Yetkinlik & Ağırlık</div>
                <div className="col-span-3 text-center uppercase tracking-wider">Pozisyon Gereksinimi</div>
                <div className="col-span-3 text-center uppercase tracking-wider">Aday Seviyesi</div>
                <div className="col-span-2 text-right uppercase tracking-wider">Uyum Durumu</div>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {comparisons.map((item) => {
                  const meets = item.candidateLevel >= item.requiredLevel;
                  const exceeds = item.candidateLevel > item.requiredLevel;
                  const deficit = item.candidateLevel < item.requiredLevel;

                  return (
                    <div
                      key={item.competencyId}
                      className={`grid grid-cols-12 items-center py-3 px-4 hover:bg-slate-50/70 transition-colors ${
                        deficit ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Competency & Weight */}
                      <div className="col-span-4 pr-3">
                        <div className="font-semibold text-slate-900 leading-snug">
                          {item.competencyName}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span className="font-mono tabular-nums text-blue-600 font-medium">
                            Ağırlık: %{item.weight}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{item.importance} Öncelik</span>
                        </div>
                      </div>

                      {/* Position Requirement (Left Side) */}
                      <div className="col-span-3 text-center">
                        <div className="inline-flex items-center gap-1 font-mono tabular-nums font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md text-xs">
                          <span>Gereksinim:</span>
                          <span className="text-blue-700">{item.requiredLevel} / 5</span>
                        </div>
                        <div className="flex justify-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <span
                              key={lvl}
                              className={`w-2 h-2 rounded-full ${
                                lvl <= item.requiredLevel ? 'bg-blue-600' : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Candidate Level (Right Side) */}
                      <div className="col-span-3 text-center">
                        <div className="inline-flex items-center gap-1 font-mono tabular-nums font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md text-xs">
                          <span>Aday:</span>
                          <span
                            className={
                              exceeds
                                ? 'text-emerald-700'
                                : meets
                                ? 'text-blue-700'
                                : 'text-amber-700'
                            }
                          >
                            {item.candidateLevel} / 5
                          </span>
                        </div>
                        <div className="flex justify-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <span
                              key={lvl}
                              className={`w-2 h-2 rounded-full ${
                                lvl <= item.candidateLevel
                                  ? exceeds
                                    ? 'bg-emerald-600'
                                    : 'bg-blue-600'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Status / Compliance */}
                      <div className="col-span-2 text-right">
                        <div className="font-mono tabular-nums font-bold text-slate-900">
                          %{item.complianceRate} Uyum
                        </div>
                        <span
                          className={`inline-block text-[10px] font-semibold mt-0.5 ${
                            exceeds
                              ? 'text-emerald-700'
                              : meets
                              ? 'text-blue-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {exceeds
                            ? 'Beklentiyi Aşıyor (+1)'
                            : meets
                            ? 'Tam Karşılıyor'
                            : `Eksik (${item.gap} Seviye)`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION C & D: STRONG MATCHES & DEVELOPMENT AREAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section C: Strong Matches */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Güçlü Eşleşmeler ({breakdown.strongMatches.length})</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {breakdown.strongMatches.map((name, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="font-medium text-slate-900">{name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section D: Development Areas (Gelişim Alanları) */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Gelişim Alanları & Eğitim İhtiyacı ({breakdown.developmentAreas.length})</span>
              </div>
              {breakdown.developmentAreas.length === 0 ? (
                <p className="text-xs text-slate-600">
                  Aday bu pozisyonun tüm temel gereksinimlerini eksiksiz karşılamaktadır. Ek gelişim ihtiyacı tespit edilmedi.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {breakdown.developmentAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white/80 rounded-lg border border-amber-200/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-900">
                        <span>{area.competencyName}</span>
                        <span className="text-amber-800 font-mono text-[11px]">
                          {area.currentLevel}/5 ➔ {area.requiredLevel}/5
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {area.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section: HR Specialist Notes & Actions */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span>İK Heyeti Görüşü & Notlar</span>
            </h4>

            {/* Notes List */}
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {notes.map((n, i) => (
                <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                  {n}
                </div>
              ))}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Aday hakkında İK değerlendirme notu ekleyin..."
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Notu Kaydet</span>
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer: Real Action Triggers */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Aday Durumu:{' '}
            <strong className="text-slate-800 capitalize">
              {currentStatus === 'interviewing'
                ? 'Mülakat Aşamasında'
                : currentStatus === 'placed'
                ? 'İşe Yerleştirildi'
                : 'İnceleme Bekliyor'}
            </strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleUpdateStatus('interviewing', 'Mülakat Çağrısı')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Mülakata Davet Et
            </button>
            <button
              onClick={() => handleUpdateStatus('placed', 'Göreve Atama')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Kabul & Görevlendirme Öner
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
