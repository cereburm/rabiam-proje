/**
 * Analytics & Competency Gap Service Layer
 * GET /analytics
 * GET /analytics/gaps
 * GET /analytics/departments
 */

import { CompetencyGapReport, DepartmentReadiness } from '../types';
import { positionService } from './positionService';
import { employeeService } from './employeeService';
import { competencyService } from './competencyService';
import { ApiClient } from './apiClient';

export interface DashboardKPIs {
  openPositionsCount: number;
  activeCandidatesCount: number;
  averageMatchRate: number;
  pendingReviewCount: number;
}

export const analyticsService = {
  /**
   * Ana Dashboard üst KPI metrikleri
   */
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    const positions = await positionService.getPositions();
    const employees = await employeeService.getEmployees();

    const activePositions = positions.filter((p) => p.status === 'active');
    const pendingReview = employees.filter((e) => e.status === 'review_pending').length;

    // Ortalama uyum
    const avgMatch = Math.round(
      positions.reduce((acc, curr) => acc + curr.averageMatchScore, 0) / (positions.length || 1)
    );

    return {
      openPositionsCount: activePositions.length,
      activeCandidatesCount: employees.length,
      averageMatchRate: avgMatch,
      pendingReviewCount: pendingReview,
    };
  },

  /**
   * Kurum Genelinde Yetkinlik Açığı Analizi (Competency Gap Report)
   * Açık pozisyonların talep ettiği seviyeler ile aday havuzundaki mevcut seviyelerin farkı
   */
  async getCompetencyGapReport(): Promise<CompetencyGapReport[]> {
    const positions = await positionService.getPositions();
    const employees = await employeeService.getEmployees();
    const competencies = await competencyService.getCompetencies();

    const response = await ApiClient.get<CompetencyGapReport[]>('/analytics/gaps', () => {
      const reports: CompetencyGapReport[] = [];

      for (const comp of competencies) {
        // Pozisyonlarda bu yetkinliğe olan talep
        let demandCount = 0;
        let totalRequiredLevel = 0;

        positions.forEach((pos) => {
          const req = pos.requirements.find((r) => r.competencyId === comp.id);
          if (req) {
            demandCount++;
            totalRequiredLevel += req.requiredLevel;
          }
        });

        if (demandCount === 0) continue;

        const averageRequiredLevel = Number((totalRequiredLevel / demandCount).toFixed(1));

        // Aday havuzundaki seviye
        let poolSum = 0;
        let poolCount = 0;
        employees.forEach((emp) => {
          const empComp = emp.competencies.find((c) => c.competencyId === comp.id);
          if (empComp) {
            poolSum += empComp.level;
            poolCount++;
          }
        });

        const talentPoolAverageLevel = poolCount > 0 ? Number((poolSum / poolCount).toFixed(1)) : 1.5;

        // Açık Oranı (%) = ((Gereken - Mevcut) / Gereken) * 100
        const rawDeficit = ((averageRequiredLevel - talentPoolAverageLevel) / averageRequiredLevel) * 100;
        const deficitRate = Math.max(0, Math.round(rawDeficit));

        let severity: 'high' | 'medium' | 'low' = 'low';
        if (deficitRate >= 25) severity = 'high';
        else if (deficitRate >= 15) severity = 'medium';

        let strategicAction: 'Dış İşe Alım' | 'İç Hizmet İçi Eğitim' | 'Mentörlük & Rotasyon' = 'Mentörlük & Rotasyon';
        if (severity === 'high') {
          strategicAction = 'Dış İşe Alım';
        } else if (severity === 'medium') {
          strategicAction = 'İç Hizmet İçi Eğitim';
        }

        reports.push({
          competencyId: comp.id,
          competencyName: comp.name,
          category: comp.category,
          demandCount,
          averageRequiredLevel,
          talentPoolAverageLevel,
          deficitRate,
          severity,
          strategicAction,
        });
      }

      // En yüksek açık oranına göre azalan sırala
      return reports.sort((a, b) => b.deficitRate - a.deficitRate);
    });

    return response.data;
  },

  /**
   * Departman bazlı hazırlık durumu ve kritik yetkinlik açığı
   */
  async getDepartmentReadiness(): Promise<DepartmentReadiness[]> {
    const response = await ApiClient.get<DepartmentReadiness[]>('/analytics/departments', () => {
      return [
        {
          department: 'Genel Yoğun Bakım',
          openPositions: 2,
          candidatesCount: 42,
          averageMatchRate: 81,
          topGapCompetency: 'İleri Yaşam Desteği (ACLS)',
        },
        {
          department: 'Acil Tıp Kliniği',
          openPositions: 1,
          candidatesCount: 38,
          averageMatchRate: 78,
          topGapCompetency: 'Afet Triyajı & Kriz Yönetimi',
        },
        {
          department: 'Biyomedikal & Mühendislik',
          openPositions: 1,
          candidatesCount: 19,
          averageMatchRate: 84,
          topGapCompetency: 'Ventilatör Kalibrasyonu',
        },
        {
          department: 'Hasta Hizmetleri',
          openPositions: 2,
          candidatesCount: 64,
          averageMatchRate: 86,
          topGapCompetency: 'De-eskalasyon & İletişim',
        },
        {
          department: 'Kalp ve Damar Cerrahisi',
          openPositions: 1,
          candidatesCount: 26,
          averageMatchRate: 79,
          topGapCompetency: 'İntraaortik Balon Pompası',
        },
      ];
    });
    return response.data;
  }
};
