import { useState, useEffect } from 'react';
import { MAX_ASIGNACIONES_POR_PERSONA } from '../constants';
import { shuffle } from '../utils';
import {
  subscribeAsignaciones,
  saveAsignaciones,
  clearAsignaciones,
} from '../services';

export const useAsignaciones = (puestos, personas) => {
  const [asignaciones, setAsignaciones] = useState({});
  const [selectedPuesto, setSelectedPuesto] = useState(null);

  // Subscribe to real-time asignaciones from Firestore
  useEffect(() => {
    const unsub = subscribeAsignaciones((data) => {
      setAsignaciones(data);
    });
    return () => unsub();
  }, []);

  const getPersonaCount = (persona) => {
    let count = 0;
    for (const key in asignaciones) {
      if ((asignaciones[key] || []).includes(persona)) count++;
    }
    return count;
  };

  const asignarAleatorio = async () => {
    if (puestos.length === 0 || personas.length === 0) return;
    const shuffled = shuffle(personas);
    const result = {};
    const personaCounts = {};
    personas.forEach((p) => { personaCounts[p] = 0; });
    puestos.forEach((puesto) => { result[puesto] = []; });

    for (const puesto of puestos) {
      for (const persona of shuffled) {
        if (
          personaCounts[persona] < MAX_ASIGNACIONES_POR_PERSONA &&
          !result[puesto].includes(persona)
        ) {
          result[puesto].push(persona);
          personaCounts[persona]++;
          break;
        }
      }
    }

    for (const puesto of puestos) {
      if (result[puesto].length === 0) {
        for (const persona of shuffle(personas)) {
          if (personaCounts[persona] < MAX_ASIGNACIONES_POR_PERSONA) {
            result[puesto].push(persona);
            personaCounts[persona]++;
            break;
          }
        }
      }
    }

    await saveAsignaciones(result);
    setSelectedPuesto(puestos[0]);
  };

  const toggleAsignacion = async (persona) => {
    if (!selectedPuesto) return;

    const current = asignaciones[selectedPuesto] || [];
    let updated;

    if (current.includes(persona)) {
      updated = { ...asignaciones, [selectedPuesto]: current.filter((p) => p !== persona) };
    } else {
      let count = 0;
      for (const key in asignaciones) {
        if ((asignaciones[key] || []).includes(persona)) count++;
      }
      if (count >= MAX_ASIGNACIONES_POR_PERSONA) return;
      updated = { ...asignaciones, [selectedPuesto]: [...current, persona] };
    }

    await saveAsignaciones(updated);
  };

  const resetAsignaciones = async () => {
    await clearAsignaciones();
    setSelectedPuesto(null);
  };

  const removeAsignacionesPuesto = async (puesto) => {
    const { [puesto]: _, ...rest } = asignaciones;
    await saveAsignaciones(rest);
    if (selectedPuesto === puesto) setSelectedPuesto(null);
  };

  const removePersonaDeAsignaciones = async (persona) => {
    const updated = {};
    let changed = false;
    for (const key in asignaciones) {
      const filtered = asignaciones[key].filter((p) => p !== persona);
      updated[key] = filtered;
      if (filtered.length !== asignaciones[key].length) changed = true;
    }
    if (changed) await saveAsignaciones(updated);
  };

  return {
    asignaciones,
    selectedPuesto,
    setSelectedPuesto,
    getPersonaCount,
    asignarAleatorio,
    toggleAsignacion,
    resetAsignaciones,
    removeAsignacionesPuesto,
    removePersonaDeAsignaciones,
  };
};
