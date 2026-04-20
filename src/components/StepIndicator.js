import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { STEPS } from '../constants';
import { stepIndicatorStyles as styles } from '../styles/stepIndicator.styles';

export const StepIndicator = ({ currentStep, isWide, onGoToStep }) => (
  <View style={[styles.stepsRow, isWide && styles.stepsRowWide]}>
    {STEPS.map((s, i) => {
      const isActive = i === currentStep;
      const isDone = i < currentStep;
      return (
        <Animated.View
          key={s.key}
          entering={FadeInDown.delay(i * 80).duration(400)}
          style={styles.stepIndicatorItem}
        >
          <TouchableOpacity
            onPress={() => { if (isDone) onGoToStep(i); }}
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
          {i < STEPS.length - 1 && (
            <View style={[styles.stepLine, isDone && styles.stepLineDone]} />
          )}
        </Animated.View>
      );
    })}
  </View>
);
