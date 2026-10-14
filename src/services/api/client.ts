/**
 * MandiMind Centralized HTTP Client
 * Prepares robust abstraction for future backend endpoints, microservices, and AGMARKNET APIs.
 */

export interface ApiClientConfig {
  baseUrl: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  public status: number;
  public code: string;
  public details?: unknown;

  constructor(message: string, status: number = 500, code: string = 'API_ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

class HttpClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    this.defaultTimeout = 15000;
  }

  public setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public isMockModeEnabled(): boolean {
    const mockEnv = import.meta.env.VITE_USE_MOCK_API;
    // Default to false so that live server.ts endpoints are used
    return mockEnv === 'true';
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = 1
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.defaultTimeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        if (response.status === 401) {
          throw new ApiError('Session expired. Please log in again.', 401, 'UNAUTHORIZED', errorData);
        }
        if (response.status === 403) {
          throw new ApiError('Access forbidden to this resource.', 403, 'FORBIDDEN', errorData);
        }
        if (response.status === 404) {
          throw new ApiError('Requested agricultural resource was not found.', 404, 'NOT_FOUND', errorData);
        }

        throw new ApiError(
          errorData.message || `Request failed with status ${response.status}`,
          response.status,
          errorData.code || 'SERVER_ERROR',
          errorData
        );
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timer);

      if (err.name === 'AbortError') {
        throw new ApiError('Request timed out. Please check your connectivity and retry.', 408, 'TIMEOUT');
      }

      if (retries > 0 && !(err instanceof ApiError && err.status < 500)) {
        await new Promise((r) => setTimeout(r, 600));
        return this.request<T>(endpoint, options, retries - 1);
      }

      if (err instanceof ApiError) {
        throw err;
      }

      throw new ApiError(
        err.message || 'Unable to connect to the MandiMind API service.',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  public get<T>(endpoint: string, queryParams?: Record<string, string | number | boolean | undefined>): Promise<T> {
    let qs = '';
    if (queryParams) {
      const filtered = Object.entries(queryParams)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
      if (filtered.length > 0) {
        qs = `?${filtered.join('&')}`;
      }
    }
    return this.request<T>(`${endpoint}${qs}`, { method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new HttpClient();
