import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants';

export const asignacionStyles = StyleSheet.create({
  stepContent: {
    flex: 1,
  },
  sectionHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
    flex: 1,
  },
  assignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 10,
  },
  randomBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F59E0B',
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(245,158,11,0.3)' },
      default: { elevation: 2 },
    }),
  },
  randomBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  assignRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 0,
  },
  assignColLeft: {
    width: 220,
    paddingRight: 12,
  },
  assignDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  assignColRight: {
    flex: 1,
    paddingLeft: 12,
  },
  colTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  puestosCol: {
    flex: 1,
  },
  puestoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  puestoItemActive: {
    backgroundColor: COLORS.primaryBg,
  },
  puestoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  puestoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  puestoDotActive: {
    backgroundColor: COLORS.primary,
  },
  puestoItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  puestoItemTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  tabsScroll: {
    flexGrow: 0,
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(79,70,229,0.3)' },
      default: { elevation: 2 },
    }),
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  badgeTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: 8,
  },
  assignCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  assignCardActive: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primaryLight,
  },
  assignCardDisabled: {
    opacity: 0.5,
  },
  assignLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  checkboxActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkboxDisabled: {
    borderColor: COLORS.textMuted,
    backgroundColor: COLORS.bg,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  assignText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  assignTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  assignTextDisabled: {
    color: COLORS.textMuted,
  },
  assignCountHint: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  assignedBadge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  assignedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  maxedBadge: {
    backgroundColor: COLORS.dangerBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  maxedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
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
