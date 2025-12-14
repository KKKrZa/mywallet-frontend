import { parseJwt } from "./utils";

const API_BASE_URL = "http://localhost:8000";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | null | undefined>;
}

export const TOKEN_KEY = "access_token";

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  
  const payload = parseJwt(token);
  if (!payload) return null;

  return {
    username: payload.sub || payload.username || "User",
    id: payload.id,
    email: payload.email,
    created_at: payload.created_at,
  };
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, params } = options;

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const token = getToken();
  const authHeader = token ? { "Authorization": `Bearer ${token}` } : {};

  const isFormData = body instanceof URLSearchParams;
  const contentTypeHeader = isFormData 
    ? { "Content-Type": "application/x-www-form-urlencoded" }
    : { "Content-Type": "application/json" };

  const config: RequestInit = {
    method,
    headers: {
      ...contentTypeHeader,
      ...authHeader,
      ...headers,
    } as HeadersInit,
    body: isFormData ? body.toString() : (body ? JSON.stringify(body) : undefined),
  };

  try {
    const response = await fetch(url.toString(), config);

    if (response.status === 401) {
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
        removeToken();
        window.location.href = "/login";
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API request failed: ${response.statusText}`);
    }
    
    // For 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}