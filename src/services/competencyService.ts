/**
 * Competency Repository Service Layer
 * GET /competencies
 * GET /competencies/:id
 */

import { Competency, CompetencyCategory } from '../types';
import { MOCK_COMPETENCIES } from '../data/mockCompetencies';
import { ApiClient } from './apiClient';

let competenciesStore: Competency[] = [...MOCK_COMPETENCIES];

export const competencyService = {
  async getCompetencies(): Promise<Competency[]> {
    const response = await ApiClient.get<Competency[]>('/competencies', () => [...competenciesStore]);
    return response.data;
  },

  async getCompetencyById(id: string): Promise<Competency | undefined> {
    const response = await ApiClient.get<Competency | undefined>(`/competencies/${id}`, () => {
      return competenciesStore.find((c) => c.id === id);
    });
    return response.data;
  },

  async getCompetenciesByCategory(category: CompetencyCategory): Promise<Competency[]> {
    const response = await ApiClient.get<Competency[]>(`/competencies?category=${category}`, () => {
      return competenciesStore.filter((c) => c.category === category);
    });
    return response.data;
  }
};
