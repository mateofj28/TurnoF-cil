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
import { COLORS, MAX_ASIGNACIONES_POR_PERSONA } from '../constants';
import { asignacionStyles as styles } from '../styles/asignacion.styles';

const PuestosList = ({ puestos, selectedPuesto, asignaciones, onSelect, isWide }) => (
  <ScrollView showsVerticalScrollIndicator={false} style={isWide ? styles.puestosCol : undefined}>
    {puestos.map((p, i) => {
      const isActive = selectedPuesto === p;
      const count = (asignaciones[p] || []).length;
      return (
        <Animated.View key={p} entering={FadeInDown.delay(i * 60).duration(300)}>
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
  asignaciones,
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
        const isAssigned = (asignaciones[selectedPuesto] || []).includes(item);
        const totalCount = getPersonaCount(item);
        const isMaxed = totalCount >= MAX_ASIGNACIONES_POR_PERSONA && !isAssigned;
        return (
          <Animated.View
            entering={FadeInDown.delay(index * 40).duration(250)}
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
                <View>
                  <Text
                    style={[
                      styles.assignText,
                      isAssigned && styles.assignTextActive,
                      isMaxed && styles.assignTextDisabled,
                    ]}
                  >
                    {item}
                  </Text>
                  {totalCount > 0 && (
                    <Text style={styles.assignCountHint}>Ya asignado a otro puesto</Text>
                  )}
                </View>
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
  asignaciones,
  selectedPuesto,
  isWide,
  getPersonaCount,
  onSelectPuesto,
  onToggle,
  onAsignarAleatorio,
}) => (
  <Animated.View entering={enteringAnimation} key="step-2" style={styles.stepContent}>
    <View style={styles.assignHeader}>
      <Text style={styles.sectionHint}>
        Selecciona un puesto y marca las personas asignadas
      </Text>
      <TouchableOpacity style={styles.randomBtn} onPress={onAsignarAleatorio} activeOpacity={0.8}>
        <Text style={styles.randomBtnText}>🎲 Aleatorio</Text>
      </TouchableOpacity>
    </View>
    {isWide ? (
      <View style={styles.assignRow}>
        <View style={styles.assignColLeft}>
          <Text style={styles.colTitle}>Puestos</Text>
          <PuestosList
            puestos={puestos}
            selectedPuesto={selectedPuesto}
            asignaciones={asignaciones}
            onSelect={onSelectPuesto}
            isWide={isWide}
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
            asignaciones={asignaciones}
            getPersonaCount={getPersonaCount}
            onToggle={onToggle}
          />
        </View>
      </View>
    ) : (
      <>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          <View style={styles.tabsRow}>
            {puestos.map((p, i) => {
              const isActive = selectedPuesto === p;
              const count = (asignaciones[p] || []).length;
              return (
                <Animated.View key={p} entering={FadeInDown.delay(i * 60).duration(300)}>
                  <TouchableOpacity
                    style={[styles.tab, isActive && styles.tabActive]}
                    onPress={() => onSelectPuesto(p)}
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
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>
        <PersonasList
          personas={personas}
          selectedPuesto={selectedPuesto}
          asignaciones={asignaciones}
          getPersonaCount={getPersonaCount}
          onToggle={onToggle}
        />
      </>
    )}
  </Animated.View>
);
