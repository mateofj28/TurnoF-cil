import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants';

export const asignacionStyles = StyleSheet.create({
  stepContent: {
    flex: 1,
  },

  // Day selector
  dayScroll: {
    flexGrow: 0,
    marginBottom: 12,
  },
  dayScrollContent: {
    gap: 6,
  },
  dayChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  dayChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(79,70,229,0.3)' },
      default: { elevation: 2 },
    }),
  },
  dayChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dayChipTextActive: {
    color: '#fff',
  },
  dayBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  dayBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dayBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dayBadgeTextActive: {
    color: '#fff',
  },

  // Header
  sectionHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  assignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  randomBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F59E0B',
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(245,158,11,0.3)' },
      default: { elevation: 2 },
    }),
  },
  randomWeekBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.success,
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(16,185,129,0.3)' },
      default: { elevation: 2 },
    }),
  },
  randomBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },

  // Wide layout
  assignRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 0,
  },
  assignColLeft: {
    width: 200,
    paddingRight: 10,
  },
  assignDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  assignColRight: {
    flex: 1,
    paddingLeft: 10,
  },
  colTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  puestosCol: {
    flex: 1,
  },
  puestoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 3,
  },
  puestoItemActive: {
    backgroundColor: COLORS.primaryBg,
  },
  puestoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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

  // Mobile tabs
  tabsScroll: {
    flexGrow: 0,
    marginBottom: 10,
  },
  tabsContent: {
    gap: 6,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
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
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },

  // Badges
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  badgeTextActive: {
    color: '#fff',
  },

  // Personas list
  listContent: {
    paddingBottom: 8,
  },
  assignCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 6,
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
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
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
    fontSize: 13,
    fontWeight: '700',
  },
  assignText: {
    fontSize: 14,
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
  assignedBadge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  assignedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.success,
  },
  maxedBadge: {
    backgroundColor: COLORS.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  maxedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.danger,
  },

  // Empty
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
