import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { COLORS } from '../constants';
import { capitalize } from '../utils';
import { useHorarios } from '../hooks';
import { horariosStyles as styles } from '../styles/horarios.styles';

export const HorariosScreen = ({ empresa, onSelectHorario, onBack }) => {
  const { horarios, addHorario, removeHorario } = useHorarios(empresa.id);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = async () => {
    const name = inputValue.trim();
    if (!name) return;
    if (horarios.some((h) => h.name === name)) return;
    await addHorario(name);
    setInputValue('');
  };

  const handleRemove = (horario) => {
    const doRemove = () => removeHorario(horario.id);
    if (Platform.OS === 'web') {
      if (window.confirm(`¿Eliminar horario "${horario.name}"?`)) {
        doRemove();
      }
    } else {
      Alert.alert(
        'Eliminar horario',
        `¿Eliminar "${horario.name}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', style: 'destructive', onPress: doRemove },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(500)}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>← Empresas</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{empresa.name}</Text>
        <Text style={styles.headerSub}>Horarios de trabajo</Text>
      </Animated.View>

      <View style={styles.inputGroup}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ej: Semana 1, Turno Mañana..."
            placeholderTextColor={COLORS.textMuted}
            value={inputValue}
            onChangeText={(t) => setInputValue(capitalize(t))}
            onSubmitEditing={handleAdd}
          />
        </View>
        <TouchableOpacity
          style={[styles.addBtn, !inputValue.trim() && styles.addBtnDisabled]}
          onPress={handleAdd}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>Crear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={horarios}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 60).duration(300)}
            layout={LinearTransition.springify()}
          >
            <TouchableOpacity
              style={styles.card}
              onPress={() => onSelectHorario(item)}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>📋</Text>
                </View>
                <View>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSub}>Toca para editar</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemove(item)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        )}
        ListEmptyComponent={
          <Animated.View entering={FadeIn.duration(400)} style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Crea tu primer horario</Text>
          </Animated.View>
        }
      />
    </View>
  );
};
