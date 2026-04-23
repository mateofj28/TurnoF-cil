import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { COLORS, DIAS } from '../constants';
import { resumenStyles as styles } from '../styles/resumen.styles';

const getWorkers = (diaKey, asignaciones) => {
  const diaData = asignaciones[diaKey] || {};
  const workers = new Set();
  for (const key in diaData) {
    for (const p of diaData[key] || []) workers.add(p);
  }
  return workers;
};

const getResters = (diaKey, asignaciones, personas) => {
  const workers = getWorkers(diaKey, asignaciones);
  return personas.filter((p) => !workers.has(p));
};

const buildWhatsAppText = (empresaName, horarioName, puestos, personas, asignaciones) => {
  let text = `📋 *${horarioName}*\n🏢 ${empresaName}\n`;
  text += `━━━━━━━━━━━━━━━━\n\n`;

  for (const dia of DIAS) {
    const diaData = asignaciones[dia.key] || {};
    const hasSomething = Object.values(diaData).some((arr) => arr.length > 0);

    text += `📅 *${dia.label}*\n`;

    if (!hasSomething) {
      text += `   _Sin asignaciones_\n\n`;
      continue;
    }

    for (const puesto of puestos) {
      const assigned = diaData[puesto] || [];
      if (assigned.length > 0) {
        text += `   🔹 ${puesto}: ${assigned.join(', ')}\n`;
      }
    }

    const resters = getResters(dia.key, asignaciones, personas);
    if (resters.length > 0) {
      text += `   😴 Descansan: ${resters.join(', ')}\n`;
    }

    text += `\n`;
  }

  return text;
};

export const ResumenScreen = ({
  enteringAnimation,
  puestos,
  personas,
  asignaciones,
  horarioName,
  empresaName,
}) => {
  const [expandedDia, setExpandedDia] = useState(null);

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

  const getDiaWorkCount = (diaKey) => getWorkers(diaKey, asignaciones).size;
  const getDiaRestCount = (diaKey) => getResters(diaKey, asignaciones, personas).length;

  const handleShareWhatsApp = () => {
    const text = buildWhatsAppText(empresaName, horarioName, puestos, personas, asignaciones);
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const handleCopyText = () => {
    const text = buildWhatsAppText(empresaName, horarioName, puestos, personas, asignaciones);
    if (Platform.OS === 'web' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  const toggleDia = (diaKey) => {
    setExpandedDia(expandedDia === diaKey ? null : diaKey);
  };

  return (
    <Animated.View entering={enteringAnimation} key="step-3" style={styles.container}>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{puestos.length}</Text>
          <Text style={styles.statLabel}>Puestos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalPersonas}</Text>
          <Text style={styles.statLabel}>Personas</Text>
        </View>
        <View style={[styles.statCard, styles.statCardAccent]}>
          <Text style={[styles.statValue, styles.statValueAccent]}>{diasConAsignacion}/7</Text>
          <Text style={[styles.statLabel, styles.statLabelAccent]}>Días</Text>
        </View>
      </View>

      {/* Days list — scrollable */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
        {DIAS.map((dia, i) => {
          const workCount = getDiaWorkCount(dia.key);
          const restCount = getDiaRestCount(dia.key);
          const isExpanded = expandedDia === dia.key;
          const hasData = workCount > 0;
          const diaData = asignaciones[dia.key] || {};
          const resters = getResters(dia.key, asignaciones, personas);

          return (
            <Animated.View
              key={dia.key}
              entering={FadeInDown.delay(i * 35).duration(200)}
              style={styles.dayBlock}
            >
              {/* Day header — always visible */}
              <TouchableOpacity
                style={[
                  styles.dayHeader,
                  isExpanded && styles.dayHeaderExpanded,
                  !hasData && styles.dayHeaderEmpty,
                ]}
                onPress={() => toggleDia(dia.key)}
                activeOpacity={0.7}
              >
                <View style={styles.dayLeft}>
                  <View style={[styles.dayBar, hasData && styles.dayBarActive]} />
                  <Text style={[styles.dayName, !hasData && styles.dayNameEmpty]}>
                    {dia.label}
                  </Text>
                </View>
                <View style={styles.dayRight}>
                  {hasData ? (
                    <>
                      <View style={styles.workPill}>
                        <Text style={styles.workPillText}>👷 {workCount}</Text>
                      </View>
                      {restCount > 0 && (
                        <View style={styles.restPill}>
                          <Text style={styles.restPillText}>😴 {restCount}</Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <Text style={styles.emptyText}>Sin asignar</Text>
                  )}
                  <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
                </View>
              </TouchableOpacity>

              {/* Expanded content */}
              {isExpanded && hasData && (
                <Animated.View entering={FadeIn.duration(150)} style={styles.dayBody}>
                  {puestos.map((puesto) => {
                    const assigned = diaData[puesto] || [];
                    if (assigned.length === 0) return null;
                    return (
                      <View key={puesto} style={styles.puestoBlock}>
                        <Text style={styles.puestoName}>{puesto}</Text>
                        <View style={styles.chipsRow}>
                          {assigned.map((p) => (
                            <View key={p} style={styles.personChip}>
                              <View style={styles.personDot} />
                              <Text style={styles.personChipText}>{p}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    );
                  })}

                  {resters.length > 0 && (
                    <View style={styles.restBlock}>
                      <Text style={styles.restLabel}>😴 Descansan</Text>
                      <View style={styles.chipsRow}>
                        {resters.map((p) => (
                          <View key={p} style={styles.restChip}>
                            <Text style={styles.restChipText}>{p}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </Animated.View>
              )}
            </Animated.View>
          );
        })}

        {/* Share buttons inside scroll */}
        <View style={styles.shareSection}>
          <TouchableOpacity style={styles.whatsappBtn} onPress={handleShareWhatsApp} activeOpacity={0.8}>
            <Text style={styles.whatsappBtnText}>📲 Enviar por WhatsApp</Text>
          </TouchableOpacity>
          {Platform.OS === 'web' && (
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopyText} activeOpacity={0.8}>
              <Text style={styles.copyBtnText}>📋 Copiar texto</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
};
