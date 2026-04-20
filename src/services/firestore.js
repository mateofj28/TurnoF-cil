import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

// Collections
const PUESTOS_COL = 'puestos';
const PERSONAS_COL = 'personas';
const ASIGNACIONES_COL = 'asignaciones';

// --- Puestos ---

export const subscribePuestos = (callback) => {
  return onSnapshot(collection(db, PUESTOS_COL), (snapshot) => {
    const items = snapshot.docs.map((doc) => doc.data().name);
    callback(items);
  });
};

export const addPuestoDoc = async (name) => {
  await setDoc(doc(db, PUESTOS_COL, name), { name });
};

export const removePuestoDoc = async (name) => {
  await deleteDoc(doc(db, PUESTOS_COL, name));
  // Also remove its assignments
  await deleteDoc(doc(db, ASIGNACIONES_COL, name));
};

// --- Personas ---

export const subscribePersonas = (callback) => {
  return onSnapshot(collection(db, PERSONAS_COL), (snapshot) => {
    const items = snapshot.docs.map((doc) => doc.data().name);
    callback(items);
  });
};

export const addPersonaDoc = async (name) => {
  await setDoc(doc(db, PERSONAS_COL, name), { name });
};

export const removePersonaDoc = async (name) => {
  await deleteDoc(doc(db, PERSONAS_COL, name));
};

// --- Asignaciones ---

export const subscribeAsignaciones = (callback) => {
  return onSnapshot(collection(db, ASIGNACIONES_COL), (snapshot) => {
    const result = {};
    snapshot.docs.forEach((doc) => {
      result[doc.id] = doc.data().personas || [];
    });
    callback(result);
  });
};

export const saveAsignaciones = async (asignaciones) => {
  const batch = writeBatch(db);
  for (const [puesto, personas] of Object.entries(asignaciones)) {
    batch.set(doc(db, ASIGNACIONES_COL, puesto), { personas });
  }
  await batch.commit();
};

export const clearAsignaciones = async () => {
  const batch = writeBatch(db);
  // We'll clear by setting empty — the subscribe will handle it
  // Actually we need to get current docs first
  return new Promise((resolve) => {
    const unsub = onSnapshot(collection(db, ASIGNACIONES_COL), async (snapshot) => {
      unsub();
      const b = writeBatch(db);
      snapshot.docs.forEach((d) => b.delete(d.ref));
      await b.commit();
      resolve();
    });
  });
};
