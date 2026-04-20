import { StyleSheet } from 'react-native';
import { COLORS } from '../constants';

export const resumenStyles = StyleSheet.create({
  stepContent: {
    flex: 1,
  },
  statsRowCompact: {
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.bg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statInline: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statInlineNum: {
    fontWeight: '800',
    fontSize: 15,
    color: COLORS.primary,
  },
  resumenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resumenGridWide: {
    gap: 10,
  },
  resumenGridItem: {
    width: '100%',
  },
  resumenGridItemWide: {
    width: '48.5%',
  },
  resumenCard: {
    backgroundColor: COLORS.bg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
    flex: 1,
  },
  resumenCardEmpty: {
    borderLeftColor: COLORS.textMuted,
    opacity: 0.6,
  },
  resumenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  resumenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resumenDotOk: {
    backgroundColor: COLORS.success,
  },
  resumenDotWarn: {
    backgroundColor: COLORS.textMuted,
  },
  resumenPuesto: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  resumenPersonas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  resumenChip: {
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  resumenChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  resumenEmpty: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
});
