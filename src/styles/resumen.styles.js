import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants';

export const resumenStyles = StyleSheet.create({
  stepContent: {
    flex: 1,
  },

  // Stats
  statsBar: {
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statInline: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statNum: {
    fontWeight: '800',
    fontSize: 14,
    color: COLORS.primary,
  },

  // View mode toggle
  modeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modeBtnTextActive: {
    color: '#fff',
  },

  // Day tabs (for single day view)
  dayTabsScroll: {
    flexGrow: 0,
    marginBottom: 10,
  },
  dayTabsContent: {
    gap: 6,
  },
  dayTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  dayTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dayTabTextActive: {
    color: '#fff',
  },
  dayTabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  dayTabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dayTabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  dayTabBadgeTextActive: {
    color: '#fff',
  },

  // Scroll area
  scrollArea: {
    flex: 1,
  },

  // Weekly grid
  weekGrid: {
    gap: 8,
    paddingBottom: 16,
  },
  weekGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCard: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 1px 4px rgba(15,23,42,0.05)' },
      default: { elevation: 1 },
    }),
  },
  dayCardWide: {
    width: '48.5%',
  },
  dayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dayCardHeaderActive: {
    backgroundColor: COLORS.primaryBg,
    borderBottomColor: COLORS.primaryLight,
  },
  dayCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  dayCardCount: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  dayCardBody: {
    padding: 10,
    minHeight: 36,
  },
  noDayData: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },

  // Puesto row (inside day card)
  puestoRow: {
    marginBottom: 6,
  },
  puestoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  puestoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textMuted,
  },
  puestoDotOk: {
    backgroundColor: COLORS.success,
  },
  puestoName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  personasRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    paddingLeft: 12,
  },
  personaChip: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  personaChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Single day view
  singleDayCard: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  singleDayHeader: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
  },
  singleDayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  singleDayBody: {
    padding: 12,
    gap: 8,
  },
  singlePuestoCard: {
    backgroundColor: COLORS.bg,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  singlePuestoCardEmpty: {
    borderLeftColor: COLORS.textMuted,
    opacity: 0.6,
  },
  emptyPuesto: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    paddingLeft: 12,
  },
});
