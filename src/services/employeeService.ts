/**
 * Employee & Talent Pool Service Layer
 * GET /employees
 * GET /employees/:id
 * POST /employees/:id/interview
 * DELETE /employees/:id/interview
 * PATCH /employees/:id
 * POST /employees/:id/notes
 */

import { Employee, EmployeeStatus, InterviewDetails } from '../types';
import { MOCK_EMPLOYEES } from '../data/mockEmployees';
import { ApiClient } from './apiClient';

const LOCAL_STORAGE_KEY = 'healthmatch_employees_store_v2';

function getInitialStore(): Employee[] {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore storage errors
  }
  return JSON.parse(JSON.stringify(MOCK_EMPLOYEES));
}

let employeesStore: Employee[] = getInitialStore();

function syncLocalStorage() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employeesStore));
  } catch (e) {
    // Ignore
  }
}

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    try {
      const response = await ApiClient.get<Employee[]>('/employees', () => [...employeesStore]);
      if (response.data && Array.isArray(response.data)) {
        employeesStore = response.data;
        syncLocalStorage();
      }
      return employeesStore;
    } catch {
      return employeesStore;
    }
  },

  async getEmployeeById(id: string): Promise<Employee | undefined> {
    try {
      const response = await ApiClient.get<Employee | undefined>(`/employees/${id}`, () => {
        return employeesStore.find((e) => e.id === id);
      });
      return response.data;
    } catch {
      return employeesStore.find((e) => e.id === id);
    }
  },

  async callToInterview(id: string, details?: Partial<InterviewDetails>): Promise<{ employee: Employee; activityId?: string }> {
    const index = employeesStore.findIndex((e) => e.id === id);

    const fallback = (): { data: Employee; activityId: string } => {
      if (index !== -1) {
        employeesStore[index].status = 'interviewing';
        employeesStore[index].interview = {
          calledAt: new Date().toISOString(),
          scheduledAt: details?.scheduledAt || new Date(Date.now() + 3600000 * 48).toISOString(),
          interviewer: details?.interviewer || 'Dr. Selin Demir (İK Direktörü)',
          location: details?.location || 'Maslak Hastanesi Klinik Heyet Odası',
          status: 'called',
          notes: details?.notes,
        };
        syncLocalStorage();
        return { data: employeesStore[index], activityId: `act_${Date.now()}` };
      }
      throw new Error('Aday bulunamadı');
    };

    const res = await ApiClient.post<{ data: Employee; activityId?: string }>(
      `/employees/${id}/interview`,
      details || {},
      fallback
    );

    const updatedEmp = res.data?.data || (res.data as any)?.employee || employeesStore[index];
    if (index !== -1 && updatedEmp) {
      employeesStore[index] = updatedEmp;
      syncLocalStorage();
    }
    return { employee: updatedEmp, activityId: res.activityId || (res.data as any)?.activityId };
  },

  async cancelInterview(id: string): Promise<{ employee: Employee; activityId?: string }> {
    const index = employeesStore.findIndex((e) => e.id === id);

    const fallback = (): { data: Employee; activityId: string } => {
      if (index !== -1) {
        employeesStore[index].status = 'review_pending';
        employeesStore[index].interview = undefined;
        syncLocalStorage();
        return { data: employeesStore[index], activityId: `act_${Date.now()}` };
      }
      throw new Error('Aday bulunamadı');
    };

    const res = await ApiClient.delete<{ data: Employee; activityId?: string }>(
      `/employees/${id}/interview`,
      fallback
    );

    const updatedEmp = res.data?.data || (res.data as any)?.employee || employeesStore[index];
    if (index !== -1 && updatedEmp) {
      employeesStore[index] = updatedEmp;
      syncLocalStorage();
    }
    return { employee: updatedEmp, activityId: res.activityId || (res.data as any)?.activityId };
  },

  async updateEmployeeStatus(id: string, status: EmployeeStatus): Promise<Employee | undefined> {
    const index = employeesStore.findIndex((e) => e.id === id);

    const fallback = (): Employee | undefined => {
      if (index !== -1) {
        employeesStore[index].status = status;
        if (status === 'placed' || status === 'rejected' || status === 'cancelled') {
          if (employeesStore[index].interview) {
            employeesStore[index].interview!.status = status === 'placed' ? 'completed' : 'cancelled';
          }
        }
        syncLocalStorage();
        return employeesStore[index];
      }
      return undefined;
    };

    const res = await ApiClient.patch<Employee | undefined>(`/employees/${id}`, { status }, fallback);
    const updated = res.data;
    if (index !== -1 && updated) {
      employeesStore[index] = updated;
      syncLocalStorage();
    }
    return employeesStore[index];
  },

  async toggleFavorite(id: string): Promise<boolean> {
    const index = employeesStore.findIndex((e) => e.id === id);
    let newFavState = false;

    const fallback = () => {
      if (index !== -1) {
        newFavState = !employeesStore[index].isFavorite;
        employeesStore[index].isFavorite = newFavState;
        syncLocalStorage();
        return { isFavorite: newFavState };
      }
      return { isFavorite: false };
    };

    const res = await ApiClient.post<{ isFavorite: boolean }>(
      '/favorites/toggle',
      { type: 'candidate', id },
      fallback
    );

    const favResult = res.data?.isFavorite ?? newFavState;
    if (index !== -1) {
      employeesStore[index].isFavorite = favResult;
      syncLocalStorage();
    }
    return favResult;
  },

  async addNoteToEmployee(id: string, noteText: string): Promise<Employee | undefined> {
    const index = employeesStore.findIndex((e) => e.id === id);

    const fallback = (): Employee | undefined => {
      if (index !== -1) {
        const existing = employeesStore[index].notes || [];
        employeesStore[index].notes = [noteText, ...existing];
        syncLocalStorage();
        return employeesStore[index];
      }
      return undefined;
    };

    const res = await ApiClient.post<Employee | undefined>(`/employees/${id}/notes`, { noteText }, fallback);
    const updated = res.data;
    if (index !== -1 && updated) {
      employeesStore[index] = updated;
      syncLocalStorage();
    }
    return employeesStore[index];
  },

  resetStore(): void {
    employeesStore = JSON.parse(JSON.stringify(MOCK_EMPLOYEES));
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
  }
};
