import { StatusBar } from 'expo-status-bar';
import { View, Text, useWindowDimensions, ActivityIndicator } from 'react-native';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';

import { COLORS } from './src/constants';
import { usePersistedNav } from './src/hooks';
import { EmpresasScreen } from './src/screens/EmpresasScreen';
import { HorariosScreen } from './src/screens/HorariosScreen';
import { HorarioWizard } from './src/screens/HorarioWizard';
import { appStyles as styles } from './src/styles/app.styles';

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  const {
    selectedEmpresa,
    selectedHorario,
    selectEmpresa,
    selectHorario,
    goBackToHorarios,
    goBackToEmpresas,
  } = usePersistedNav();

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
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
