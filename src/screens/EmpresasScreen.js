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
import { useEmpresas } from '../hooks';
import { empresasStyles as styles } from '../styles/empresas.styles';

export const EmpresasScreen = ({ onSelectEmpresa }) => {
  const { empresas, addEmpresa, removeEmpresa } = useEmpresas();
  const [inputValue, setInputValue] = useState('');

  const handleAdd = async () => {
    const name = inputValue.trim();
    if (!name) return;
    if (empresas.some((e) => e.name === name)) return;
    await addEmpresa(name);
    setInputValue('');
  };

  const handleRemove = (empresa) => {
    const doRemove = () => removeEmpresa(empresa.id);
    if (Platform.OS === 'web') {
      if (window.confirm(`¿Eliminar "${empresa.name}"? Se perderán todos sus horarios.`)) {
        doRemove();
      }
    } else {
      Alert.alert(
        'Eliminar empresa',
        `¿Eliminar "${empresa.name}"? Se perderán todos sus horarios.`,
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
        <Text style={styles.header}>TurnoFácil</Text>
        <Text style={styles.headerSub}>Selecciona o crea una empresa</Text>
      </Animated.View>

      <View style={styles.inputGroup}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la empresa..."
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
        data={empresas}
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
              onPress={() => onSelectEmpresa(item)}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardSub}>Toca para ver horarios</Text>
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
            <Text style={styles.emptyIcon}>🏢</Text>
            <Text style={styles.emptyText}>Crea tu primera empresa</Text>
          </Animated.View>
        }
      />
    </View>
  );
};
