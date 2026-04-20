import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants';

export const navigationStyles = StyleSheet.create({
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
    gap: 10,
  },
  navBtnWrap: {},
  navBtnBack: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  navBtnBackText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  navBtnNext: {
    paddingVertical: 10,
    paddingHorizontal: 22,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  navBtnReset: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
    backgroundColor: COLORS.danger,
    ...Platform.select({
      web: { boxShadow: '0 2px 12px rgba(239,68,68,0.3)' },
      default: { elevation: 3 },
    }),
  },
});
