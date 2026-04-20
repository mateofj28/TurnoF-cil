import { useState } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import Animated, {
  FadeInDown,
  SlideInRight,
  SlideInLeft,
} from 'react-native-reanimated';

import { STEPS } from '../constants';
import { capitalize } from '../utils';
import { useStorage, useAsignaciones, useStepper } from '../hooks';
import { StepIndicator, InputSection, NavigationBar } from '../components';
import { AsignacionScreen } from './AsignacionScreen';
import { ResumenScreen } from './ResumenScreen';
import { appStyles as styles } from '../styles/app.styles';

export const HorarioWizard = ({ empresa, horario, onBack }) => {
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  const { step, prevStep, goToStep } = useStepper(STEPS.length);
  const {
    puestos,
    personas,
    addPuesto,
    removePuesto,
    addPersona,
    removePersona,
  } = useStorage(empresa.id, horario.id);
  const {
    asignaciones,
    selectedPuesto,
    setSelectedPuesto,
    getPersonaCount,
    asignarAleatorio,
    toggleAsignacion,
    resetAsignaciones,
    removeAsignacionesPuesto,
    removePersonaDeAsignaciones,
  } = useAsignaciones(empresa.id, horario.id, puestos, personas);

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (text) => setInputValue(capitalize(text));

  const handleGoToStep = (newStep) => {
    goToStep(newStep);
    setInputValue('');
  };

  const handleAddPuesto = async () => {
    const name = inputValue.trim();
    if (!name || puestos.includes(name)) return;
    await addPuesto(name);
    setInputValue('');
  };

  const handleAddPersona = async () => {
    const name = inputValue.trim();
    if (!name || personas.includes(name)) return;
    await addPersona(name);
    setInputValue('');
  };

  const handleRemovePuesto = async (name) => {
    await removePuesto(name);
    await removeAsignacionesPuesto(name);
  };

  const handleRemovePersona = async (name) => {
    await removePersona(name);
    await removePersonaDeAsignaciones(name);
  };

  const reset = async () => {
    handleGoToStep(0);
    await resetAsignaciones();
  };

  const canGoNext = () => {
    if (step === 0) return puestos.length > 0;
    if (step === 1) return personas.length > 0;
    if (step === 2) return Object.values(asignaciones).some((a) => a.length > 0);
    return false;
  };

  const slideEnter = step > prevStep
    ? SlideInRight.duration(300)
    : SlideInLeft.duration(300);

  const renderCurrentStep = () => {
    switch (step) {
      case 0:
        return (
          <InputSection
            placeholder="Ej: Caja, Bodega, Recepción..."
            inputValue={inputValue}
            onChangeText={handleInputChange}
            onAdd={handleAddPuesto}
            items={puestos}
            onRemove={handleRemovePuesto}
            emptyMsg="Agrega tu primer puesto de trabajo"
            emptyIcon="🏢"
            enteringAnimation={slideEnter}
            stepKey={`step-${step}`}
          />
        );
      case 1:
        return (
          <InputSection
            placeholder="Ej: Juan, María, Carlos..."
            inputValue={inputValue}
            onChangeText={handleInputChange}
            onAdd={handleAddPersona}
            items={personas}
            onRemove={handleRemovePersona}
            emptyMsg="Agrega las personas disponibles"
            emptyIcon="👥"
            enteringAnimation={slideEnter}
            stepKey={`step-${step}`}
          />
        );
      case 2:
        return (
          <AsignacionScreen
            enteringAnimation={slideEnter}
            puestos={puestos}
            personas={personas}
            asignaciones={asignaciones}
            selectedPuesto={selectedPuesto}
            isWide={isWide}
            getPersonaCount={getPersonaCount}
            onSelectPuesto={setSelectedPuesto}
            onToggle={toggleAsignacion}
            onAsignarAleatorio={asignarAleatorio}
          />
        );
      case 3:
        return (
          <ResumenScreen
            enteringAnimation={slideEnter}
            puestos={puestos}
            asignaciones={asignaciones}
            isWide={isWide}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Animated.View entering={FadeInDown.duration(500)}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>← {empresa.name}</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{horario.name}</Text>
        <Text style={styles.headerSub}>
          {empresa.name} · Organiza tu equipo
        </Text>
      </Animated.View>

      <StepIndicator
        currentStep={step}
        isWide={isWide}
        onGoToStep={handleGoToStep}
      />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {STEPS[step].icon} {STEPS[step].label}
          </Text>
          <Text style={styles.cardStep}>
            Paso {step + 1} de {STEPS.length}
          </Text>
        </View>
        <View style={styles.cardBody}>{renderCurrentStep()}</View>
      </View>

      <NavigationBar
        step={step}
        totalSteps={STEPS.length}
        canGoNext={canGoNext()}
        onBack={() => handleGoToStep(step - 1)}
        onNext={() => handleGoToStep(step + 1)}
        onReset={reset}
      />
    </>
  );
};
