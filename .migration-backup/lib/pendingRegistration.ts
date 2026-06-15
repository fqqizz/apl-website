export type PendingPlayerRegistration = {
  orderId: string;
  createdAt: number;
  fullName: string;
  age: number;
  position: string;
  preferredFoot: string;
  contactNumber: string;
  email: string;
  instagram?: string | null;
  area: string;
  photoFile: Blob;
  idFile: Blob;
  photoName: string;
  idName: string;
  photoType: string;
  idType: string;
};

const DB_NAME = "apl-pending-registration";
const DB_VERSION = 1;
const STORE_NAME = "registrations";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not available"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function waitForTransaction(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error("Transaction aborted"));
  });
}

export async function savePendingPlayerRegistration(data: PendingPlayerRegistration): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put(data, data.orderId);
  await waitForTransaction(tx);
  db.close();
}

export async function getPendingPlayerRegistration(orderId: string): Promise<PendingPlayerRegistration | null> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readonly");
  const request = tx.objectStore(STORE_NAME).get(orderId);
  const result = await new Promise<PendingPlayerRegistration | null>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
  await waitForTransaction(tx);
  db.close();
  return result;
}

export async function deletePendingPlayerRegistration(orderId: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).delete(orderId);
  await waitForTransaction(tx);
  db.close();
}
