import { API_URL } from "@/shared/config/api.config";
import { notFound } from "next/navigation";

// --- Centralized Cache Configuration ---
// --- Centralized Cache Configuration ---
// Timings in seconds
export const CACHE_TIMINGS = {
  SHORT: 60, // 1 minute (Hot news, Home)
  MEDIUM: 300, // 5 minutes (Lists)
  LONG: 3600, // 1 hour (Menu, Footer)
};

type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

export const CACHE_STRATEGIES = {
  NO_CACHE: { cache: "no-store" } as RequestInit,
  SHORT: { next: { revalidate: CACHE_TIMINGS.SHORT } } as RequestInit,
  MEDIUM: { next: { revalidate: CACHE_TIMINGS.MEDIUM } } as RequestInit,
  LONG: { next: { revalidate: CACHE_TIMINGS.LONG } } as RequestInit,
};

export class FetchClient {
  private static instance: FetchClient;

  // Singleton pattern to ensure consistent config
  private constructor() {}

  public static getInstance(): FetchClient {
    if (!FetchClient.instance) {
      FetchClient.instance = new FetchClient();
    }
    return FetchClient.instance;
  }

  // Generic Get Method
  async get<T>(
    endpoint: string,
    config: {
      params?: Record<string, string | number | boolean>;
      cacheStrategy?: keyof typeof CACHE_STRATEGIES;
      headers?: Record<string, string>;
      next?: NextFetchRequestConfig; // Support Next.js extended fetch options (tags, revalidate)
    } = {},
  ): Promise<T | null> {
    try {
      const { params, cacheStrategy = "NO_CACHE", headers, next } = config;

      // 1. Build URL
      let url = `${API_URL}${endpoint}`;
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        url += `?${searchParams.toString()}`;
      }

      // 2. Build Options
      const strategy = CACHE_STRATEGIES[cacheStrategy];

      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        ...strategy,
        // Merge "next" config. If strategy has next, we spread it first, then override with passed "next"
        next: {
          ...(strategy.next as NextFetchRequestConfig),
          ...next,
        },
      };

      // 3. Execute
      const response = await fetch(url, options);

      // 4. Handle Errors
      if (!response.ok) {
        if (response.status === 404) return null;
        if (response.status === 403) {
          console.warn(`[FetchClient] 403 Forbidden: ${url}`);
          return null;
        }
        throw new Error(
          `[FetchClient] Error ${response.status}: ${response.statusText}`,
        );
      }

      // 5. Parse JSON
      const json = await response.json();
      return json.data !== undefined ? json.data : json;
    } catch (error: any) {
      // 6. Build-time Fallback for Static Generation
      // If Backend is down during build (ECONNREFUSED), return null/empty to allow build to finish.
      if (
        (error.message?.includes("ECONNREFUSED") ||
          error.cause?.code === "ECONNREFUSED") &&
        process.env.NEXT_PHASE === "phase-production-build"
      ) {
        console.warn(
          `[FetchClient] Backend unavailable during build. Returning null for: ${endpoint}`,
        );
        return null;
      }

      console.error(`[FetchClient] Request Failed: ${endpoint}`, error);
      return null;
    }
  }
}

export const fetchClient = FetchClient.getInstance();
