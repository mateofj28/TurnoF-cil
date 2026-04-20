import {
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== EMPRESAS ====================

export const subscribeEmpresas = (callback) => {
  const q = query(collection(db, 'empresas'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
};

export const addEmpresaDoc = async (name) => {
  const ref = await addDoc(collection(db, 'empresas'), {
    name,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const removeEmpresaDoc = async (empresaId) => {
  // Delete empresa doc (subcollections persist in Firestore but won't be queried)
  await deleteDoc(doc(db, 'empresas', empresaId));
};

// ==================== HORARIOS ====================

const horariosCol = (empresaId) =>
  collection(db, 'empresas', empresaId, 'horarios');

export const subscribeHorarios = (empresaId, callback) => {
  const q = query(horariosCol(empresaId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
};

export const addHorarioDoc = async (empresaId, name) => {
  const ref = await addDoc(horariosCol(empresaId), {
    name,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const removeHorarioDoc = async (empresaId, horarioId) => {
  await deleteDoc(doc(db, 'empresas', empresaId, 'horarios', horarioId));
};

// ==================== PUESTOS (dentro de horario) ====================

const puestosCol = (empresaId, horarioId) =>
  collection(db, 'empresas', empresaId, 'horarios', horarioId, 'puestos');

export const subscribePuestos = (empresaId, horarioId, callback) => {
  return onSnapshot(puestosCol(empresaId, horarioId), (snapshot) => {
    const items = snapshot.docs.map((d) => d.data().name);
    callback(items);
  });
};

export const addPuestoDoc = async (empresaId, horarioId, name) => {
  await setDoc(
    doc(db, 'empresas', empresaId, 'horarios', horarioId, 'puestos', name),
    { name }
  );
};

export const removePuestoDoc = async (empresaId, horarioId, name) => {
  await deleteDoc(
    doc(db, 'empresas', empresaId, 'horarios', horarioId, 'puestos', name)
  );
  // Also remove its assignments
  await deleteDoc(
    doc(db, 'empresas', empresaId, 'horarios', horarioId, 'asignaciones', name)
  );
};

// ==================== PERSONAS (dentro de horario) ====================

const personasCol = (empresaId, horarioId) =>
  collection(db, 'empresas', empresaId, 'horarios', horarioId, 'personas');

export const subscribePersonas = (empresaId, horarioId, callback) => {
  return onSnapshot(personasCol(empresaId, horarioId), (snapshot) => {
    const items = snapshot.docs.map((d) => d.data().name);
    callback(items);
  });
};

export const addPersonaDoc = async (empresaId, horarioId, name) => {
  await setDoc(
    doc(db, 'empresas', empresaId, 'horarios', horarioId, 'personas', name),
    { name }
  );
};

export const removePersonaDoc = async (empresaId, horarioId, name) => {
  await deleteDoc(
    doc(db, 'empresas', empresaId, 'horarios', horarioId, 'personas', name)
  );
};

// ==================== ASIGNACIONES (dentro de horario) ====================

const asignacionesCol = (empresaId, horarioId) =>
  collection(db, 'empresas', empresaId, 'horarios', horarioId, 'asignaciones');

export const subscribeAsignaciones = (empresaId, horarioId, callback) => {
  return onSnapshot(asignacionesCol(empresaId, horarioId), (snapshot) => {
    const result = {};
    snapshot.docs.forEach((d) => {
      result[d.id] = d.data().personas || [];
    });
    callback(result);
  });
};

export const saveAsignaciones = async (empresaId, horarioId, asignaciones) => {
  const batch = writeBatch(db);
  for (const [puesto, personas] of Object.entries(asignaciones)) {
    batch.set(
      doc(db, 'empresas', empresaId, 'horarios', horarioId, 'asignaciones', puesto),
      { personas }
    );
  }
  await batch.commit();
};

export const clearAsignaciones = async (empresaId, horarioId) => {
  return new Promise((resolve) => {
    const unsub = onSnapshot(
      asignacionesCol(empresaId, horarioId),
      async (snapshot) => {
        unsub();
        const batch = writeBatch(db);
        snapshot.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
        resolve();
      }
    );
  });
};
