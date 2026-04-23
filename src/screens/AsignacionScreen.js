import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  LinearTransition,
} from 'react-native-reanimated';
import { COLORS, DIAS, MAX_ASIGNACIONES_POR_PERSONA } from '../constants';
import { asignacionStyles as styles } from '../styles/asignacion.styles';

const DaySelector = ({ selectedDia, onSelectDia, getDiaCount }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.dayScroll}
    contentContainerStyle={styles.dayScrollContent}
  >
    {DIAS.map((dia) => {
      const isActive = selectedDia === dia.key;
      const count = getDiaCount(dia.key);
      return (
        <TouchableOpacity
          key={dia.key}
          style={[styles.dayChip, isActive && styles.dayChipActive]}
          onPress={() => onSelectDia(dia.key)}
          activeOpacity={0.8}
        >
          <Text style={[styles.dayChipText, isActive && styles.dayChipTextActive]}>
            {dia.short}
          </Text>
          {count > 0 && (
            <View style={[styles.dayBadge, isActive && styles.dayBadgeActive]}>
              <Text style={[styles.dayBadgeText, isActive && styles.dayBadgeTextActive]}>
                {count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const PuestosTabs = ({ puestos, selectedPuesto, diaAsignaciones, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.tabsScroll}
    contentContainerStyle={styles.tabsContent}
  >
    {puestos.map((p) => {
      const isActive = selectedPuesto === p;
      const count = (diaAsignaciones[p] || []).length;
      return (
        <TouchableOpacity
          key={p}
          style={[styles.tab, isActive && styles.tabActive]}
          onPress={() => onSelect(p)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{p}</Text>
          {count > 0 && (
            <View style={[styles.badge, isActive && styles.badgeActive]}>
              <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                {count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const PuestosListWide = ({ puestos, selectedPuesto, diaAsignaciones, onSelect }) => (
  <ScrollView showsVerticalScrollIndicator={false} style={styles.puestosCol}>
    {puestos.map((p, i) => {
      const isActive = selectedPuesto === p;
      const count = (diaAsignaciones[p] || []).length;
      return (
        <Animated.View key={p} entering={FadeInDown.delay(i * 40).duration(250)}>
          <TouchableOpacity
            style={[styles.puestoItem, isActive && styles.puestoItemActive]}
            onPress={() => onSelect(p)}
            activeOpacity={0.8}
          >
            <View style={styles.puestoItemLeft}>
              <View style={[styles.puestoDot, isActive && styles.puestoDotActive]} />
              <Text style={[styles.puestoItemText, isActive && styles.puestoItemTextActive]}>
                {p}
              </Text>
            </View>
            {count > 0 && (
              <View style={[styles.badge, isActive && styles.badgeActive]}>
                <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                  {count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      );
    })}
  </ScrollView>
);

const PersonasList = ({
  personas,
  selectedPuesto,
  diaAsignaciones,
  getPersonaCount,
  onToggle,
}) => {
  if (!selectedPuesto) {
    return (
      <Animated.View entering={FadeIn.duration(400)} style={styles.emptyState}>
        <Text style={styles.emptyIcon}>👆</Text>
        <Text style={styles.emptyText}>Selecciona un puesto para comenzar</Text>
      </Animated.View>
    );
  }

  return (
    <FlatList
      data={personas}
      keyExtractor={(item) => item}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item, index }) => {
        const isAssigned = (diaAsignaciones[selectedPuesto] || []).includes(item);
        const totalCount = getPersonaCount(item);
        const isMaxed = totalCount >= MAX_ASIGNACIONES_POR_PERSONA && !isAssigned;
        return (
          <Animated.View
            entering={FadeInDown.delay(index * 30).duration(200)}
            layout={LinearTransition.springify()}
          >
            <TouchableOpacity
              style={[
                styles.assignCard,
                isAssigned && styles.assignCardActive,
                isMaxed && styles.assignCardDisabled,
              ]}
              onPress={() => onToggle(item)}
              activeOpacity={isMaxed ? 1 : 0.7}
            >
              <View style={styles.assignLeft}>
                <View
                  style={[
                    styles.checkbox,
                    isAssigned && styles.checkboxActive,
                    isMaxed && styles.checkboxDisabled,
                  ]}
                >
                  {isAssigned && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text
                  style={[
                    styles.assignText,
                    isAssigned && styles.assignTextActive,
                    isMaxed && styles.assignTextDisabled,
                  ]}
                >
                  {item}
                </Text>
              </View>
              {isAssigned && (
                <Animated.View entering={FadeIn.duration(200)}>
                  <View style={styles.assignedBadge}>
                    <Text style={styles.assignedBadgeText}>Asignado</Text>
                  </View>
                </Animated.View>
              )}
              {isMaxed && (
                <View style={styles.maxedBadge}>
                  <Text style={styles.maxedBadgeText}>Máximo</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        );
      }}
    />
  );
};

export const AsignacionScreen = ({
  enteringAnimation,
  puestos,
  personas,
  selectedDia,
  onSelectDia,
  getDiaAsignaciones,
  getDiaCount,
  selectedPuesto,
  isWide,
  getPersonaCount,
  onSelectPuesto,
  onToggle,
  onAsignarAleatorio,
  onAsignarAleatorioSemana,
}) => {
  const diaAsignaciones = getDiaAsignaciones();
  const diaLabel = DIAS.find((d) => d.key === selectedDia)?.label || '';

  return (
    <Animated.View entering={enteringAnimation} key="step-2" style={styles.stepContent}>
      {/* Day selector */}
      <DaySelector
        selectedDia={selectedDia}
        onSelectDia={onSelectDia}
        getDiaCount={getDiaCount}
      />

      {/* Action buttons */}
      <View style={styles.assignHeader}>
        <Text style={styles.sectionHint} numberOfLines={1}>
          {diaLabel} · Asigna personas a puestos
        </Text>
        <TouchableOpacity style={styles.randomBtn} onPress={onAsignarAleatorio} activeOpacity={0.8}>
          <Text style={styles.randomBtnText}>🎲 Día</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.randomWeekBtn} onPress={onAsignarAleatorioSemana} activeOpacity={0.8}>
          <Text style={styles.randomBtnText}>🎲 Semana</Text>
        </TouchableOpacity>
      </View>

      {/* Puestos + Personas */}
      {isWide ? (
        <View style={styles.assignRow}>
          <View style={styles.assignColLeft}>
            <Text style={styles.colTitle}>Puestos</Text>
            <PuestosListWide
              puestos={puestos}
              selectedPuesto={selectedPuesto}
              diaAsignaciones={diaAsignaciones}
              onSelect={onSelectPuesto}
            />
          </View>
          <View style={styles.assignDivider} />
          <View style={styles.assignColRight}>
            <Text style={styles.colTitle}>
              {selectedPuesto ? `Personas → ${selectedPuesto}` : 'Personas'}
            </Text>
            <PersonasList
              personas={personas}
              selectedPuesto={selectedPuesto}
              diaAsignaciones={diaAsignaciones}
              getPersonaCount={getPersonaCount}
              onToggle={onToggle}
            />
          </View>
        </View>
      ) : (
        <>
            <PuestosTabs
              puestos={puestos}
              selectedPuesto={selectedPuesto}
              diaAsignaciones={diaAsignaciones}
              onSelect={onSelectPuesto}
            />
            <PersonasList
              personas={personas}
              selectedPuesto={selectedPuesto}
            diaAsignaciones={diaAsignaciones}
            getPersonaCount={getPersonaCount}
            onToggle={onToggle}
          />
        </>
      )}
    </Animated.View>
  );
};
