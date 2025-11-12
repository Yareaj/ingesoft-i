import { StyleSheet } from 'react-native';
import { theme } from './designSystem';

export const commonStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.l, backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border, borderBottomWidth: 1 },
  headerText: { color: theme.colors.textPrimary, fontSize: theme.typography.size.xxl, fontWeight: '700' },
  sectionSurface: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.l },
  center: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: theme.colors.textSecondary, fontSize: theme.typography.size.l, textAlign: 'center' },
  profileImageBorder: { borderColor: theme.colors.primary, borderWidth: 4 },
});
