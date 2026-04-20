import { useState, useEffect } from 'react';
import {
  subscribePuestos,
  addPuestoDoc,
  removePuestoDoc,
  subscribePersonas,
  addPersonaDoc,
  removePersonaDoc,
} from '../services';

export const useStorage = () => {
  const [puestos, setPuestos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubPuestos = subscribePuestos((items) => {
      setPuestos(items);
      setLoaded(true);
    });

    const unsubPersonas = subscribePersonas((items) => {
      setPersonas(items);
    });

    return () => {
      unsubPuestos();
      unsubPersonas();
    };
  }, []);

  const addPuesto = async (name) => {
    await addPuestoDoc(name);
  };

  const removePuesto = async (name) => {
    await removePuestoDoc(name);
  };

  const addPersona = async (name) => {
    await addPersonaDoc(name);
  };

  const removePersona = async (name) => {
    await removePersonaDoc(name);
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
