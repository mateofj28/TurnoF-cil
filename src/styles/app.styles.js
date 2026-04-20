import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants';

export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 40 : 56,
    paddingBottom: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    ...Platform.select({
      web: { boxShadow: '0 4px 24px rgba(15,23,42,0.08)' },
      default: { elevation: 4 },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: '#FAFBFC',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardStep: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  cardBody: {
    flex: 1,
    padding: 20,
  },
  backBtn: {
    marginBottom: 8,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
