import { View, Text, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS } from '../constants';
import { resumenStyles as styles } from '../styles/resumen.styles';

export const ResumenScreen = ({
  enteringAnimation,
  puestos,
  asignaciones,
  isWide,
}) => {
  const totalAsignados = new Set(Object.values(asignaciones).flat()).size;
  const totalPuestos = puestos.length;
  const cubiertos = Object.values(asignaciones).filter((a) => a.length > 0).length;

  return (
    <Animated.View entering={enteringAnimation} key="step-3" style={styles.stepContent}>
      <View style={styles.statsRowCompact}>
        <Text style={styles.statInline}>
          <Text style={styles.statInlineNum}>{totalPuestos}</Text> puestos  ·{' '}
          <Text style={styles.statInlineNum}>{totalAsignados}</Text> personas  ·{' '}
          <Text style={[styles.statInlineNum, { color: COLORS.success }]}>
            {cubiertos}
          </Text>{' '}
          cubiertos
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.resumenGrid, isWide && styles.resumenGridWide]}>
          {puestos.map((puesto, i) => {
            const assigned = asignaciones[puesto] || [];
            const hasAssigned = assigned.length > 0;
            return (
              <Animated.View
                key={puesto}
                entering={FadeInDown.delay(i * 60).duration(300)}
                style={[styles.resumenGridItem, isWide && styles.resumenGridItemWide]}
              >
                <View style={[styles.resumenCard, !hasAssigned && styles.resumenCardEmpty]}>
                  <View style={styles.resumenHeader}>
                    <View
                      style={[
                        styles.resumenDot,
                        hasAssigned ? styles.resumenDotOk : styles.resumenDotWarn,
                      ]}
                    />
                    <Text style={styles.resumenPuesto} numberOfLines={1}>
                      {puesto}
                    </Text>
                  </View>
                  {hasAssigned ? (
                    <View style={styles.resumenPersonas}>
                      {assigned.map((persona) => (
                        <View key={persona} style={styles.resumenChip}>
                          <Text style={styles.resumenChipText} numberOfLines={1}>
                            {persona}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.resumenEmpty}>Sin asignar</Text>
                  )}
                </View>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </Animated.View>
  );
};
