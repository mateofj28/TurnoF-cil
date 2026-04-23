import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STEP_KEY = '@wizard_step';

export const useStepper = (totalSteps, persistKey) => {
  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const storageKey = persistKey ? `${STEP_KEY}_${persistKey}` : null;

  // Restore step on mount
  useEffect(() => {
    if (!storageKey) { setLoaded(true); return; }
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        if (saved !== null) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed) && parsed >= 0 && parsed < totalSteps) {
            setStep(parsed);
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setLoaded(true);
      }
    })();
  }, [storageKey, totalSteps]);

  // Persist step on change
  useEffect(() => {
    if (!loaded || !storageKey) return;
    AsyncStorage.setItem(storageKey, String(step)).catch(() => { });
  }, [step, loaded, storageKey]);

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

  return { step, prevStep, goToStep, goNext, goBack, loaded };
};
