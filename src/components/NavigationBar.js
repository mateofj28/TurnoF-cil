import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { navigationStyles as styles } from '../styles/navigation.styles';

export const NavigationBar = ({ step, totalSteps, canGoNext, onBack, onNext, onReset }) => (
  <View style={styles.navRow}>
    {step > 0 && (
      <Animated.View entering={FadeIn.duration(200)} style={styles.navBtnWrap}>
        <TouchableOpacity style={styles.navBtnBack} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.navBtnBackText}>← Atrás</Text>
        </TouchableOpacity>
      </Animated.View>
    )}
    <View style={{ flex: 1 }} />
    {step < totalSteps - 1 ? (
      <Animated.View entering={FadeIn.duration(200)} style={styles.navBtnWrap}>
        <TouchableOpacity
          style={[styles.navBtnNext, !canGoNext && styles.navBtnDisabled]}
          onPress={() => { if (canGoNext) onNext(); }}
          activeOpacity={0.8}
        >
          <Text style={styles.navBtnNextText}>Siguiente →</Text>
        </TouchableOpacity>
      </Animated.View>
    ) : (
      <Animated.View entering={FadeIn.duration(200)} style={styles.navBtnWrap}>
        <TouchableOpacity style={styles.navBtnReset} onPress={onReset} activeOpacity={0.8}>
          <Text style={styles.navBtnNextText}>🔄 Nuevo Horario</Text>
        </TouchableOpacity>
      </Animated.View>
    )}
  </View>
);
