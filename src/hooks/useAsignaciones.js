import { useState, useEffect, useMemo } from 'react';
import { DIAS, MAX_ASIGNACIONES_POR_PERSONA } from '../constants';
import { shuffle } from '../utils';
import {
  subscribeAsignaciones,
  saveDiaAsignaciones,
  clearAsignaciones,
} from '../services';

// Target rest days per week (ideal balance)
const DESCANSO_IDEAL = 2;

export const useAsignaciones = (empresaId, horarioId, puestos, personas) => {
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

  const getDiaAsignaciones = () => asignaciones[selectedDia] || {};

  const getPersonaCount = (persona) => {
    const diaData = getDiaAsignaciones();
    let count = 0;
    for (const key in diaData) {
      if ((diaData[key] || []).includes(persona)) count++;
    }
    return count;
  };

  // ==================== DESCANSOS ====================

  // Check if a persona works on a specific day
  const personaTrabajaEnDia = (persona, diaKey) => {
    const diaData = asignaciones[diaKey] || {};
    for (const key in diaData) {
      if ((diaData[key] || []).includes(persona)) return true;
    }
    return false;
  };

  // Count how many days a persona rests (not assigned to any puesto)
  const getDescansos = (persona) => {
    let descansos = 0;
    for (const dia of DIAS) {
      if (!personaTrabajaEnDia(persona, dia.key)) descansos++;
    }
    return descansos;
  };

  // Count how many days a persona works
  const getDiasTrabajados = (persona) => {
    return 7 - getDescansos(persona);
  };

  // Precompute rest stats for all personas (for display)
  const descansosMap = useMemo(() => {
    const map = {};
    for (const persona of personas) {
      const descansos = getDescansos(persona);
      const trabajados = 7 - descansos;
      map[persona] = { descansos, trabajados };
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asignaciones, personas]);

  // ==================== ALEATORIO INTELIGENTE ====================

  // Sort personas: those with fewer rest days get priority to rest,
  // those with more rest days get priority to work
  const sortByNeedToWork = (personasList) => {
    return [...personasList].sort((a, b) => {
      const descA = descansosMap[a]?.descansos || 0;
      const descB = descansosMap[b]?.descansos || 0;
      // More rest = should work more → goes first
      return descB - descA;
    });
  };

  const asignarAleatorio = async () => {
    if (puestos.length === 0 || personas.length === 0) return;

    // Sort by who needs to work (most rested first), then shuffle within groups
    const sorted = sortByNeedToWork(personas);
    // Add some randomness within similar rest levels
    const grouped = [];
    let i = 0;
    while (i < sorted.length) {
      const currentDescanso = descansosMap[sorted[i]]?.descansos || 0;
      const group = [];
      while (i < sorted.length && (descansosMap[sorted[i]]?.descansos || 0) === currentDescanso) {
        group.push(sorted[i]);
        i++;
      }
      grouped.push(...shuffle(group));
    }

    const result = {};
    const personaCounts = {};
    personas.forEach((p) => { personaCounts[p] = 0; });
    puestos.forEach((puesto) => { result[puesto] = []; });

    for (const puesto of puestos) {
      for (const persona of grouped) {
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

  const asignarAleatorioSemana = async () => {
    if (puestos.length === 0 || personas.length === 0) return;

    // Track cumulative work days across the week for balance
    const weekWorkCounts = {};
    personas.forEach((p) => { weekWorkCounts[p] = 0; });

    for (const dia of DIAS) {
      // Sort: those who have worked less this week get priority
      const sorted = [...personas].sort((a, b) => weekWorkCounts[a] - weekWorkCounts[b]);
      // Shuffle within same work count for variety
      const grouped = [];
      let i = 0;
      while (i < sorted.length) {
        const currentCount = weekWorkCounts[sorted[i]];
        const group = [];
        while (i < sorted.length && weekWorkCounts[sorted[i]] === currentCount) {
          group.push(sorted[i]);
          i++;
        }
        grouped.push(...shuffle(group));
      }

      const result = {};
      const personaCounts = {};
      personas.forEach((p) => { personaCounts[p] = 0; });
      puestos.forEach((puesto) => { result[puesto] = []; });

      for (const puesto of puestos) {
        for (const persona of grouped) {
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

      // Update cumulative counts
      for (const persona of personas) {
        if (personaCounts[persona] > 0) weekWorkCounts[persona]++;
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
    descansosMap,
    asignarAleatorio,
    asignarAleatorioSemana,
    toggleAsignacion,
    resetAsignaciones,
    removeAsignacionesPuesto,
    removePersonaDeAsignaciones,
    hasAnyAsignacion,
  };
};
