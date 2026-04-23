import { useState, useEffect } from 'react';
import { DIAS, MAX_ASIGNACIONES_POR_PERSONA } from '../constants';
import { shuffle } from '../utils';
import {
  subscribeAsignaciones,
  saveDiaAsignaciones,
  clearAsignaciones,
} from '../services';

export const useAsignaciones = (empresaId, horarioId, puestos, personas) => {
  // asignaciones = { lunes: { Caja: ["Juan"], Bodega: ["María"] }, martes: {...}, ... }
  const [asignaciones, setAsignaciones] = useState({});
  const [selectedDia, setSelectedDia] = useState(DIAS[0].key);
  const [selectedPuesto, setSelectedPuesto] = useState(null);

  useEffect(() => {
    if (!empresaId || !horarioId) {
      setAsignaciones({});
      setSelectedPuesto(null);
      return;
    }

    const unsub = subscribeAsignaciones(empresaId, horarioId, (data) => {
      setAsignaciones(data);
    });
    return () => unsub();
  }, [empresaId, horarioId]);

  // Get assignments for the current day
  const getDiaAsignaciones = () => asignaciones[selectedDia] || {};

  // Count how many puestos a persona is assigned to on the current day
  const getPersonaCount = (persona) => {
    const diaData = getDiaAsignaciones();
    let count = 0;
    for (const key in diaData) {
      if ((diaData[key] || []).includes(persona)) count++;
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

    await saveDiaAsignaciones(empresaId, horarioId, selectedDia, result);
    setSelectedPuesto(puestos[0]);
  };

  // Random assign all days at once
  const asignarAleatorioSemana = async () => {
    if (puestos.length === 0 || personas.length === 0) return;

    for (const dia of DIAS) {
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

      await saveDiaAsignaciones(empresaId, horarioId, dia.key, result);
    }

    setSelectedPuesto(puestos[0]);
  };

  const toggleAsignacion = async (persona) => {
    if (!selectedPuesto) return;

    const diaData = getDiaAsignaciones();
    const current = diaData[selectedPuesto] || [];
    let updated;

    if (current.includes(persona)) {
      updated = { ...diaData, [selectedPuesto]: current.filter((p) => p !== persona) };
    } else {
      let count = 0;
      for (const key in diaData) {
        if ((diaData[key] || []).includes(persona)) count++;
      }
      if (count >= MAX_ASIGNACIONES_POR_PERSONA) return;
      updated = { ...diaData, [selectedPuesto]: [...current, persona] };
    }

    await saveDiaAsignaciones(empresaId, horarioId, selectedDia, updated);
  };

  const resetAsignaciones = async () => {
    await clearAsignaciones(empresaId, horarioId);
    setSelectedPuesto(null);
    setSelectedDia(DIAS[0].key);
  };

  const removeAsignacionesPuesto = async (puesto) => {
    // Remove puesto from all days
    for (const dia of DIAS) {
      const diaData = asignaciones[dia.key];
      if (diaData && diaData[puesto]) {
        const { [puesto]: _, ...rest } = diaData;
        await saveDiaAsignaciones(empresaId, horarioId, dia.key, rest);
      }
    }
    if (selectedPuesto === puesto) setSelectedPuesto(null);
  };

  const removePersonaDeAsignaciones = async (persona) => {
    for (const dia of DIAS) {
      const diaData = asignaciones[dia.key];
      if (!diaData) continue;
      let changed = false;
      const updated = {};
      for (const key in diaData) {
        const filtered = diaData[key].filter((p) => p !== persona);
        updated[key] = filtered;
        if (filtered.length !== diaData[key].length) changed = true;
      }
      if (changed) {
        await saveDiaAsignaciones(empresaId, horarioId, dia.key, updated);
      }
    }
  };

  // Check if any day has assignments
  const hasAnyAsignacion = () => {
    for (const dia of DIAS) {
      const diaData = asignaciones[dia.key];
      if (diaData) {
        for (const key in diaData) {
          if (diaData[key] && diaData[key].length > 0) return true;
        }
      }
    }
    return false;
  };

  // Count assignments for a specific day
  const getDiaCount = (diaKey) => {
    const diaData = asignaciones[diaKey] || {};
    let count = 0;
    for (const key in diaData) {
      count += (diaData[key] || []).length;
    }
    return count;
  };

  return {
    asignaciones,
    selectedDia,
    setSelectedDia,
    selectedPuesto,
    setSelectedPuesto,
    getDiaAsignaciones,
    getPersonaCount,
    getDiaCount,
    asignarAleatorio,
    asignarAleatorioSemana,
    toggleAsignacion,
    resetAsignaciones,
    removeAsignacionesPuesto,
    removePersonaDeAsignaciones,
    hasAnyAsignacion,
  };
};
