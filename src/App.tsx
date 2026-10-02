/**
 * HealthMatch - Yetkinlik Bazlı Akıllı Eşleştirme Platformu
 * Sağlık İşletmeleri İK Karar Destek Sistemi
 * Production-ready full-stack client with state management, undo, search, audit trail and real interactions.
 */

import React, { useState, useEffect } from 'react';
import {
  Position,
  Employee,
  Competency,
  CompetencyGapReport,
  MatchResult,
  ActivityItem,
  EmployeeStatus
} from './types';
import { positionService } from './services/positionService';
import { employeeService } from './services/employeeService';
import { competencyService } from './services/competencyService';
import { analyticsService } from './services/analyticsService';
import { matchingService } from './services/matchingService';
import { activityService } from './services/activityService';

import { Sidebar, NavTab } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { PositionListView } from './components/positions/PositionListView';
import { PositionDetailView } from './components/positions/PositionDetailView';
import { CandidateListView } from './components/candidates/CandidateListView';
import { CandidateDetailModal } from './components/candidates/CandidateDetailModal';
import { CompetencyPoolView } from './components/competencies/CompetencyPoolView';
import { MatchingLabView } from './components/matching/MatchingLabView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { NewPositionModal } from './components/positions/NewPositionModal';
import { ModelArchitectureModal } from './components/common/ModelArchitectureModal';
import { ActivityHistoryDrawer } from './components/common/ActivityHistoryDrawer';
import { ToastNotification, ToastMessage } from './components/common/ToastNotification';
import { ConfirmationDialog } from './components/common/ConfirmationDialog';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [positions, setPositions] = useState<Position[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [gaps, setGaps] = useState<CompetencyGapReport[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Active drilldown states
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [inspectingCandidateId, setInspectingCandidateId] = useState<string | null>(null);
  const [inspectingPositionId, setInspectingPositionId] = useState<string | null>(null);
  const [activeMatchResult, setActiveMatchResult] = useState<MatchResult | null>(null);

  // Modals & Panels
  const [isNewPositionModalOpen, setIsNewPositionModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Confirmation Dialog
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

  // Toast helper
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [newToast, ...prev]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Data Load
  const loadInitialData = async () => {
    try {
      const [posData, empData, compData, gapData, actData] = await Promise.all([
        positionService.getPositions(),
        employeeService.getEmployees(),
        competencyService.getCompetencies(),
        analyticsService.getCompetencyGapReport(),
        activityService.getActivities(),
      ]);
      setPositions(posData);
      setEmployees(empData);
      setCompetencies(compData);
      setGaps(gapData);
      setActivities(actData);
    } catch (err) {
      console.error('Failed to load initial application state', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Recalculate two-sided match when inspecting candidate
  useEffect(() => {
    if (inspectingCandidateId) {
      const emp = employees.find((e) => e.id === inspectingCandidateId);
      const targetPosId =
        inspectingPositionId ||
        emp?.appliedPositionId ||
        selectedPositionId ||
        positions[0]?.id ||
        'pos_yogun_bakim_hemsiresi';

      matchingService.calculateMatch(targetPosId, inspectingCandidateId).then((result) => {
        setActiveMatchResult(result);
      });
    } else {
      setActiveMatchResult(null);
    }
  }, [inspectingCandidateId, inspectingPositionId, selectedPositionId, employees, positions]);

  // Handlers
  const handleSelectPosition = (positionId: string) => {
    setSelectedPositionId(positionId);
    setCurrentTab('positions');
  };

  const handleSelectCandidate = (candidateId: string, positionId?: string) => {
    setInspectingCandidateId(candidateId);
    if (positionId) {
      setInspectingPositionId(positionId);
    }
  };

  const handlePositionCreated = (newPositionId: string) => {
    setIsNewPositionModalOpen(false);
    loadInitialData().then(() => {
      setSelectedPositionId(newPositionId);
      setCurrentTab('positions');
      addToast({
        type: 'success',
        title: 'Pozisyon Oluşturuldu',
        message: 'Yeni açık pozisyon gereksinim vektörleri sisteme kaydedildi.',
      });
    });
  };

  // Favorite toggle
  const handleToggleFavorite = async (candidateId: string) => {
    const isFav = await employeeService.toggleFavorite(candidateId);
    setEmployees((prev) =>
      prev.map((e) => (e.id === candidateId ? { ...e, isFavorite: isFav } : e))
    );
    const candidate = employees.find((e) => e.id === candidateId);
    const act = activityService.addActivity({
      type: isFav ? 'favorite_added' : 'favorite_removed',
      title: isFav ? 'Favorilere Eklendi' : 'Favorilerden Çıkarıldı',
      description: `${candidate?.name || 'Aday'} favori adaylar listenize eklendi.`,
      actor: 'Dr. Selin Demir',
      entityType: 'candidate',
      entityId: candidateId,
      entityName: candidate?.name || 'Aday',
      canUndo: true,
    });
    setActivities((prev) => [act, ...prev]);

    addToast({
      type: 'info',
      title: isFav ? 'Favorilere Eklendi' : 'Favorilerden Çıkarıldı',
      message: `${candidate?.name || 'Aday'} ${isFav ? 'favorilerinize eklendi' : 'favorilerinizden çıkarıldı'}.`,
      undoAction: () => handleToggleFavorite(candidateId),
    });
  };

  // Call to interview
  const handleCallInterview = async (candidateId: string) => {
    const candidate = employees.find((e) => e.id === candidateId);
    try {
      const res = await employeeService.callToInterview(candidateId);
      setEmployees((prev) =>
        prev.map((e) => (e.id === candidateId ? res.employee : e))
      );
      const act = activityService.addActivity({
        type: 'interview_called',
        title: 'Mülakat Daveti İletildi',
        description: `${candidate?.name || 'Aday'} için mülakat süreci başlatıldı.`,
        actor: 'Dr. Selin Demir',
        entityType: 'candidate',
        entityId: candidateId,
        entityName: candidate?.name || 'Aday',
        previousState: 'review_pending',
        newState: 'interviewing',
        canUndo: true,
      });
      setActivities((prev) => [act, ...prev]);

      addToast({
        type: 'success',
        title: 'Mülakata Çağrıldı',
        message: `${candidate?.name} için mülakat süreci başlatıldı.`,
        undoAction: () => handleCancelInterview(candidateId, true),
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Mülakat daveti gönderilemedi.',
      });
    }
  };

  // Cancel interview
  const handleCancelInterview = async (candidateId: string, skipConfirm = false) => {
    const candidate = employees.find((e) => e.id === candidateId);

    const execute = async () => {
      try {
        const res = await employeeService.cancelInterview(candidateId);
        setEmployees((prev) =>
          prev.map((e) => (e.id === candidateId ? res.employee : e))
        );
        const act = activityService.addActivity({
          type: 'interview_cancelled',
          title: 'Mülakat İptal Edildi',
          description: `${candidate?.name || 'Aday'} mülakatı iptal edildi.`,
          actor: 'Dr. Selin Demir',
          entityType: 'candidate',
          entityId: candidateId,
          entityName: candidate?.name || 'Aday',
          previousState: 'interviewing',
          newState: 'review_pending',
          canUndo: true,
        });
        setActivities((prev) => [act, ...prev]);

        addToast({
          type: 'info',
          title: 'Mülakat İptal Edildi',
          message: `${candidate?.name} mülakatı iptal edildi ve aday inceleme havuzuna alındı.`,
          undoAction: () => handleCallInterview(candidateId),
        });
      } catch {
        addToast({
          type: 'error',
          message: 'Mülakat iptal işlemi gerçekleştirilemedi.',
        });
      } finally {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      }
    };

    if (skipConfirm) {
      await execute();
    } else {
      setConfirmDialog({
        isOpen: true,
        title: 'Mülakatı İptal Et',
        message: `"${candidate?.name}" adayının planlanan mülakatını iptal edip inceleme havuzuna geri almak istediğinizden emin misiniz?`,
        confirmText: 'Mülakatı İptal Et',
        variant: 'danger',
        action: execute,
      });
    }
  };

  // Position status update
  const handleUpdatePositionStatus = async (positionId: string, status: Position['status']) => {
    const updated = await positionService.updatePositionStatus(positionId, status);
    if (updated) {
      setPositions((prev) => prev.map((p) => (p.id === positionId ? updated : p)));
      addToast({
        type: 'success',
        title: 'Pozisyon Durumu Güncellendi',
        message: `Pozisyon "${status === 'active' ? 'Aktif' : status === 'in_review' ? 'İncelemede' : 'Kapalı'}" olarak ayarlandı.`,
      });
    }
  };

  // Undo activity
  const handleUndoActivity = async (activityId: string) => {
    const res = await activityService.undoActivity(activityId);
    if (res.success) {
      await loadInitialData();
      addToast({
        type: 'success',
        message: res.message || 'İşlem başarıyla geri alındı.',
      });
    } else {
      addToast({
        type: 'error',
        message: res.message || 'Geri alma işlemi başarısız.',
      });
    }
  };

  // Dynamic Breadcrumb
  const getBreadcrumb = (): string[] => {
    if (currentTab === 'dashboard') return ['Genel Görünüm'];
    if (currentTab === 'positions') {
      if (selectedPositionId) {
        const p = positions.find((pos) => pos.id === selectedPositionId);
        return ['Pozisyonlar', p ? p.title : selectedPositionId];
      }
      return ['Pozisyonlar'];
    }
    if (currentTab === 'candidates') return ['Aday & Yetenek Havuzu'];
    if (currentTab === 'competencies') return ['Yetkinlik Havuzu'];
    if (currentTab === 'matching') return ['Eşleştirme Motoru & Simülasyon'];
    if (currentTab === 'analytics') return ['Yetkinlik Açığı Analitiği'];
    return [];
  };

  const currentSelectedPosition = selectedPositionId
    ? positions.find((p) => p.id === selectedPositionId)
    : null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Left Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'positions') {
            setSelectedPositionId(null);
          }
        }}
        openPositionsCount={positions.filter((p) => p.status === 'active').length}
        candidatesCount={employees.length}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header with live search & audit trigger */}
        <Header
          breadcrumb={getBreadcrumb()}
          searchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
          onOpenNewPositionModal={() => setIsNewPositionModalOpen(true)}
          onOpenHelpModal={() => setIsHelpModalOpen(true)}
          onOpenActivityHistory={() => setIsActivityDrawerOpen(true)}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(true)}
          employees={employees}
          positions={positions}
          competencies={competencies}
          onSelectCandidate={handleSelectCandidate}
          onSelectPosition={handleSelectPosition}
        />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  HealthMatch yetkinlik veri tabanı yükleniyor...
                </p>
              </div>
            ) : (
              <>
                {/* 1. Dashboard View */}
                {currentTab === 'dashboard' && (
                  <DashboardView
                    positions={positions}
                    employees={employees}
                    gaps={gaps}
                    onSelectPosition={handleSelectPosition}
                    onSelectCandidate={handleSelectCandidate}
                    onNavigateToMatching={() => setCurrentTab('matching')}
                    onNavigateToPositions={() => {
                      setSelectedPositionId(null);
                      setCurrentTab('positions');
                    }}
                    onNavigateToAnalytics={() => setCurrentTab('analytics')}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}

                {/* 2. Positions Tab (List or Detail) */}
                {currentTab === 'positions' && (
                  <>
                    {currentSelectedPosition ? (
                      <PositionDetailView
                        position={currentSelectedPosition}
                        employees={employees}
                        onBack={() => setSelectedPositionId(null)}
                        onSelectCandidate={handleSelectCandidate}
                        onToggleFavorite={handleToggleFavorite}
                        onCallInterview={handleCallInterview}
                        onCancelInterview={handleCancelInterview}
                      />
                    ) : (
                      <PositionListView
                        positions={positions}
                        onSelectPosition={handleSelectPosition}
                        onOpenNewPositionModal={() => setIsNewPositionModalOpen(true)}
                        onUpdateStatus={handleUpdatePositionStatus}
                      />
                    )}
                  </>
                )}

                {/* 3. Candidates / Talent Pool Tab */}
                {currentTab === 'candidates' && (
                  <CandidateListView
                    employees={employees}
                    positions={positions}
                    onSelectCandidate={handleSelectCandidate}
                    onToggleFavorite={handleToggleFavorite}
                    onCallInterview={handleCallInterview}
                    onCancelInterview={handleCancelInterview}
                  />
                )}

                {/* 4. Competency Pool Tab */}
                {currentTab === 'competencies' && (
                  <CompetencyPoolView competencies={competencies} />
                )}

                {/* 5. Matching Engine & Playground Lab */}
                {currentTab === 'matching' && (
                  <MatchingLabView
                    positions={positions}
                    employees={employees}
                    onOpenCandidateDetail={(candidateId, positionId) => {
                      setInspectingCandidateId(candidateId);
                      setInspectingPositionId(positionId);
                    }}
                  />
                )}

                {/* 6. Competency Gap & Analytics Tab */}
                {currentTab === 'analytics' && <AnalyticsView positions={positions} />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Candidate Deep Profile & Two-Sided Comparison Modal */}
      {inspectingCandidateId && activeMatchResult && (
        <CandidateDetailModal
          matchResult={activeMatchResult}
          onClose={() => {
            setInspectingCandidateId(null);
            setInspectingPositionId(null);
            setActiveMatchResult(null);
          }}
          onStatusChange={async (candidateId, newStatus) => {
            setEmployees((prev) =>
              prev.map((e) => (e.id === candidateId ? { ...e, status: newStatus } : e))
            );
          }}
          onTriggerToast={addToast}
        />
      )}

      {/* New Position Creation Modal */}
      {isNewPositionModalOpen && (
        <NewPositionModal
          competencies={competencies}
          onClose={() => setIsNewPositionModalOpen(false)}
          onPositionCreated={handlePositionCreated}
        />
      )}

      {/* Academic Model Architecture Explainer Modal */}
      {isHelpModalOpen && (
        <ModelArchitectureModal onClose={() => setIsHelpModalOpen(false)} />
      )}

      {/* Activity History Audit Trail Drawer */}
      <ActivityHistoryDrawer
        isOpen={isActivityDrawerOpen}
        activities={activities}
        onClose={() => setIsActivityDrawerOpen(false)}
        onUndo={handleUndoActivity}
        onSelectCandidate={(id) => {
          setIsActivityDrawerOpen(false);
          handleSelectCandidate(id);
        }}
        onSelectPosition={(id) => {
          setIsActivityDrawerOpen(false);
          handleSelectPosition(id);
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Notification Container */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
