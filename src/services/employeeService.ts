/**
 * Employee & Talent Pool Service Layer
 * GET /employees
 * GET /employees/:id
 */

import { Employee } from '../types';
import { MOCK_EMPLOYEES } from '../data/mockEmployees';
import { ApiClient } from './apiClient';

let employeesStore: Employee[] = [...MOCK_EMPLOYEES];

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    const response = await ApiClient.get<Employee[]>('/employees', () => [...employeesStore]);
    return response.data;
  },

  async getEmployeeById(id: string): Promise<Employee | undefined> {
    const response = await ApiClient.get<Employee | undefined>(`/employees/${id}`, () => {
      return employeesStore.find((e) => e.id === id);
    });
    return response.data;
  },

  async updateEmployeeStatus(id: string, status: Employee['status']): Promise<Employee | undefined> {
    const response = await ApiClient.post<{ status: Employee['status'] }, { status: Employee['status'] }>(
      `/employees/${id}/status`,
      { status },
      (payload) => {
        const index = employeesStore.findIndex((e) => e.id === id);
        if (index !== -1) {
          employeesStore[index] = { ...employeesStore[index], status: payload.status };
          return employeesStore[index];
        }
        return payload;
      }
    );
    return employeesStore.find((e) => e.id === id);
  },

  async addNoteToEmployee(id: string, noteText: string): Promise<Employee | undefined> {
    const index = employeesStore.findIndex((e) => e.id === id);
    if (index !== -1) {
      const existingNotes = employeesStore[index].notes || [];
      employeesStore[index] = {
        ...employeesStore[index],
        notes: [noteText, ...existingNotes]
      };
      return employeesStore[index];
    }
    return undefined;
  },

  resetStore(): void {
    employeesStore = [...MOCK_EMPLOYEES];
  }
};
