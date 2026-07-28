"use client";

/**
 * Client-side API helpers for talking to the Turso-backed API routes.
 * All manga/categories/genres/settings go through these so the whole app
 * shares one source of truth (the database).
 */

const ADMIN_SECRET_KEY = "manga-bangla-admin-secret";
const USER_ID_KEY = "manga-bangla-user-id";

export function getAdminSecret(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_SECRET_KEY);
}

export function setAdminSecret(secret: string | null) {
  if (typeof window === "undefined") return;
  if (secret) localStorage.setItem(ADMIN_SECRET_KEY, secret);
  else localStorage.removeItem(ADMIN_SECRET_KEY);
}

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
}

export function setUserId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) localStorage.setItem(USER_ID_KEY, id);
  else localStorage.removeItem(USER_ID_KEY);
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  // Attach user id for guest favorites
  const userId = getUserId();
  if (userId) headers.set("x-user-id", userId);

  // Attach admin secret if available
  const adminSecret = getAdminSecret();
  if (adminSecret) headers.set("x-admin-secret", adminSecret);

  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json();
}

// ===== Manga =====
export async function fetchManga() {
  return apiFetch("/api/manga");
}

export async function fetchMangaById(id: string) {
  return apiFetch(`/api/manga/${id}`);
}

export async function createManga(data: any) {
  return apiFetch("/api/manga", { method: "POST", body: JSON.stringify(data) });
}

export async function updateManga(id: string, data: any) {
  return apiFetch(`/api/manga/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteManga(id: string) {
  return apiFetch(`/api/manga/${id}`, { method: "DELETE" });
}

// ===== Categories =====
export async function fetchCategories() {
  return apiFetch("/api/categories");
}

export async function createCategory(name: string) {
  return apiFetch("/api/categories", { method: "POST", body: JSON.stringify({ name }) });
}

export async function deleteCategory(name: string) {
  return apiFetch("/api/categories", { method: "DELETE", body: JSON.stringify({ name }) });
}

// ===== Genres =====
export async function fetchGenres() {
  return apiFetch("/api/genres");
}

export async function createGenre(name: string) {
  return apiFetch("/api/genres", { method: "POST", body: JSON.stringify({ name }) });
}

export async function deleteGenre(name: string) {
  return apiFetch("/api/genres", { method: "DELETE", body: JSON.stringify({ name }) });
}

// ===== Settings =====
export async function fetchSettings() {
  return apiFetch("/api/settings");
}

export async function updateSettings(settings: Record<string, string>) {
  return apiFetch("/api/settings", { method: "PUT", body: JSON.stringify(settings) });
}

// ===== Favorites =====
export async function fetchFavorites() {
  return apiFetch("/api/favorites");
}

export async function toggleFavorite(mangaId: string) {
  return apiFetch("/api/favorites", { method: "POST", body: JSON.stringify({ mangaId }) });
}

// ===== Auth =====
export async function loginUser(email: string, password: string) {
  return apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function registerUser(name: string, email: string, password: string) {
  return apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
}

export async function adminLogin(email: string, password: string) {
  const data = await apiFetch("/api/auth/admin-login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  // Store admin secret for future admin API calls
  if (data.adminSecret) setAdminSecret(data.adminSecret);
  return data;
}

export async function getCurrentUser() {
  return apiFetch("/api/auth/login");
}

export async function initGuest() {
  const data = await apiFetch("/api/init-guest", { method: "POST" });
  if (data.userId) setUserId(data.userId);
  return data;
}
