/**
 * HealthMatch - Yetkinlik Bazlı Akıllı Eşleştirme Platformu
 * Sağlık İşletmeleri İK Karar Destek Sistemi
 */

import React, { useState, useEffect } from 'react';
import { Position, Employee, Competency, CompetencyGapReport, MatchResult } from './types';
import { positionService } from './services/positionService';
import { employeeService } from './services/employeeService';
import { competencyService } from './services/competencyService';
import { analyticsService } from './services/analyticsService';
import { matchingService } from './services/matchingService';

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

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [positions, setPositions] = useState<Position[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [gaps, setGaps] = useState<CompetencyGapReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Active drilldown states
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [inspectingCandidateId, setInspectingCandidateId] = useState<string | null>(null);
  const [inspectingPositionId, setInspectingPositionId] = useState<string | null>(null);
  const [activeMatchResult, setActiveMatchResult] = useState<MatchResult | null>(null);

  // Modals
  const [isNewPositionModalOpen, setIsNewPositionModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Initial Data Load from Service Layer
  const loadInitialData = async () => {
    try {
      const [posData, empData, compData, gapData] = await Promise.all([
        positionService.getPositions(),
        employeeService.getEmployees(),
        competencyService.getCompetencies(),
        analyticsService.getCompetencyGapReport(),
      ]);
      setPositions(posData);
      setEmployees(empData);
      setCompetencies(compData);
      setGaps(gapData);
    } catch (err) {
      console.error('Failed to load initial application state', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // When candidate inspection is triggered, calculate dynamic two-sided match
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
    });
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

  // Selected Position Object
  const currentSelectedPosition = selectedPositionId
    ? positions.find((p) => p.id === selectedPositionId)
    : null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'positions') {
            setSelectedPositionId(null);
          }
        }}
        openPositionsCount={positions.filter((p) => p.status === 'active').length}
      />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          breadcrumb={getBreadcrumb()}
          searchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
          onOpenNewPositionModal={() => setIsNewPositionModalOpen(true)}
          onOpenHelpModal={() => setIsHelpModalOpen(true)}
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
                  />
                )}

                {/* 2. Positions Tab (List or Detail) */}
                {currentTab === 'positions' && (
                  <>
                    {currentSelectedPosition ? (
                      <PositionDetailView
                        position={currentSelectedPosition}
                        onBack={() => setSelectedPositionId(null)}
                        onSelectCandidate={handleSelectCandidate}
                      />
                    ) : (
                      <PositionListView
                        positions={positions}
                        onSelectPosition={handleSelectPosition}
                        onOpenNewPositionModal={() => setIsNewPositionModalOpen(true)}
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
    </div>
  );
}
