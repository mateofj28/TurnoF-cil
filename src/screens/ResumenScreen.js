import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, DIAS } from '../constants';
import { resumenStyles as styles } from '../styles/resumen.styles';

const DayTab = ({ dia, isActive, count, onPress }) => (
  <TouchableOpacity
    style={[styles.dayTab, isActive && styles.dayTabActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.dayTabText, isActive && styles.dayTabTextActive]}>
      {dia.short}
    </Text>
    {count > 0 && (
      <View style={[styles.dayTabBadge, isActive && styles.dayTabBadgeActive]}>
        <Text style={[styles.dayTabBadgeText, isActive && styles.dayTabBadgeTextActive]}>
          {count}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

export const ResumenScreen = ({
  enteringAnimation,
  puestos,
  asignaciones,
  isWide,
}) => {
  const [viewMode, setViewMode] = useState('semana'); // 'semana' | 'dia'
  const [selectedDia, setSelectedDia] = useState(DIAS[0].key);

  // Stats
  const totalPersonas = new Set(
    DIAS.flatMap((dia) => {
      const diaData = asignaciones[dia.key] || {};
      return Object.values(diaData).flat();
    })
  ).size;

  const diasConAsignacion = DIAS.filter((dia) => {
    const diaData = asignaciones[dia.key] || {};
    return Object.values(diaData).some((arr) => arr.length > 0);
  }).length;

  const getDiaPersonasCount = (diaKey) => {
    const diaData = asignaciones[diaKey] || {};
    return new Set(Object.values(diaData).flat()).size;
  };

  const renderDiaContent = (diaKey) => {
    const diaData = asignaciones[diaKey] || {};
    const hasSomething = Object.values(diaData).some((arr) => arr.length > 0);

    if (!hasSomething) {
      return (
        <Text style={styles.noDayData}>Sin asignaciones</Text>
      );
    }

    return puestos.map((puesto) => {
      const assigned = diaData[puesto] || [];
      if (assigned.length === 0) return null;
      return (
        <View key={puesto} style={styles.puestoRow}>
          <View style={styles.puestoLabel}>
            <View style={styles.puestoDot} />
            <Text style={styles.puestoName} numberOfLines={1}>{puesto}</Text>
          </View>
          <View style={styles.personasRow}>
            {assigned.map((persona) => (
              <View key={persona} style={styles.personaChip}>
                <Text style={styles.personaChipText} numberOfLines={1}>{persona}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    });
  };

  return (
    <Animated.View entering={enteringAnimation} key="step-3" style={styles.stepContent}>
      {/* Stats bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statInline}>
          <Text style={styles.statNum}>{puestos.length}</Text> puestos · {' '}
          <Text style={styles.statNum}>{totalPersonas}</Text> personas · {' '}
          <Text style={[styles.statNum, { color: COLORS.success }]}>{diasConAsignacion}</Text>/7 días
        </Text>
      </View>

      {/* View mode toggle */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeBtn, viewMode === 'semana' && styles.modeBtnActive]}
          onPress={() => setViewMode('semana')}
          activeOpacity={0.8}
        >
          <Text style={[styles.modeBtnText, viewMode === 'semana' && styles.modeBtnTextActive]}>
            Vista semanal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, viewMode === 'dia' && styles.modeBtnActive]}
          onPress={() => setViewMode('dia')}
          activeOpacity={0.8}
        >
          <Text style={[styles.modeBtnText, viewMode === 'dia' && styles.modeBtnTextActive]}>
            Por día
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'dia' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dayTabsScroll}
          contentContainerStyle={styles.dayTabsContent}
        >
          {DIAS.map((dia) => (
            <DayTab
              key={dia.key}
              dia={dia}
              isActive={selectedDia === dia.key}
              count={getDiaPersonasCount(dia.key)}
              onPress={() => setSelectedDia(dia.key)}
            />
          ))}
        </ScrollView>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
        {viewMode === 'semana' ? (
          // Weekly view: all days stacked
          <View style={[styles.weekGrid, isWide && styles.weekGridWide]}>
            {DIAS.map((dia, i) => {
              const count = getDiaPersonasCount(dia.key);
              return (
                <Animated.View
                  key={dia.key}
                  entering={FadeInDown.delay(i * 50).duration(250)}
                  style={[styles.dayCard, isWide && styles.dayCardWide]}
                >
                  <View style={[styles.dayCardHeader, count > 0 && styles.dayCardHeaderActive]}>
                    <Text style={styles.dayCardTitle}>{dia.label}</Text>
                    <Text style={styles.dayCardCount}>
                      {count > 0 ? `${count} persona${count !== 1 ? 's' : ''}` : 'Libre'}
                    </Text>
                  </View>
                  <View style={styles.dayCardBody}>
                    {renderDiaContent(dia.key)}
                  </View>
                </Animated.View>
              );
            })}
          </View>
        ) : (
          // Single day view
          <Animated.View entering={FadeInDown.duration(250)}>
            <View style={styles.singleDayCard}>
              <View style={styles.singleDayHeader}>
                <Text style={styles.singleDayTitle}>
                  {DIAS.find((d) => d.key === selectedDia)?.label}
                </Text>
              </View>
                <View style={styles.singleDayBody}>
                  {puestos.map((puesto, i) => {
                  const diaData = asignaciones[selectedDia] || {};
                  const assigned = diaData[puesto] || [];
                  const hasAssigned = assigned.length > 0;
                  return (
                    <Animated.View
                      key={puesto}
                      entering={FadeInDown.delay(i * 40).duration(200)}
                    >
                      <View style={[styles.singlePuestoCard, !hasAssigned && styles.singlePuestoCardEmpty]}>
                        <View style={styles.puestoLabel}>
                          <View style={[styles.puestoDot, hasAssigned && styles.puestoDotOk]} />
                          <Text style={styles.puestoName}>{puesto}</Text>
                        </View>
                        {hasAssigned ? (
                          <View style={styles.personasRow}>
                            {assigned.map((persona) => (
                              <View key={persona} style={styles.personaChip}>
                                <Text style={styles.personaChipText}>{persona}</Text>
                              </View>
                            ))}
                          </View>
                        ) : (
                          <Text style={styles.emptyPuesto}>Sin asignar</Text>
                        )}
                      </View>
                    </Animated.View>
                  );
                })}
                </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </Animated.View>
  );
};
