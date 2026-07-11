import { client } from '@/api/client.gen';

const STORAGE_KEY = 'access_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// the browser must NEVER call the backend directly.
// baseUrl is intentionally an empty string so every SDK request resolves to a
// RELATIVE, same-origin URL (e.g. `/api/v1/auth/login`). Next.js rewrites
// (next.config.ts) / vercel.json then proxy `/api/v1/*` to the real backend
// server-side. Only the Next.js server ever knows the backend's real address.
//
// ⚠️ Do NOT change this to an absolute URL or `process.env.NEXT_PUBLIC_*` —
// that would expose the backend origin to the browser and bypass the proxy.
client.setConfig({
  baseUrl: '',
});

client.interceptors.request.use((request) => {
  const token = getStoredToken();
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return request;
});

client.interceptors.response.use((response) => {
  if (response.status === 401) {
    clearStoredToken();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
  }
  return response;
});
