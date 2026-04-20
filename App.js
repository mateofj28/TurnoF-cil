import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';

import { EmpresasScreen } from './src/screens/EmpresasScreen';
import { HorariosScreen } from './src/screens/HorariosScreen';
import { HorarioWizard } from './src/screens/HorarioWizard';
import { appStyles as styles } from './src/styles/app.styles';

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState(null);

  const renderScreen = () => {
    if (selectedEmpresa && selectedHorario) {
      return (
        <HorarioWizard
          empresa={selectedEmpresa}
          horario={selectedHorario}
          onBack={() => setSelectedHorario(null)}
        />
      );
    }

    if (selectedEmpresa) {
      return (
        <HorariosScreen
          empresa={selectedEmpresa}
          onSelectHorario={setSelectedHorario}
          onBack={() => setSelectedEmpresa(null)}
        />
      );
    }

    return <EmpresasScreen onSelectEmpresa={setSelectedEmpresa} />;
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
