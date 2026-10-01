/**
 * HealthMatch API Client Abstraction Layer
 * Bu katman gelecekteki REST / GraphQL backend entegrasyonu için tek temas noktasıdır.
 * Gerçek backend'e geçildiğinde sadece fetch/axios çağrıları bu modüle eklenir.
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
}

export class ApiClient {
  private static simulateLatencyMs = 80;

  public static async get<T>(endpoint: string, mockResolver: () => T): Promise<ApiResponse<T>> {
    // Gelecekte: return fetch(`/api${endpoint}`).then(res => res.json());
    if (this.simulateLatencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.simulateLatencyMs));
    }
    return {
      data: mockResolver(),
      status: 200,
      timestamp: new Date().toISOString(),
    };
  }

  public static async post<T, B>(endpoint: string, body: B, mockResolver: (body: B) => T): Promise<ApiResponse<T>> {
    // Gelecekte: return fetch(`/api${endpoint}`, { method: 'POST', body: JSON.stringify(body) });
    if (this.simulateLatencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.simulateLatencyMs));
    }
    return {
      data: mockResolver(body),
      status: 201,
      timestamp: new Date().toISOString(),
    };
  }
}
