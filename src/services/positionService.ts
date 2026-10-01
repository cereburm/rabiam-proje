/**
 * Position Service Layer
 * GET /positions
 * GET /positions/:id
 * POST /positions
 */

import { Position, PositionRequirement } from '../types';
import { MOCK_POSITIONS } from '../data/mockPositions';
import { ApiClient } from './apiClient';

let positionsStore: Position[] = [...MOCK_POSITIONS];

export interface CreatePositionDto {
  title: string;
  department: string;
  description: string;
  workType: Position['workType'];
  experienceYearsRequired: number;
  requirements: PositionRequirement[];
}

export const positionService = {
  async getPositions(): Promise<Position[]> {
    const response = await ApiClient.get<Position[]>('/positions', () => [...positionsStore]);
    return response.data;
  },

  async getPositionById(id: string): Promise<Position | undefined> {
    const response = await ApiClient.get<Position | undefined>(`/positions/${id}`, () => {
      return positionsStore.find((p) => p.id === id);
    });
    return response.data;
  },

  async createPosition(dto: CreatePositionDto): Promise<Position> {
    const response = await ApiClient.post<Position, CreatePositionDto>('/positions', dto, (data) => {
      const newPosition: Position = {
        id: `pos_${Date.now()}`,
        title: data.title,
        department: data.department,
        status: 'active',
        openDate: new Date().toISOString().split('T')[0],
        applicantsCount: 0,
        averageMatchScore: 80,
        workType: data.workType,
        experienceYearsRequired: data.experienceYearsRequired,
        description: data.description,
        requirements: data.requirements,
      };
      positionsStore = [newPosition, ...positionsStore];
      return newPosition;
    });
    return response.data;
  },

  resetStore(): void {
    positionsStore = [...MOCK_POSITIONS];
  }
};
