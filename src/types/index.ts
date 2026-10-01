/**
 * HealthMatch Domain Models & Type Definitions
 * Açık proje gereksinimleri ile çalışan yetkinlik vektörlerini optimize eden iki taraflı eşleştirme sistemi
 */

export type CompetencyCategory = 
  | 'clinical'      // Klinik Yetkinlikler
  | 'technical'     // Teknik Yetkinlikler
  | 'managerial'    // Yönetimsel Yetkinlikler
  | 'communication' // İletişim Yetkinlikleri
  | 'digital'       // Dijital Sağlık Yetkinlikleri
  | 'leadership';   // Liderlik Yetkinlikleri

export type ImportanceLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Competency {
  id: string;
  name: string;
  category: CompetencyCategory;
  description: string;
  maxLevel: number; // Usually 5
  levelDescriptions?: Record<number, string>;
  usedInPositionsCount?: number;
}

export interface PositionRequirement {
  competencyId: string;
  competencyName?: string;
  requiredLevel: number; // 1 - 5
  weight: number;        // Percentage (0 - 100)
  importance: ImportanceLevel;
  isMandatory?: boolean;
}

export interface Position {
  id: string;
  title: string;
  department: string;
  status: 'active' | 'in_review' | 'closed';
  openDate: string;
  applicantsCount: number;
  averageMatchScore: number;
  workType: 'Tam Zamanlı' | 'Vardiyalı' | 'Yarı Zamanlı' | 'Proje Bazlı';
  experienceYearsRequired: number;
  description: string;
  requirements: PositionRequirement[];
}

export interface EmployeeCompetency {
  competencyId: string;
  competencyName?: string;
  level: number; // 1 - 5
  yearsOfPractice?: number;
  certified?: boolean;
  lastAssessedDate?: string;
}

export interface Employee {
  id: string;
  name: string;
  title: string;
  department: string;
  currentRole: string;
  experienceYears: number;
  education: string;
  email: string;
  phone: string;
  status: 'available' | 'interviewing' | 'review_pending' | 'placed';
  competencies: EmployeeCompetency[];
  notes?: string[];
  appliedPositionId?: string;
  avatarSeed?: string;
}

export interface CompetencyComparisonItem {
  competencyId: string;
  competencyName: string;
  category: CompetencyCategory;
  requiredLevel: number;
  candidateLevel: number;
  weight: number;
  importance: ImportanceLevel;
  complianceRate: number; // 0 - 100%
  status: 'exceeds' | 'meets' | 'deficit';
  gap: number; // candidateLevel - requiredLevel
}

export interface DevelopmentArea {
  competencyId: string;
  competencyName: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  importance: ImportanceLevel;
  recommendation: string;
}

export interface MatchBreakdown {
  overallScore: number;         // 0 - 100%
  competencyFitScore: number;   // 0 - 100%
  experienceFitScore: number;   // 0 - 100%
  coreRequirementScore: number; // 0 - 100%
  gapCount: number;
  strongMatchCount: number;
  strongMatches: string[];
  developmentAreas: DevelopmentArea[];
  decisionSupportLabel: string;
  decisionSupportTone: 'strong' | 'moderate' | 'cautious';
  decisionSupportStatement: string;
}

export interface MatchResult {
  employeeId: string;
  positionId: string;
  employee: Employee;
  position: Position;
  breakdown: MatchBreakdown;
  comparisons: CompetencyComparisonItem[];
}

export interface CompetencyGapReport {
  competencyId: string;
  competencyName: string;
  category: CompetencyCategory;
  demandCount: number;
  averageRequiredLevel: number;
  talentPoolAverageLevel: number;
  deficitRate: number; // Percentage
  severity: 'high' | 'medium' | 'low';
  strategicAction: 'Dış İşe Alım' | 'İç Hizmet İçi Eğitim' | 'Mentörlük & Rotasyon';
}

export interface DepartmentReadiness {
  department: string;
  openPositions: number;
  candidatesCount: number;
  averageMatchRate: number;
  topGapCompetency: string;
}
