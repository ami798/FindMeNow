import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  DocumentData,
  where,
  updateDoc,
} from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage, auth } from './firebase';

// Types
export interface PersonData {
  name: string;
  age: number;
  lastSeenLocation: string;
  dateMissing: string; // ISO date string
  description: string;
  reporterContact: string;
}

export type ReportStatus = 'pending' | 'approved' | 'rejected';

export interface PoliceStationInfo {
  name: string;
  phone: string;
  address: string;
}

export interface MissingPersonRecord extends PersonData {
  photoURL: string;
  reportedAt: Timestamp;
  reporterId: string;
  status: ReportStatus;
  policeNotified: boolean;
  policeStation: PoliceStationInfo;
  caseReferenceId: string;
}

export interface MissingPersonDoc extends PersonData {
  id: string;
  photoURL: string;
  reportedAt: Date | null;
  reporterId: string;
  status: ReportStatus;
  policeNotified: boolean;
  policeStation: PoliceStationInfo;
  caseReferenceId: string;
}

const COLLECTION_NAME = 'missingPersons';

// Auth
export async function signInWithGoogle(): Promise<void> {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('signInWithGoogle failed:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('signOutUser failed:', error);
    throw error;
  }
}

// Create report
export async function addMissingPerson(
  personData: PersonData,
  photoFile: File,
  reporterId: string
): Promise<void> {
  try {
    // Upload photo with unique name
    const fileExt = photoFile.name.split('.').pop() || 'jpg';
    const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
    const photoRef = ref(storage, `missing_photos/${uniqueName}`);

    const snapshot = await uploadBytes(photoRef, photoFile);
    const photoURL = await getDownloadURL(snapshot.ref);

    const docData: MissingPersonRecord = {
      ...personData,
      photoURL,
      reporterId,
      status: 'pending',
      policeNotified: false,
      policeStation: { name: '', phone: '', address: '' },
      caseReferenceId: '',
      reportedAt: serverTimestamp() as unknown as Timestamp,
    };

    await addDoc(collection(db, COLLECTION_NAME), docData as unknown as DocumentData);
  } catch (error) {
    console.error('addMissingPerson failed:', error);
    throw error;
  }
}

// Queries
export async function getApprovedMissingPersons(): Promise<MissingPersonDoc[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'approved'),
      orderBy('reportedAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(mapDoc);
  } catch (error) {
    console.error('getApprovedMissingPersons failed:', error);
    throw error;
  }
}

export async function getPendingReports(): Promise<MissingPersonDoc[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'pending'),
      orderBy('reportedAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(mapDoc);
  } catch (error) {
    console.error('getPendingReports failed:', error);
    throw error;
  }
}

export async function getMyReports(userId: string): Promise<MissingPersonDoc[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('reporterId', '==', userId),
      orderBy('reportedAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(mapDoc);
  } catch (error) {
    console.error('getMyReports failed:', error);
    throw error;
  }
}

export async function updateReportStatus(
  reportId: string,
  status: Extract<ReportStatus, 'approved' | 'rejected'>
): Promise<void> {
  try {
    const refDoc = doc(db, COLLECTION_NAME, reportId);
    await updateDoc(refDoc, { status });
  } catch (error) {
    console.error('updateReportStatus failed:', error);
    throw error;
  }
}

export async function notifyPolice(
  reportId: string,
  policeStation: PoliceStationInfo
): Promise<void> {
  try {
    const refDoc = doc(db, COLLECTION_NAME, reportId);
    await updateDoc(refDoc, { policeNotified: true, policeStation });
  } catch (error) {
    console.error('notifyPolice failed:', error);
    throw error;
  }
}

// Helper to map Firestore doc -> strongly typed shape
function mapDoc(d: any): MissingPersonDoc {
  const data = d.data() as MissingPersonRecord | DocumentData;
  const reportedAtTs = (data as any).reportedAt;
  return {
    id: d.id,
    name: (data as any).name,
    age: (data as any).age,
    lastSeenLocation: (data as any).lastSeenLocation,
    dateMissing: (data as any).dateMissing,
    description: (data as any).description,
    reporterContact: (data as any).reporterContact,
    photoURL: (data as any).photoURL,
    reporterId: (data as any).reporterId,
    status: (data as any).status as ReportStatus,
    policeNotified: Boolean((data as any).policeNotified),
    policeStation: (data as any).policeStation || { name: '', phone: '', address: '' },
    caseReferenceId: (data as any).caseReferenceId || '',
    reportedAt: reportedAtTs && typeof reportedAtTs.toDate === 'function' ? reportedAtTs.toDate() : null,
  };
} 