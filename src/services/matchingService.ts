/**
 * Matching Service Layer
 * GET /matching/position/:positionId
 * GET /matching/employee/:employeeId
 * POST /matching/calculate
 */

import { MatchResult, Position, Employee, PositionRequirement } from '../types';
import { MatchingEngine } from '../engine/matchingEngine';
import { positionService } from './positionService';
import { employeeService } from './employeeService';
import { ApiClient } from './apiClient';

export const matchingService = {
  /**
   * Belirli bir pozisyon için tüm aday havuzunu tarayıp eşleşme skoruna göre sıralar.
   */
  async getMatchesForPosition(positionId: string): Promise<MatchResult[]> {
    const position = await positionService.getPositionById(positionId);
    const employees = await employeeService.getEmployees();

    if (!position) return [];

    const response = await ApiClient.get<MatchResult[]>(`/matching/position/${positionId}`, () => {
      return MatchingEngine.rankCandidatesForPosition(position, employees);
    });
    return response.data;
  },

  /**
   * Belirli bir pozisyon ve aday arasındaki iki taraflı karşılaştırmayı ve skor kırılımını hesaplar.
   */
  async calculateMatch(positionId: string, employeeId: string): Promise<MatchResult | null> {
    const position = await positionService.getPositionById(positionId);
    const employee = await employeeService.getEmployeeById(employeeId);

    if (!position || !employee) return null;

    const response = await ApiClient.post<MatchResult, { positionId: string; employeeId: string }>(
      '/matching/calculate',
      { positionId, employeeId },
      () => MatchingEngine.calculateMatch(position, employee)
    );
    return response.data;
  },

  /**
   * Eşleştirme laboratuvarı (Playground) için dinamik gereksinim vektörü ile anlık hesaplama.
   */
  simulateCustomMatch(
    customTitle: string,
    customRequirements: PositionRequirement[],
    experienceYearsRequired: number,
    employee: Employee
  ): MatchResult {
    const simulatedPosition: Position = {
      id: 'simulated_pos',
      title: customTitle || 'Simüle Edilen Pozisyon',
      department: 'Simülasyon Departmanı',
      status: 'active',
      openDate: new Date().toISOString().split('T')[0],
      applicantsCount: 1,
      averageMatchScore: 0,
      workType: 'Tam Zamanlı',
      experienceYearsRequired,
      description: 'Dinamik gereksinim ağırlıkları ile simülasyon testi.',
      requirements: customRequirements,
    };
    return MatchingEngine.calculateMatch(simulatedPosition, employee);
  }
};
