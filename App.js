import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  SlideInRight,
  SlideInLeft,
  FadeInDown,
  FadeInUp,
  LinearTransition,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STEPS = [
  { key: 'puestos', label: 'Puestos', icon: '🏢' },
  { key: 'personas', label: 'Personas', icon: '👥' },
  { key: 'asignacion', label: 'Asignación', icon: '🔗' },
  { key: 'resumen', label: 'Resumen', icon: '📋' },
];

const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#818CF8',
  primaryBg: '#EEF2FF',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  success: '#10B981',
  successBg: '#ECFDF5',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  text: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  shadow: '#0F172A',
};

const STORAGE_KEYS = { puestos: '@puestos', personas: '@personas' };

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);
  const [puestos, setPuestos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [asignaciones, setAsignaciones] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    (async () => {
      try {
        const [savedPuestos, savedPersonas] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.puestos),
          AsyncStorage.getItem(STORAGE_KEYS.personas),
        ]);
        if (savedPuestos) setPuestos(JSON.parse(savedPuestos));
        if (savedPersonas) setPersonas(JSON.parse(savedPersonas));
      } catch (e) {
        console.warn('Error loading data:', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Persist puestos & personas when they change
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEYS.puestos, JSON.stringify(puestos)).catch(() => { });
  }, [puestos, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEYS.personas, JSON.stringify(personas)).catch(() => { });
  }, [personas, loaded]);

  const goToStep = (newStep) => {
    setPrevStep(step);
    setInputValue('');
    setStep(newStep);
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

  const asignarAleatorio = () => {
    if (puestos.length === 0 || personas.length === 0) return;
    const shuffled = shuffle(personas);
    const result = {};
    puestos.forEach((puesto, i) => {
      result[puesto] = [shuffled[i % shuffled.length]];
    });
    // If more people than puestos, distribute remaining
    if (shuffled.length > puestos.length) {
      const remaining = shuffled.slice(puestos.length);
      remaining.forEach((persona, i) => {
        const puesto = puestos[i % puestos.length];
        if (!result[puesto].includes(persona)) {
          result[puesto].push(persona);
        }
      });
    }
    setAsignaciones(result);
    setSelectedPuesto(puestos[0]);
  };

  const toggleAsignacion = (persona) => {
    if (!selectedPuesto) return;
    setAsignaciones((prev) => {
      const current = prev[selectedPuesto] || [];
      if (current.includes(persona)) {
        return { ...prev, [selectedPuesto]: current.filter((p) => p !== persona) };
      }
      return { ...prev, [selectedPuesto]: [...current, persona] };
    });
  };

  const reset = () => {
    goToStep(0);
    setAsignaciones({});
    setSelectedPuesto(null);
  };

  const canGoNext = () => {
    if (step === 0) return puestos.length > 0;
    if (step === 1) return personas.length > 0;
    if (step === 2) return Object.values(asignaciones).some((a) => a.length > 0);
    return false;
  };

  const removePuesto = (name) => {
    setPuestos(puestos.filter((p) => p !== name));
    const { [name]: _, ...rest } = asignaciones;
    setAsignaciones(rest);
    if (selectedPuesto === name) setSelectedPuesto(null);
  };

  const removePersona = (name) => {
    setPersonas(personas.filter((p) => p !== name));
    const updated = {};
    for (const key in asignaciones) {
      updated[key] = asignaciones[key].filter((p) => p !== name);
    }
    setAsignaciones(updated);
  };

  const slideEnter = step > prevStep ? SlideInRight.duration(300) : SlideInLeft.duration(300);

  const renderStepIndicator = () => (
    <View style={[styles.stepsRow, isWide && styles.stepsRowWide]}>
      {STEPS.map((s, i) => {
        const isActive = i === step;
        const isDone = i < step;
        return (
          <Animated.View
            key={s.key}
            entering={FadeInDown.delay(i * 80).duration(400)}
            style={styles.stepIndicatorItem}
          >
            <TouchableOpacity
              onPress={() => { if (isDone) goToStep(i); }}
              activeOpacity={isDone ? 0.7 : 1}
              style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isDone && styles.stepCircleDone,
              ]}
            >
              <Text style={[
                styles.stepCircleText,
                (isActive || isDone) && styles.stepCircleTextActive,
              ]}>
                {isDone ? '✓' : s.icon}
              </Text>
            </TouchableOpacity>
            {!isWide && (
              <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
                {s.label}
              </Text>
            )}
            {isWide && (
              <Text style={[styles.stepLabelWide, isActive && styles.stepLabelActive]}>
                {s.label}
              </Text>
            )}
            {i < STEPS.length - 1 && <View style={[styles.stepLine, isDone && styles.stepLineDone]} />}
          </Animated.View>
        );
      })}
    </View>
  );

  const renderInputSection = (placeholder, onAdd, items, onRemove, emptyMsg) => (
    <Animated.View entering={slideEnter} key={`step-${step}`} style={styles.stepContent}>
      <View style={styles.inputGroup}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={onAdd}
          />
        </View>
        <TouchableOpacity
          style={[styles.addBtn, !inputValue.trim() && styles.addBtnDisabled]}
          onPress={onAdd}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>Agregar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chipCount}>
        <Text style={styles.chipCountText}>{items.length} registrado{items.length !== 1 ? 's' : ''}</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 50).duration(300)} layout={LinearTransition.springify()}>
            <View style={styles.listCard}>
              <View style={styles.listCardLeft}>
                <View style={styles.listAvatar}>
                  <Text style={styles.listAvatarText}>{item.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.listCardText}>{item}</Text>
              </View>
              <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(item)}>
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
        ListEmptyComponent={
          <Animated.View entering={FadeIn.duration(400)} style={styles.emptyState}>
            <Text style={styles.emptyIcon}>{step === 0 ? '🏢' : '👥'}</Text>
            <Text style={styles.emptyText}>{emptyMsg}</Text>
          </Animated.View>
        }
      />
    </Animated.View>
  );

  const renderAsignacion = () => (
    <Animated.View entering={slideEnter} key="step-2" style={styles.stepContent}>
      <View style={styles.assignHeader}>
        <Text style={styles.sectionHint}>Selecciona un puesto y marca las personas asignadas</Text>
        <TouchableOpacity style={styles.randomBtn} onPress={asignarAleatorio} activeOpacity={0.8}>
          <Text style={styles.randomBtnText}>🎲 Aleatorio</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        <View style={styles.tabsRow}>
          {puestos.map((p, i) => {
            const isActive = selectedPuesto === p;
            const count = (asignaciones[p] || []).length;
            return (
              <Animated.View key={p} entering={FadeInDown.delay(i * 60).duration(300)}>
                <TouchableOpacity
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => setSelectedPuesto(p)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{p}</Text>
                  {count > 0 && (
                    <View style={[styles.badge, isActive && styles.badgeActive]}>
                      <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>{count}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
      {selectedPuesto ? (
        <FlatList
          data={personas}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const isAssigned = (asignaciones[selectedPuesto] || []).includes(item);
            return (
              <Animated.View entering={FadeInDown.delay(index * 40).duration(250)} layout={LinearTransition.springify()}>
                <TouchableOpacity
                  style={[styles.assignCard, isAssigned && styles.assignCardActive]}
                  onPress={() => toggleAsignacion(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.assignLeft}>
                    <View style={[styles.checkbox, isAssigned && styles.checkboxActive]}>
                      {isAssigned && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={[styles.assignText, isAssigned && styles.assignTextActive]}>{item}</Text>
                  </View>
                  {isAssigned && (
                    <Animated.View entering={FadeIn.duration(200)}>
                      <View style={styles.assignedBadge}>
                        <Text style={styles.assignedBadgeText}>Asignado</Text>
                      </View>
                    </Animated.View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />
      ) : (
        <Animated.View entering={FadeIn.duration(400)} style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👆</Text>
          <Text style={styles.emptyText}>Selecciona un puesto para comenzar</Text>
        </Animated.View>
      )}
    </Animated.View>
  );

  const renderResumen = () => {
    const totalAsignados = new Set(Object.values(asignaciones).flat()).size;
    const totalPuestos = puestos.length;
    return (
      <Animated.View entering={slideEnter} key="step-3" style={styles.stepContent}>
        <View style={styles.statsRow}>
          <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.statCard}>
            <Text style={styles.statNumber}>{totalPuestos}</Text>
            <Text style={styles.statLabel}>Puestos</Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.statCard}>
            <Text style={styles.statNumber}>{totalAsignados}</Text>
            <Text style={styles.statLabel}>Personas</Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.statCard}>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>
              {Object.values(asignaciones).filter((a) => a.length > 0).length}
            </Text>
            <Text style={styles.statLabel}>Cubiertos</Text>
          </Animated.View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {puestos.map((puesto, i) => {
            const assigned = asignaciones[puesto] || [];
            const hasAssigned = assigned.length > 0;
            return (
              <Animated.View key={puesto} entering={FadeInDown.delay(i * 100).duration(400)}>
                <View style={[styles.resumenCard, !hasAssigned && styles.resumenCardEmpty]}>
                  <View style={styles.resumenHeader}>
                    <View style={[styles.resumenDot, hasAssigned ? styles.resumenDotOk : styles.resumenDotWarn]} />
                    <Text style={styles.resumenPuesto}>{puesto}</Text>
                    <Text style={styles.resumenCount}>{assigned.length} persona{assigned.length !== 1 ? 's' : ''}</Text>
                  </View>
                  {hasAssigned ? (
                    <View style={styles.resumenPersonas}>
                      {assigned.map((persona) => (
                        <View key={persona} style={styles.resumenChip}>
                          <Text style={styles.resumenChipText}>{persona}</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.resumenEmpty}>Sin personas asignadas</Text>
                  )}
                </View>
              </Animated.View>
            );
          })}
        </ScrollView>
      </Animated.View>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 0:
        return renderInputSection('Ej: Caja, Bodega, Recepción...', addPuesto, puestos, removePuesto, 'Agrega tu primer puesto de trabajo');
      case 1:
        return renderInputSection('Ej: Juan, María, Carlos...', addPersona, personas, removePersona, 'Agrega las personas disponibles');
      case 2:
        return renderAsignacion();
      case 3:
        return renderResumen();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.inner, { maxWidth: isWide ? 640 : '100%' }]}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <Text style={styles.header}>Horarios de Trabajo</Text>
          <Text style={styles.headerSub}>Organiza tu equipo de forma rápida y sencilla</Text>
        </Animated.View>
        {renderStepIndicator()}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{STEPS[step].icon} {STEPS[step].label}</Text>
            <Text style={styles.cardStep}>Paso {step + 1} de {STEPS.length}</Text>
          </View>
          <View style={styles.cardBody}>
            {renderCurrentStep()}
          </View>
        </View>
        <View style={styles.navRow}>
          {step > 0 && (
            <Animated.View entering={FadeIn.duration(200)} style={styles.navBtnWrap}>
              <TouchableOpacity style={styles.navBtnBack} onPress={() => goToStep(step - 1)} activeOpacity={0.8}>
                <Text style={styles.navBtnBackText}>← Atrás</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          <View style={{ flex: 1 }} />
          {step < 3 ? (
            <Animated.View entering={FadeIn.duration(200)} style={styles.navBtnWrap}>
              <TouchableOpacity
                style={[styles.navBtnNext, !canGoNext() && styles.navBtnDisabled]}
                onPress={() => { if (canGoNext()) goToStep(step + 1); }}
                activeOpacity={0.8}
              >
                <Text style={styles.navBtnNextText}>Siguiente →</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn.duration(200)} style={styles.navBtnWrap}>
              <TouchableOpacity style={styles.navBtnReset} onPress={reset} activeOpacity={0.8}>
                <Text style={styles.navBtnNextText}>🔄 Nuevo Horario</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 40 : 56,
    paddingBottom: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 4,
  },
  stepsRowWide: {
    gap: 8,
  },
  stepIndicatorItem: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 100,
    position: 'relative',
  },
  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
      default: { elevation: 1 },
    }),
  },
  stepCircleActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryBg,
    ...Platform.select({
      web: { boxShadow: '0 0 0 3px rgba(79,70,229,0.15)' },
      default: { elevation: 3 },
    }),
  },
  stepCircleDone: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successBg,
  },
  stepCircleText: {
    fontSize: 18,
  },
  stepCircleTextActive: {
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  stepLabelWide: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  stepLine: {
    position: 'absolute',
    top: 22,
    right: -20,
    width: 36,
    height: 2,
    backgroundColor: COLORS.border,
    borderRadius: 1,
  },
  stepLineDone: {
    backgroundColor: COLORS.success,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    ...Platform.select({
      web: { boxShadow: '0 4px 24px rgba(15,23,42,0.08)' },
      default: { elevation: 4 },
    }),
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#FAFBFC',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardStep: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  cardBody: {
    flex: 1,
    padding: 20,
  },
  stepContent: {
    flex: 1,
  },
  inputGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: COLORS.bg,
    color: COLORS.text,
    ...Platform.select({
      web: { outlineStyle: 'none' },
      default: {},
    }),
  },
  addBtn: {
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(79,70,229,0.3)' },
      default: { elevation: 3 },
    }),
  },
  addBtnDisabled: {
    opacity: 0.5,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  chipCount: {
    marginBottom: 12,
  },
  chipCountText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 8,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listAvatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  listCardText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  sectionHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
    flex: 1,
  },
  assignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 10,
  },
  randomBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F59E0B',
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(245,158,11,0.3)' },
      default: { elevation: 2 },
    }),
  },
  randomBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  tabsScroll: {
    maxHeight: 48,
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(79,70,229,0.3)' },
      default: { elevation: 2 },
    }),
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  badgeTextActive: {
    color: '#fff',
  },
  assignCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  assignCardActive: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primaryLight,
  },
  assignLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  checkboxActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  assignText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  assignTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  assignedBadge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  assignedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  resumenCard: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  resumenCardEmpty: {
    borderLeftColor: COLORS.textMuted,
    opacity: 0.7,
  },
  resumenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  resumenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resumenDotOk: {
    backgroundColor: COLORS.success,
  },
  resumenDotWarn: {
    backgroundColor: COLORS.textMuted,
  },
  resumenPuesto: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  resumenCount: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  resumenPersonas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  resumenChip: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  resumenChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  resumenEmpty: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    gap: 10,
  },
  navBtnWrap: {},
  navBtnBack: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  navBtnBackText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  navBtnNext: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    ...Platform.select({
      web: { boxShadow: '0 2px 12px rgba(79,70,229,0.3)' },
      default: { elevation: 3 },
    }),
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnNextText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  navBtnReset: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: COLORS.danger,
    ...Platform.select({
      web: { boxShadow: '0 2px 12px rgba(239,68,68,0.3)' },
      default: { elevation: 3 },
    }),
  },
});
