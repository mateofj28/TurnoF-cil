import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

const STEP_KEY = '@wizard_step';

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

const getInitialStep = (storageKey, totalSteps) => {
  if (!storageKey) return 0;
  const saved = storage.get(storageKey);
  if (saved !== null) {
    const parsed = parseInt(saved, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed < totalSteps) return parsed;
  }
  return 0;
};

export const useStepper = (totalSteps, persistKey) => {
  const storageKey = persistKey ? `${STEP_KEY}_${persistKey}` : null;
  const [step, setStep] = useState(() => getInitialStep(storageKey, totalSteps));
  const [prevStep, setPrevStep] = useState(0);

  // Persist step on change
  useEffect(() => {
    if (storageKey) {
      storage.set(storageKey, String(step));
    }
  }, [step, storageKey]);

  const goToStep = (newStep) => {
    setPrevStep(step);
    setStep(newStep);
  };

  const goNext = () => {
    if (step < totalSteps - 1) goToStep(step + 1);
  };

  const goBack = () => {
    if (step > 0) goToStep(step - 1);
  };

  return { step, prevStep, goToStep, goNext, goBack };
};
