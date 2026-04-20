import { useState } from 'react';
import { MAX_ASIGNACIONES_POR_PERSONA } from '../constants';
import { shuffle } from '../utils';

export const useAsignaciones = (puestos, personas) => {
  const [asignaciones, setAsignaciones] = useState({});
  const [selectedPuesto, setSelectedPuesto] = useState(null);

  const getPersonaCount = (persona) => {
    let count = 0;
    for (const key in asignaciones) {
      if ((asignaciones[key] || []).includes(persona)) count++;
    }
    return count;
  };

  const asignarAleatorio = () => {
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

    setAsignaciones(result);
    setSelectedPuesto(puestos[0]);
  };

  const toggleAsignacion = (persona) => {
    if (!selectedPuesto) return;
    setAsignaciones((prev) => {
      const current = prev[selectedPuesto] || [];
      if (current.includes(persona)) {
        return { ...prev, [selectedPuesto]: current.filter((p) => p !== persona) };
      }
      let count = 0;
      for (const key in prev) {
        if ((prev[key] || []).includes(persona)) count++;
      }
      if (count >= MAX_ASIGNACIONES_POR_PERSONA) return prev;
      return { ...prev, [selectedPuesto]: [...current, persona] };
    });
  };

  const resetAsignaciones = () => {
    setAsignaciones({});
    setSelectedPuesto(null);
  };

  const removeAsignacionesPuesto = (puesto) => {
    const { [puesto]: _, ...rest } = asignaciones;
    setAsignaciones(rest);
    if (selectedPuesto === puesto) setSelectedPuesto(null);
  };

  const removePersonaDeAsignaciones = (persona) => {
    const updated = {};
    for (const key in asignaciones) {
      updated[key] = asignaciones[key].filter((p) => p !== persona);
    }
    setAsignaciones(updated);
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
