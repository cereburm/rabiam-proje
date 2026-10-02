/**
 * HealthMatch API Client
 * Performs real HTTP REST calls to backend endpoints under `/api/*`
 * With resilient fallback and error handling.
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  activityId?: string;
  timestamp: string;
}

export class ApiClient {
  private static baseUrl = '/api';

  public static async get<T>(endpoint: string, fallbackResolver?: () => T): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`);
      if (res.ok) {
        const json = await res.json();
        return {
          data: json.data !== undefined ? json.data : json,
          status: res.status,
          message: json.message,
          timestamp: new Date().toISOString(),
        };
      }
      throw new Error(`HTTP error ${res.status}`);
    } catch (err) {
      if (fallbackResolver) {
        return {
          data: fallbackResolver(),
          status: 200,
          timestamp: new Date().toISOString(),
        };
      }
      throw err;
    }
  }

  public static async post<T, B = any>(endpoint: string, body: B, fallbackResolver?: (body: B) => T): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const json = await res.json();
        return {
          data: json.data !== undefined ? json.data : json,
          status: res.status,
          message: json.message,
          activityId: json.activityId,
          timestamp: new Date().toISOString(),
        };
      }
      throw new Error(`HTTP error ${res.status}`);
    } catch (err) {
      if (fallbackResolver) {
        return {
          data: fallbackResolver(body),
          status: 201,
          timestamp: new Date().toISOString(),
        };
      }
      throw err;
    }
  }

  public static async patch<T, B = any>(endpoint: string, body: B, fallbackResolver?: (body: B) => T): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const json = await res.json();
        return {
          data: json.data !== undefined ? json.data : json,
          status: res.status,
          message: json.message,
          timestamp: new Date().toISOString(),
        };
      }
      throw new Error(`HTTP error ${res.status}`);
    } catch (err) {
      if (fallbackResolver) {
        return {
          data: fallbackResolver(body),
          status: 200,
          timestamp: new Date().toISOString(),
        };
      }
      throw err;
    }
  }

  public static async delete<T>(endpoint: string, fallbackResolver?: () => T): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const json = await res.json();
        return {
          data: json.data !== undefined ? json.data : json,
          status: res.status,
          message: json.message,
          activityId: json.activityId,
          timestamp: new Date().toISOString(),
        };
      }
      throw new Error(`HTTP error ${res.status}`);
    } catch (err) {
      if (fallbackResolver) {
        return {
          data: fallbackResolver(),
          status: 200,
          timestamp: new Date().toISOString(),
        };
      }
      throw err;
    }
  }
}
