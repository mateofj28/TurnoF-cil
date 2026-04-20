import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  LinearTransition,
} from 'react-native-reanimated';
import { inputSectionStyles as styles } from '../styles/inputSection.styles';
import { COLORS } from '../constants';

export const InputSection = ({
  placeholder,
  inputValue,
  onChangeText,
  onAdd,
  items,
  onRemove,
  emptyMsg,
  emptyIcon,
  enteringAnimation,
  stepKey,
}) => (
  <Animated.View entering={enteringAnimation} key={stepKey} style={styles.stepContent}>
    <View style={styles.inputGroup}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={inputValue}
          onChangeText={onChangeText}
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
      <Text style={styles.chipCountText}>
        {items.length} registrado{items.length !== 1 ? 's' : ''}
      </Text>
    </View>
    <FlatList
      data={items}
      keyExtractor={(item) => item}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item, index }) => (
        <Animated.View
          entering={FadeInDown.delay(index * 50).duration(300)}
          layout={LinearTransition.springify()}
        >
          <View style={styles.listCard}>
            <View style={styles.listCardLeft}>
              <View style={styles.listAvatar}>
                <Text style={styles.listAvatarText}>
                  {item.charAt(0).toUpperCase()}
                </Text>
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
          <Text style={styles.emptyIcon}>{emptyIcon}</Text>
          <Text style={styles.emptyText}>{emptyMsg}</Text>
        </Animated.View>
      }
    />
  </Animated.View>
);
