import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

const NAV_KEY = '@nav_state';

// Direct localStorage for web (synchronous, reliable)
// AsyncStorage for native
const storage = {
  get: (key) => {
    if (Platform.OS === 'web') {
      try { return window.localStorage.getItem(key); } catch { return null; }
    }
    return null;
  },
  set: (key, value) => {
    if (Platform.OS === 'web') {
      try { window.localStorage.setItem(key, value); } catch { /* ignore */ }
    }
  },
};

const getInitialState = () => {
  const raw = storage.get(NAV_KEY);
  if (raw) {
    try {
      const { empresa, horario } = JSON.parse(raw);
      return { empresa: empresa || null, horario: horario || null };
    } catch { /* ignore */ }
  }
  return { empresa: null, horario: null };
};

export const usePersistedNav = () => {
  const initial = getInitialState();
  const [selectedEmpresa, setSelectedEmpresa] = useState(initial.empresa);
  const [selectedHorario, setSelectedHorario] = useState(initial.horario);

  // Persist on change
  useEffect(() => {
    storage.set(NAV_KEY, JSON.stringify({
      empresa: selectedEmpresa,
      horario: selectedHorario,
    }));
  }, [selectedEmpresa, selectedHorario]);

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
    restored: true,
    selectEmpresa,
    selectHorario,
    goBackToHorarios,
    goBackToEmpresas,
  };
};
