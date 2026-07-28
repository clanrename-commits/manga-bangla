/**
 * IndexedDB-based storage adapter for Zustand persist middleware.
 *
 * localStorage has a ~5MB limit which is easily exceeded when admins upload
 * cover/banner images and chapter pages as data URLs. IndexedDB can store
 * hundreds of MB, so we use it for the manga store.
 */

const DB_NAME = "manga-bangla-db";
const DB_VERSION = 1;
const STORE_NAME = "kv";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const indexedDBStorage = {
  async getItem(name: string): Promise<string | null> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const req = tx.objectStore(STORE_NAME).get(name);
        req.onsuccess = () => resolve(req.result ?? null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Fallback to localStorage if IndexedDB unavailable
      try {
        return localStorage.getItem(name);
      } catch {
        return null;
      }
    }
  },
  async setItem(name: string, value: string): Promise<void> {
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(value, name);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      // Fallback: try localStorage, but it may throw QuotaExceededError
      try {
        localStorage.setItem(name, value);
      } catch {
        console.warn("Failed to persist state — storage quota exceeded", e);
      }
    }
  },
  async removeItem(name: string): Promise<void> {
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(name);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      try {
        localStorage.removeItem(name);
      } catch {
        /* ignore */
      }
    }
  },
};
