/**
 * Position Service Layer
 * GET /positions
 * GET /positions/:id
 * POST /positions
 * PATCH /positions/:id
 */

import { Position, PositionRequirement } from '../types';
import { MOCK_POSITIONS } from '../data/mockPositions';
import { ApiClient } from './apiClient';

const LOCAL_STORAGE_KEY = 'healthmatch_positions_store_v2';

function getInitialStore(): Position[] {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return JSON.parse(JSON.stringify(MOCK_POSITIONS));
}

let positionsStore: Position[] = getInitialStore();

function syncLocalStorage() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(positionsStore));
  } catch {}
}

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
    try {
      const response = await ApiClient.get<Position[]>('/positions', () => [...positionsStore]);
      if (response.data && Array.isArray(response.data)) {
        positionsStore = response.data;
        syncLocalStorage();
      }
      return positionsStore;
    } catch {
      return positionsStore;
    }
  },

  async getPositionById(id: string): Promise<Position | undefined> {
    try {
      const response = await ApiClient.get<Position | undefined>(`/positions/${id}`, () => {
        return positionsStore.find((p) => p.id === id);
      });
      return response.data;
    } catch {
      return positionsStore.find((p) => p.id === id);
    }
  },

  async createPosition(dto: CreatePositionDto): Promise<Position> {
    const fallback = (data: CreatePositionDto): Position => {
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
      syncLocalStorage();
      return newPosition;
    };

    try {
      const response = await ApiClient.post<Position, CreatePositionDto>('/positions', dto, fallback);
      const created = response.data;
      if (created && !positionsStore.some((p) => p.id === created.id)) {
        positionsStore.unshift(created);
        syncLocalStorage();
      }
      return created || fallback(dto);
    } catch {
      return fallback(dto);
    }
  },

  async updatePositionStatus(id: string, status: Position['status']): Promise<Position | undefined> {
    const index = positionsStore.findIndex((p) => p.id === id);

    const fallback = (): Position | undefined => {
      if (index !== -1) {
        positionsStore[index].status = status;
        syncLocalStorage();
        return positionsStore[index];
      }
      return undefined;
    };

    try {
      const res = await ApiClient.patch<Position | undefined>(`/positions/${id}`, { status }, fallback);
      if (index !== -1 && res.data) {
        positionsStore[index] = res.data;
        syncLocalStorage();
      }
      return positionsStore[index];
    } catch {
      return fallback();
    }
  },

  resetStore(): void {
    positionsStore = JSON.parse(JSON.stringify(MOCK_POSITIONS));
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
  }
};
