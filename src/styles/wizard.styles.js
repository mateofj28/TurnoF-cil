import { StyleSheet } from 'react-native';
import { COLORS } from '../constants';

export const wizardStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  topBar: {
    marginBottom: 16,
  },
  backBtn: {
    marginBottom: 6,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
    letterSpacing: -0.3,
  },
  stepBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 10,
  },
  content: {
    flex: 1,
  },
});
