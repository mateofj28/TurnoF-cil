import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

export const useStorage = () => {
  const [puestos, setPuestos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    (async () => {
      try {
        const [savedPuestos, savedPersonas] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.puestos),
          AsyncStorage.getItem(STORAGE_KEYS.personas),
        ]);
        if (savedPuestos) setPuestos(JSON.parse(savedPuestos));
        if (savedPersonas) setPersonas(JSON.parse(savedPersonas));
      } catch (e) {
        console.warn('Error loading data:', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Persist puestos when they change
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEYS.puestos, JSON.stringify(puestos)).catch(() => {});
  }, [puestos, loaded]);

  // Persist personas when they change
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEYS.personas, JSON.stringify(personas)).catch(() => {});
  }, [personas, loaded]);

  return { puestos, setPuestos, personas, setPersonas, loaded };
};
