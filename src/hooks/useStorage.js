import { useState, useEffect } from 'react';
import {
  subscribePuestos,
  addPuestoDoc,
  removePuestoDoc,
  subscribePersonas,
  addPersonaDoc,
  removePersonaDoc,
} from '../services';

export const useStorage = (empresaId, horarioId) => {
  const [puestos, setPuestos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!empresaId || !horarioId) {
      setPuestos([]);
      setPersonas([]);
      setLoaded(false);
      return;
    }

    setLoaded(false);

    const unsubPuestos = subscribePuestos(empresaId, horarioId, (items) => {
      setPuestos(items);
      setLoaded(true);
    });

    const unsubPersonas = subscribePersonas(empresaId, horarioId, (items) => {
      setPersonas(items);
    });

    return () => {
      unsubPuestos();
      unsubPersonas();
    };
  }, [empresaId, horarioId]);

  const addPuesto = async (name) => {
    await addPuestoDoc(empresaId, horarioId, name);
  };

  const removePuesto = async (name) => {
    await removePuestoDoc(empresaId, horarioId, name);
  };

  const addPersona = async (name) => {
    await addPersonaDoc(empresaId, horarioId, name);
  };

  const removePersona = async (name) => {
    await removePersonaDoc(empresaId, horarioId, name);
  };

  return {
    puestos,
    personas,
    loaded,
    addPuesto,
    removePuesto,
    addPersona,
    removePersona,
  };
};
