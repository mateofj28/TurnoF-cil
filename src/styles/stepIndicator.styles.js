import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants';

export const stepIndicatorStyles = StyleSheet.create({
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 4,
  },
  stepsRowWide: {
    gap: 8,
  },
  stepIndicatorItem: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 90,
    position: 'relative',
  },
  stepCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    fontSize: 16,
  },
  stepCircleTextActive: {
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  stepLabelWide: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  stepLine: {
    position: 'absolute',
    top: 19,
    right: -16,
    width: 28,
    height: 2,
    backgroundColor: COLORS.border,
    borderRadius: 1,
  },
  stepLineDone: {
    backgroundColor: COLORS.success,
  },
});
