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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 32 : 52,
    paddingBottom: 12,
  },
});
