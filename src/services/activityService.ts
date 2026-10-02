/**
 * Activity Log & Undo Service Layer
 * GET /activities
 * POST /activities/undo/:id
 */

import { ActivityItem } from '../types';
import { ApiClient } from './apiClient';

const LOCAL_STORAGE_KEY = 'healthmatch_activities_store_v2';

const initialActivities: ActivityItem[] = [
  {
    id: 'act_init_1',
    type: 'position_created',
    title: 'Pozisyon Yayınlandı',
    description: 'Yoğun Bakım Hemşiresi açık pozisyon gereksinim vektörleri tanımlandı.',
    timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    actor: 'Dr. Selin Demir',
    entityType: 'position',
    entityId: 'pos_yogun_bakim_hemsiresi',
    entityName: 'Yoğun Bakım Hemşiresi',
    canUndo: false,
  },
  {
    id: 'act_init_2',
    type: 'interview_called',
    title: 'Mülakat Daveti Gönderildi',
    description: 'Mehmet Kaya için Cerrahi Yoğun Bakım mülakat süreci başlatıldı.',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    actor: 'Dr. Selin Demir',
    entityType: 'candidate',
    entityId: 'emp_mehmet_kaya',
    entityName: 'Mehmet Kaya',
    previousState: 'review_pending',
    newState: 'interviewing',
    canUndo: true,
  },
];

function getInitialStore(): ActivityItem[] {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [...initialActivities];
}

let activitiesStore: ActivityItem[] = getInitialStore();

function syncLocalStorage() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activitiesStore));
  } catch {}
}

export const activityService = {
  async getActivities(): Promise<ActivityItem[]> {
    try {
      const res = await ApiClient.get<ActivityItem[]>('/activities', () => [...activitiesStore]);
      if (res.data && Array.isArray(res.data)) {
        activitiesStore = res.data;
        syncLocalStorage();
      }
      return activitiesStore;
    } catch {
      return activitiesStore;
    }
  },

  addActivity(item: Omit<ActivityItem, 'id' | 'timestamp'>): ActivityItem {
    const newAct: ActivityItem = {
      ...item,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    activitiesStore = [newAct, ...activitiesStore.slice(0, 49)];
    syncLocalStorage();
    return newAct;
  },

  async undoActivity(id: string): Promise<{ success: boolean; message: string; employee?: any }> {
    const act = activitiesStore.find((a) => a.id === id);
    if (!act || !act.canUndo) {
      return { success: false, message: 'İşlem geri alınabilir durumda değil.' };
    }

    const fallback = () => {
      act.canUndo = false;
      const undoLog: ActivityItem = {
        id: `act_${Date.now()}`,
        type: 'status_changed',
        title: 'İşlem Geri Alındı',
        description: `"${act.title}" işlemi geri alındı.`,
        timestamp: new Date().toISOString(),
        actor: 'Dr. Selin Demir',
        entityType: act.entityType,
        entityId: act.entityId,
        entityName: act.entityName,
        canUndo: false,
      };
      activitiesStore = [undoLog, ...activitiesStore];
      syncLocalStorage();
      return { message: 'İşlem geri alındı' };
    };

    try {
      const res = await ApiClient.post<{ message: string; employee?: any }>(
        `/activities/undo/${id}`,
        {},
        fallback
      );
      act.canUndo = false;
      syncLocalStorage();
      return { success: true, message: res.data?.message || 'İşlem geri alındı.', employee: res.data?.employee };
    } catch {
      fallback();
      return { success: true, message: 'İşlem yerel olarak geri alındı.' };
    }
  },
};
