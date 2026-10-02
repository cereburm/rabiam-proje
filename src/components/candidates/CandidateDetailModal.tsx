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
  Send,
  Star,
  UserCheck,
  UserX,
  RotateCcw,
  Trash2,
  Clock,
  MapPin
} from 'lucide-react';
import { MatchResult, Employee, EmployeeStatus } from '../../types';
import { ScoreDisplay } from '../common/ScoreDisplay';
import { DecisionNotice } from '../common/DecisionNotice';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { employeeService } from '../../services/employeeService';
import { activityService } from '../../services/activityService';
import { IMPORTANCE_LABELS, CANDIDATE_STATUS_META } from '../../constants/branding';

interface CandidateDetailModalProps {
  matchResult: MatchResult;
  onClose: () => void;
  onStatusChange?: (candidateId: string, status: EmployeeStatus) => void;
  onTriggerToast: (toast: {
    type: 'success' | 'error' | 'info' | 'warning';
    title?: string;
    message: string;
    undoAction?: () => void;
  }) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  matchResult,
  onClose,
  onStatusChange,
  onTriggerToast,
}) => {
  const { employee, position, breakdown, comparisons } = matchResult;
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState<string[]>(employee.notes || []);
  const [currentStatus, setCurrentStatus] = useState<EmployeeStatus>(employee.status);
  const [isFavorite, setIsFavorite] = useState<boolean>(!!employee.isFavorite);
  const [interview, setInterview] = useState(employee.interview);
  const [isLoading, setIsLoading] = useState(false);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    variant: 'danger' | 'warning' | 'primary';
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Onayla',
    variant: 'danger',
    action: async () => {},
  });

  const statusMeta = CANDIDATE_STATUS_META[currentStatus] || CANDIDATE_STATUS_META.review_pending;

  // Favorite toggle
  const handleToggleFavorite = async () => {
    const newState = await employeeService.toggleFavorite(employee.id);
    setIsFavorite(newState);
    onTriggerToast({
      type: 'info',
      title: newState ? 'Favorilere Eklendi' : 'Favorilerden Çıkarıldı',
      message: `${employee.name} ${newState ? 'favori adaylar listenize eklendi' : 'favorilerinizden çıkarıldı'}.`,
    });
  };

  // Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const newNote = noteInput.trim();
    setNotes([newNote, ...notes]);
    setNoteInput('');
    await employeeService.addNoteToEmployee(employee.id, newNote);
    onTriggerToast({
      type: 'success',
      message: 'Değerlendirme notu kaydedildi.',
    });
  };

  // 1. Mülakata Çağır
  const handleCallToInterview = async () => {
    setIsLoading(true);
    try {
      const res = await employeeService.callToInterview(employee.id, {
        interviewer: 'Dr. Selin Demir (İK Direktörü)',
        location: 'Maslak Hastanesi Klinik Heyet Odası',
        notes: 'Yetkinlik uyum skoru yüksek; klinik vaka senaryoları incelenecek.',
      });

      setCurrentStatus('interviewing');
      setInterview(res.employee.interview);
      if (onStatusChange) onStatusChange(employee.id, 'interviewing');

      onTriggerToast({
        type: 'success',
        title: 'Mülakat Daveti İletildi',
        message: `${employee.name} mülakata çağrıldı.`,
        undoAction: () => {
          handleCancelInterview(true);
        },
      });
    } catch {
      onTriggerToast({
        type: 'error',
        message: 'İşlem gerçekleştirilemedi. Lütfen tekrar deneyin.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Mülakatı İptal Et (with Confirmation Dialog & Undo)
  const handleCancelInterview = async (skipConfirm = false) => {
    const executeCancel = async () => {
      setIsLoading(true);
      try {
        const res = await employeeService.cancelInterview(employee.id);
        setCurrentStatus('review_pending');
        setInterview(undefined);
        if (onStatusChange) onStatusChange(employee.id, 'review_pending');

        onTriggerToast({
          type: 'info',
          title: 'Mülakat İptal Edildi',
          message: `${employee.name} için planlanan mülakat iptal edildi ve aday inceleme havuzuna geri alındı.`,
          undoAction: () => {
            handleCallToInterview();
          },
        });
      } catch {
        onTriggerToast({
          type: 'error',
          message: 'İptal işlemi gerçekleştirilemedi.',
        });
      } finally {
        setIsLoading(false);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    };

    if (skipConfirm) {
      await executeCancel();
    } else {
      setConfirmDialog({
        isOpen: true,
        title: 'Mülakatı İptal Et',
        message: `"${employee.name}" adayının planlanan mülakat sürecini iptal edip adayı inceleme havuzuna geri almak istediğinizden emin misiniz?`,
        confirmText: 'Mülakatı İptal Et',
        variant: 'danger',
        action: executeCancel,
      });
    }
  };

  // 3. Kabul Et / Göreve Atama
  const handleAcceptCandidate = async () => {
    setIsLoading(true);
    const prev = currentStatus;
    try {
      await employeeService.updateEmployeeStatus(employee.id, 'placed');
      setCurrentStatus('placed');
      if (onStatusChange) onStatusChange(employee.id, 'placed');

      onTriggerToast({
        type: 'success',
        title: 'Aday Kabul Edildi',
        message: `${employee.name} pozisyon için uygun bulundu ve kabul edildi.`,
        undoAction: async () => {
          await employeeService.updateEmployeeStatus(employee.id, prev);
          setCurrentStatus(prev);
          if (onStatusChange) onStatusChange(employee.id, prev);
        },
      });
    } catch {
      onTriggerToast({ type: 'error', message: 'İşlem gerçekleştirilemedi.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Adayı Reddet (with Confirmation Dialog & Undo)
  const handleRejectCandidate = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Adayı Reddet',
      message: `"${employee.name}" adayının başvurusunu reddetmek istediğinizden emin misiniz? Bu işlem geri alınabilir.`,
      confirmText: 'Reddet',
      variant: 'danger',
      action: async () => {
        setIsLoading(true);
        const prev = currentStatus;
        try {
          await employeeService.updateEmployeeStatus(employee.id, 'rejected');
          setCurrentStatus('rejected');
          if (onStatusChange) onStatusChange(employee.id, 'rejected');

          onTriggerToast({
            type: 'warning',
            title: 'Aday Reddedildi',
            message: `${employee.name} başvurusu reddedildi.`,
            undoAction: async () => {
              await employeeService.updateEmployeeStatus(employee.id, prev);
              setCurrentStatus(prev);
              if (onStatusChange) onStatusChange(employee.id, prev);
            },
          });
        } catch {
          onTriggerToast({ type: 'error', message: 'İşlem gerçekleştirilemedi.' });
        } finally {
          setIsLoading(false);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-5xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header Modal Bar */}
          <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-blue-700 bg-blue-100/70 border border-blue-200 px-2.5 py-0.5 rounded-md">
                İki Taraflı Yetkinlik Karşılaştırması
              </span>
              <span className="text-xs text-slate-500">
                Pozisyon: <strong className="text-slate-800">{position.title}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Favorite Button */}
              <button
                onClick={handleToggleFavorite}
                title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-white text-slate-400 border-slate-200 hover:text-amber-500'
                }`}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
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

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                      {statusMeta.label}
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

            {/* Active Interview Status Banner if Candidate is being Interviewed */}
            {currentStatus === 'interviewing' && interview && (
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-blue-900">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>Mülakat Süreci Aktif</span>
                  </div>
                  <div className="text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Çağrı Tarihi: {new Date(interview.calledAt).toLocaleDateString('tr-TR')}
                    </span>
                    {interview.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {interview.location}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCancelInterview(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  Mülakatı İptal Et
                </button>
              </div>
            )}

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
                  <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 flex items-center justify-between gap-2">
                    <span>{n}</span>
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
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Notu Kaydet</span>
                </button>
              </form>
            </div>
          </div>

          {/* Modal Footer: Real Action Triggers (Requirement #2) */}
          <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Aday Durumu:</span>
              <strong className="text-slate-900 font-semibold">{statusMeta.label}</strong>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              {/* Interview Button & Cancel Interview Option */}
              {currentStatus === 'interviewing' ? (
                <>
                  <button
                    disabled
                    className="px-4 py-2 bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-default"
                  >
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>Mülakata Çağrıldı</span>
                  </button>
                  <button
                    onClick={() => handleCancelInterview(false)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Mülakatı İptal Et
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCallToInterview}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Mülakata Çağrılıyor...' : 'Mülakata Çağır'}</span>
                </button>
              )}

              {/* Accept & Placement Button */}
              {currentStatus !== 'placed' && (
                <button
                  onClick={handleAcceptCandidate}
                  disabled={isLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  Kabul & İşe Alım Öner
                </button>
              )}

              {/* Reject Button */}
              {currentStatus !== 'rejected' && (
                <button
                  onClick={handleRejectCandidate}
                  disabled={isLoading}
                  className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 hover:border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Reddet
                </button>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        variant={confirmDialog.variant}
        isLoading={isLoading}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};
