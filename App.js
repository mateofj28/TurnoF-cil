import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import Animated, {
  FadeInDown,
  SlideInRight,
  SlideInLeft,
} from 'react-native-reanimated';

import { STEPS } from './src/constants';
import { capitalize } from './src/utils';
import { useStorage, useAsignaciones, useStepper } from './src/hooks';
import { StepIndicator, InputSection, NavigationBar } from './src/components';
import { AsignacionScreen } from './src/screens/AsignacionScreen';
import { ResumenScreen } from './src/screens/ResumenScreen';
import { appStyles as styles } from './src/styles/app.styles';

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  const { step, prevStep, goToStep } = useStepper(STEPS.length);
  const { puestos, setPuestos, personas, setPersonas } = useStorage();
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
  } = useAsignaciones(puestos, personas);

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (text) => setInputValue(capitalize(text));

  const handleGoToStep = (newStep) => {
    goToStep(newStep);
    setInputValue('');
  };

  const addPuesto = () => {
    const name = inputValue.trim();
    if (!name || puestos.includes(name)) return;
    setPuestos([...puestos, name]);
    setInputValue('');
  };

  const addPersona = () => {
    const name = inputValue.trim();
    if (!name || personas.includes(name)) return;
    setPersonas([...personas, name]);
    setInputValue('');
  };

  const removePuesto = (name) => {
    setPuestos(puestos.filter((p) => p !== name));
    removeAsignacionesPuesto(name);
  };

  const removePersona = (name) => {
    setPersonas(personas.filter((p) => p !== name));
    removePersonaDeAsignaciones(name);
  };

  const reset = () => {
    handleGoToStep(0);
    resetAsignaciones();
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
            onAdd={addPuesto}
            items={puestos}
            onRemove={removePuesto}
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
            onAdd={addPersona}
            items={personas}
            onRemove={removePersona}
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
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.inner, { maxWidth: isWide ? 800 : '100%' }]}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <Text style={styles.header}>Horarios de Trabajo</Text>
          <Text style={styles.headerSub}>
            Organiza tu equipo de forma rápida y sencilla
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
      </View>
    </View>
  );
}
