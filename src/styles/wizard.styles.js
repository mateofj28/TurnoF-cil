import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants';

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
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.extraBold,
    color: COLORS.text,
    flex: 1,
    letterSpacing: -0.3,
  },
  stepBadge: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
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
