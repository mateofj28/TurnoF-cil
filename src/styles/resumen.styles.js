import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants';

export const resumenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ==================== STATS ====================
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardAccent: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primaryLight,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  statValueAccent: {
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginTop: 1,
  },
  statLabelAccent: {
    color: COLORS.primary,
  },

  // ==================== SCROLL ====================
  scrollArea: {
    flex: 1,
  },

  // ==================== WEEK GRID ====================
  weekGrid: {
    gap: 6,
    paddingBottom: 8,
  },
  weekGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weekItemWide: {
    width: '48.5%',
  },

  // ==================== DAY ROW (accordion) ====================
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(15,23,42,0.04)' },
      default: { elevation: 1 },
    }),
  },
  dayRowExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primaryLight,
  },
  dayRowEmpty: {
    opacity: 0.55,
  },

  dayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dayIndicator: {
    width: 4,
    height: 28,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  dayIndicatorActive: {
    backgroundColor: COLORS.primary,
  },
  dayName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  dayNameEmpty: {
    color: COLORS.textMuted,
    fontWeight: '500',
  },

  dayRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countPill: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  restPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  restPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  dayEmptyText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  chevron: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginLeft: 4,
  },

  // ==================== DETAIL (expanded) ====================
  detail: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: COLORS.primaryLight,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 14,
    marginBottom: 2,
  },
  detailTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  // Puesto inside detail
  detailPuesto: {
    marginBottom: 10,
  },
  detailPuestoName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 5,
  },
  detailChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  detailChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },

  // Rest inside detail
  detailRest: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailRestLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 5,
  },
  detailRestChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  detailRestChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },

  // ==================== SHARE BAR ====================
  shareBar: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 10,
  },
  whatsappBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#25D366',
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(37,211,102,0.25)' },
      default: { elevation: 2 },
    }),
  },
  whatsappBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  copyBtn: {
    width: 44,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyBtnText: {
    fontSize: 16,
  },
});
