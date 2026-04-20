import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants';

export const inputSectionStyles = StyleSheet.create({
  stepContent: {
    flex: 1,
  },
  inputGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: COLORS.bg,
    color: COLORS.text,
    ...Platform.select({
      web: { outlineStyle: 'none' },
      default: {},
    }),
  },
  addBtn: {
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(79,70,229,0.3)' },
      default: { elevation: 3 },
    }),
  },
  addBtnDisabled: {
    opacity: 0.5,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  chipCount: {
    marginBottom: 12,
  },
  chipCountText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 8,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listAvatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  listCardText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
