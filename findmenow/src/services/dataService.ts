import type { MissingPerson, MissingPersonFormData, Comment } from '../types';

const LOCAL_STORAGE_KEY = 'fm_missing_persons';
const COMMENTS_STORAGE_KEY = 'fm_comments';

const isFirebaseEnabled = (): boolean => {
  return import.meta.env.VITE_USE_FIREBASE === 'true';
};

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const readLocal = (): MissingPerson[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as (Omit<MissingPerson, 'createdAt'> & { createdAt: string })[];
    return arr.map((p) => ({ ...p, createdAt: new Date(p.createdAt) }));
  } catch {
    return [];
  }
};

const writeLocal = (items: MissingPerson[]) => {
  const serializable = items.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() }));
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializable));
};

export const getMissingPersons = async (): Promise<MissingPerson[]> => {
  if (isFirebaseEnabled()) {
    const svc = await import('./firebaseService');
    return svc.getMissingPersons();
  }
  return readLocal();
};

export const addMissingPerson = async (formData: MissingPersonFormData): Promise<string> => {
  if (isFirebaseEnabled()) {
    const svc = await import('./firebaseService');
    return svc.addMissingPerson(formData);
  }

  const id = (globalThis.crypto && 'randomUUID' in globalThis.crypto)
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

  const photoURL = formData.photo ? await fileToDataUrl(formData.photo) : '';

  const newEntry: MissingPerson = {
    id,
    fullName: formData.fullName,
    lastSeenLocation: formData.lastSeenLocation,
    description: formData.description,
    photoURL,
    createdAt: new Date(),
    status: 'missing',
    missingDate: formData.missingDate || new Date().toISOString().slice(0, 10),
    contactPhone: formData.contactPhone,
    features: formData.features,
  };

  const existing = readLocal();
  existing.unshift(newEntry);
  writeLocal(existing);

  return id;
};

// Comments (local only in mock)
const readComments = (): Comment[] => {
  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as (Omit<Comment, 'createdAt'> & { createdAt: string })[];
    return arr.map((c) => ({ ...c, createdAt: new Date(c.createdAt) }));
  } catch {
    return [];
  }
};

const writeComments = (items: Comment[]) => {
  const serializable = items.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }));
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(serializable));
};

export const getCommentsForPerson = async (personId: string): Promise<Comment[]> => {
  if (isFirebaseEnabled()) {
    // Placeholder for future Firebase comments
    return [];
  }
  return readComments().filter((c) => c.personId === personId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const addCommentForPerson = async (personId: string, authorName: string, message: string): Promise<string> => {
  if (isFirebaseEnabled()) {
    // Placeholder for future Firebase comments
    return '';
  }
  const id = (globalThis.crypto && 'randomUUID' in globalThis.crypto)
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  const all = readComments();
  all.push({ id, personId, authorName, message, createdAt: new Date() });
  writeComments(all);
  return id;
}; 