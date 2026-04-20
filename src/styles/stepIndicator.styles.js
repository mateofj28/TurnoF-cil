import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants';

export const stepIndicatorStyles = StyleSheet.create({
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
});
