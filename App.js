import { StatusBar } from 'expo-status-bar';
import { View, Text, useWindowDimensions } from 'react-native';

import { usePersistedNav } from './src/hooks';
import { EmpresasScreen } from './src/screens/EmpresasScreen';
import { HorariosScreen } from './src/screens/HorariosScreen';
import { HorarioWizard } from './src/screens/HorarioWizard';
import { appStyles as styles } from './src/styles/app.styles';

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  const {
    selectedEmpresa,
    selectedHorario,
    restored,
    selectEmpresa,
    selectHorario,
    goBackToHorarios,
    goBackToEmpresas,
  } = usePersistedNav();

  if (!restored) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#94A3B8', fontSize: 14 }}>Cargando...</Text>
      </View>
    );
  }

  const renderScreen = () => {
    if (selectedEmpresa && selectedHorario) {
      return (
        <HorarioWizard
          empresa={selectedEmpresa}
          horario={selectedHorario}
          onBack={goBackToHorarios}
        />
      );
    }

    if (selectedEmpresa) {
      return (
        <HorariosScreen
          empresa={selectedEmpresa}
          onSelectHorario={selectHorario}
          onBack={goBackToEmpresas}
        />
      );
    }

    return <EmpresasScreen onSelectEmpresa={selectEmpresa} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.inner, { maxWidth: isWide ? 800 : '100%' }]}>
        {renderScreen()}
      </View>
    </View>
  );
}
