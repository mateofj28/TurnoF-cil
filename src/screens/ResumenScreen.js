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
  isWide,
}) => {
  const [selectedDia, setSelectedDia] = useState(null);

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

  // Render expanded day detail
  const renderDayDetail = (diaKey) => {
    const diaData = asignaciones[diaKey] || {};
    const resters = getResters(diaKey, asignaciones, personas);
    const diaLabel = DIAS.find((d) => d.key === diaKey)?.label || '';

    return (
      <Animated.View entering={FadeIn.duration(200)} style={styles.detail}>
        <Text style={styles.detailTitle}>{diaLabel}</Text>

        {/* Puestos */}
        {puestos.map((puesto) => {
          const assigned = diaData[puesto] || [];
          if (assigned.length === 0) return null;
          return (
            <View key={puesto} style={styles.detailPuesto}>
              <Text style={styles.detailPuestoName}>{puesto}</Text>
              <View style={styles.detailChipsRow}>
                {assigned.map((p) => (
                  <View key={p} style={styles.detailChip}>
                    <View style={styles.detailChipDot} />
                    <Text style={styles.detailChipText}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {/* Descansan */}
        {resters.length > 0 && (
          <View style={styles.detailRest}>
            <Text style={styles.detailRestLabel}>Descansan</Text>
            <View style={styles.detailChipsRow}>
              {resters.map((p) => (
                <View key={p} style={styles.detailRestChip}>
                  <Text style={styles.detailRestChipText}>{p}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <Animated.View entering={enteringAnimation} key="step-3" style={styles.container}>
      {/* Stats cards */}
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

      {/* Week overview */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
        <View style={[styles.weekGrid, isWide && styles.weekGridWide]}>
          {DIAS.map((dia, i) => {
            const workCount = getDiaWorkCount(dia.key);
            const restCount = getDiaRestCount(dia.key);
            const isExpanded = selectedDia === dia.key;
            const hasData = workCount > 0;

            return (
              <Animated.View
                key={dia.key}
                entering={FadeInDown.delay(i * 40).duration(200)}
                style={isWide ? styles.weekItemWide : undefined}
              >
                <TouchableOpacity
                  style={[
                    styles.dayRow,
                    isExpanded && styles.dayRowExpanded,
                    !hasData && styles.dayRowEmpty,
                  ]}
                  onPress={() => setSelectedDia(isExpanded ? null : dia.key)}
                  activeOpacity={0.7}
                >
                  {/* Day name */}
                  <View style={styles.dayLeft}>
                    <View style={[styles.dayIndicator, hasData && styles.dayIndicatorActive]} />
                    <Text style={[styles.dayName, !hasData && styles.dayNameEmpty]}>
                      {dia.label}
                    </Text>
                  </View>

                  {/* Counts */}
                  <View style={styles.dayRight}>
                    {hasData ? (
                      <>
                        <View style={styles.countPill}>
                          <Text style={styles.countPillText}>👷 {workCount}</Text>
                        </View>
                        {restCount > 0 && (
                          <View style={styles.restPill}>
                            <Text style={styles.restPillText}>😴 {restCount}</Text>
                          </View>
                        )}
                      </>
                    ) : (
                      <Text style={styles.dayEmptyText}>Sin asignar</Text>
                    )}
                    <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
                  </View>
                </TouchableOpacity>

                {/* Expanded detail */}
                {isExpanded && hasData && renderDayDetail(dia.key)}
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {/* Share buttons — bottom, subtle */}
      <View style={styles.shareBar}>
        <TouchableOpacity style={styles.whatsappBtn} onPress={handleShareWhatsApp} activeOpacity={0.8}>
          <Text style={styles.whatsappBtnText}>📲 Enviar por WhatsApp</Text>
        </TouchableOpacity>
        {Platform.OS === 'web' && (
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopyText} activeOpacity={0.8}>
            <Text style={styles.copyBtnText}>📋</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};
