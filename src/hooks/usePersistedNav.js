import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NAV_KEY = '@nav_state';

export const usePersistedNav = () => {
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [restored, setRestored] = useState(false);

  // Restore on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(NAV_KEY);
        if (raw) {
          const { empresa, horario } = JSON.parse(raw);
          if (empresa) setSelectedEmpresa(empresa);
          if (horario) setSelectedHorario(horario);
        }
      } catch (e) {
        // ignore
      } finally {
        setRestored(true);
      }
    })();
  }, []);

  // Persist on change
  useEffect(() => {
    if (!restored) return;
    const state = {
      empresa: selectedEmpresa,
      horario: selectedHorario,
    };
    AsyncStorage.setItem(NAV_KEY, JSON.stringify(state)).catch(() => {});
  }, [selectedEmpresa, selectedHorario, restored]);

  const selectEmpresa = useCallback((empresa) => {
    setSelectedEmpresa(empresa);
    setSelectedHorario(null);
  }, []);

  const selectHorario = useCallback((horario) => {
    setSelectedHorario(horario);
  }, []);

  const goBackToHorarios = useCallback(() => {
    setSelectedHorario(null);
  }, []);

  const goBackToEmpresas = useCallback(() => {
    setSelectedEmpresa(null);
    setSelectedHorario(null);
  }, []);

  return {
    selectedEmpresa,
    selectedHorario,
    restored,
    selectEmpresa,
    selectHorario,
    goBackToHorarios,
    goBackToEmpresas,
  };
};
