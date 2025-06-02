// Servicio de autenticación con Firebase
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import app from './firebaseConfig';

const auth = getAuth(app);

export const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
export const subscribeToAuth = (callback) => onAuthStateChanged(auth, callback);
