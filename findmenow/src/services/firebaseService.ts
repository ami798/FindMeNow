import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import type { MissingPerson, MissingPersonFormData } from '../types';

export const uploadPhoto = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `missing-persons/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const addMissingPerson = async (formData: MissingPersonFormData): Promise<string> => {
  try {
    let photoURL = '';
    
    if (formData.photo) {
      photoURL = await uploadPhoto(formData.photo);
    }

    const docRef = await addDoc(collection(db, 'missing-persons'), {
      fullName: formData.fullName,
      lastSeenLocation: formData.lastSeenLocation,
      description: formData.description,
      photoURL,
      createdAt: serverTimestamp(),
      status: 'missing'
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding missing person:', error);
    throw error;
  }
};

export const getMissingPersons = async (): Promise<MissingPerson[]> => {
  try {
    const q = query(
      collection(db, 'missing-persons'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const missingPersons: MissingPerson[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      missingPersons.push({
        id: doc.id,
        fullName: data.fullName,
        lastSeenLocation: data.lastSeenLocation,
        description: data.description,
        photoURL: data.photoURL,
        createdAt: data.createdAt?.toDate() || new Date(),
        status: data.status
      });
    });
    
    return missingPersons;
  } catch (error) {
    console.error('Error getting missing persons:', error);
    throw error;
  }
}; 