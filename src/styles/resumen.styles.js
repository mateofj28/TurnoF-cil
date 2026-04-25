import { StyleSheet, Platform } from 'react-native';
import { COLORS, FONTS } from '../constants';

export const resumenStyles = StyleSheet.create({
  container: { flex: 1 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statCard: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: 10,
    paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  statCardAccent: { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primaryLight },
  statValue: { fontSize: 20, fontFamily: FONTS.extraBold, color: COLORS.text },
  statValueAccent: { color: COLORS.primary },
  statLabel: { fontSize: 11, fontFamily: FONTS.medium, color: COLORS.textMuted, marginTop: 1 },
  statLabelAccent: { color: COLORS.primary },

  // Scroll
  scrollArea: { flex: 1 },

  // Day block
  dayBlock: { marginBottom: 6 },
  dayHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.card, borderRadius: 10, paddingVertical: 11, paddingHorizontal: 12,
    borderWidth: 1, borderColor: COLORS.border,
    ...Platform.select({ web: { boxShadow: '0 1px 2px rgba(44,24,16,0.04)' }, default: { elevation: 1 } }),
  },
  dayHeaderExpanded: {
    borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomColor: 'transparent',
    backgroundColor: COLORS.primaryBg, borderColor: COLORS.primaryLight,
  },
  dayHeaderEmpty: { opacity: 0.5 },

  dayLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dayBar: { width: 3, height: 24, borderRadius: 2, backgroundColor: COLORS.border },
  dayBarActive: { backgroundColor: COLORS.primary },
  dayName: { fontSize: 15, fontFamily: FONTS.bold, color: COLORS.text },
  dayNameEmpty: { color: COLORS.textMuted, fontFamily: FONTS.medium },

  dayRight: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  workPill: { backgroundColor: COLORS.primaryBg, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  workPillText: { fontSize: 11, fontFamily: FONTS.semiBold, color: COLORS.primary },
  restPill: { backgroundColor: COLORS.accentBg, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  restPillText: { fontSize: 11, fontFamily: FONTS.semiBold, color: COLORS.accent },
  emptyText: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textMuted, fontStyle: 'italic' },
  chevron: { fontSize: 9, color: COLORS.textMuted, marginLeft: 2 },

  // Day body (expanded)
  dayBody: {
    backgroundColor: COLORS.card, borderWidth: 1, borderTopWidth: 0,
    borderColor: COLORS.primaryLight, borderBottomLeftRadius: 10, borderBottomRightRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  puestoBlock: { marginBottom: 8 },
  puestoName: { fontSize: 13, fontFamily: FONTS.bold, color: COLORS.text, marginBottom: 4 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  personChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.bg, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  personDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.primary },
  personChipText: { fontSize: 12, fontFamily: FONTS.semiBold, color: COLORS.text },

  // Rest
  restBlock: { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderTopColor: COLORS.border },
  restLabel: { fontSize: 12, fontFamily: FONTS.semiBold, color: COLORS.accent, marginBottom: 4 },
  restChip: { backgroundColor: COLORS.accentBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  restChipText: { fontSize: 12, fontFamily: FONTS.semiBold, color: COLORS.accent },

  // Share
  shareSection: { flexDirection: 'row', gap: 8, marginTop: 10, marginBottom: 8 },
  whatsappBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#25D366', alignItems: 'center',
    ...Platform.select({ web: { boxShadow: '0 2px 8px rgba(37,211,102,0.25)' }, default: { elevation: 2 } }),
  },
  whatsappBtnText: { fontSize: 13, fontFamily: FONTS.bold, color: '#fff' },
  copyBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: COLORS.card,
    borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
  },
  copyBtnText: { fontSize: 13, fontFamily: FONTS.semiBold, color: COLORS.textSecondary },
});
