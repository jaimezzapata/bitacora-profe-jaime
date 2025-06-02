// Servicio para interactuar con Firestore
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import app from './firebaseConfig';

const db = getFirestore(app);

// Obtener documento por colección y ID
export const getDocument = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Crear o actualizar documento
export const setDocument = async (collectionName, id, data) => {
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, data, { merge: true });
};

// Agregar documento a una colección (ID autogenerado)
export const addDocument = async (collectionName, data) => {
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, data);
  return docRef.id;
};

// Actualizar documento existente
export const updateDocument = async (collectionName, id, data) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
};

// Eliminar documento
export const deleteDocument = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

// Obtener todos los documentos de una colección (con filtro opcional)
export const getCollection = async (collectionName, filters = []) => {
  let colRef = collection(db, collectionName);
  let q = colRef;
  if (filters.length > 0) {
    q = query(colRef, ...filters.map(f => where(f.field, f.op, f.value)));
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
