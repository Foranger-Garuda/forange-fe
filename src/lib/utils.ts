import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function apiFetch<T = any>(
  path: string,
  options?: RequestInit & { body?: any }
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const url = baseUrl.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path);
  const { body, headers, ...rest } = options || {};
  let fetchOptions: RequestInit = { ...rest };
  // Attach JWT for all endpoints except login and register
  if (!/\/authentication\/(login|register)$/.test(path)) {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
      fetchOptions.headers = {
        ...(headers || {}),
        Authorization: `Bearer ${token}`,
      };
    } else {
      fetchOptions.headers = { ...(headers || {}) };
    }
  } else {
    fetchOptions.headers = { ...(headers || {}) };
  }
  if (body !== undefined) {
    if (typeof window !== "undefined" && body instanceof FormData) {
      fetchOptions.body = body;
      // Let browser set Content-Type for FormData
      if (fetchOptions.headers && (fetchOptions.headers as any)["Content-Type"]) {
        delete (fetchOptions.headers as any)["Content-Type"];
      }
    } else {
      (fetchOptions.headers as Record<string, string>)["Content-Type"] = "application/json";
      fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
    }
  }
  const res = await fetch(url, fetchOptions);
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    throw new Error(data?.error || data?.message || "API Error");
  }
  return data;
}
