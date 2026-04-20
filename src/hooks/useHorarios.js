import { useState, useEffect } from 'react';
import { subscribeHorarios, addHorarioDoc, removeHorarioDoc } from '../services';

export const useHorarios = (empresaId) => {
  const [horarios, setHorarios] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!empresaId) {
      setHorarios([]);
      setLoaded(false);
      return;
    }
    setLoaded(false);
    const unsub = subscribeHorarios(empresaId, (items) => {
      setHorarios(items);
      setLoaded(true);
    });
    return () => unsub();
  }, [empresaId]);

  const addHorario = async (name) => {
    if (!empresaId) return;
    return await addHorarioDoc(empresaId, name);
  };

  const removeHorario = async (horarioId) => {
    if (!empresaId) return;
    await removeHorarioDoc(empresaId, horarioId);
  };

  return { horarios, loaded, addHorario, removeHorario };
};
