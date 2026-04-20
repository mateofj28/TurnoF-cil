import { useState } from 'react';

export const useStepper = (totalSteps) => {
  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);

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
