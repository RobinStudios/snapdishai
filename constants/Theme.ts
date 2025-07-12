import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const Theme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
  },
  typography: {
    fontFamily: {
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semiBold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      '3xl': 30,
      '4xl': 36,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 8,
    },
  },
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  screenContainer: {
    flex: 1,
    padding: Theme.spacing.md,
    backgroundColor: Colors.background.main,
  },
  screenContainerNoMargin: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: Colors.background.transparent,
  },
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  cardElevated: {
    backgroundColor: Colors.background.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  textCenter: {
    textAlign: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  heading1: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xxl,
    color: Colors.text.primary,
    lineHeight: Theme.typography.fontSize.xxl * Theme.typography.lineHeight.normal,
  },
  heading2: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.xl,
    color: Colors.text.primary,
    lineHeight: Theme.typography.fontSize.xl * Theme.typography.lineHeight.normal,
  },
  heading3: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.lg,
    color: Colors.text.primary,
    lineHeight: Theme.typography.fontSize.lg * Theme.typography.lineHeight.normal,
  },
  bodyText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Colors.text.primary,
    lineHeight: Theme.typography.fontSize.md * Theme.typography.lineHeight.normal,
  },
  bodyTextSmall: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Theme.typography.fontSize.sm * Theme.typography.lineHeight.normal,
  },
  capsText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.xs,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary.tomato,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Colors.text.light,
  },
  buttonSecondary: {
    backgroundColor: Colors.background.card,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  buttonSecondaryText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  fullWidth: {
    width: '100%',
  },
  badge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.primary.basil,
  },
  badgeText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.xs,
    color: Colors.text.light,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.primary.tomato,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.md,
    color: Colors.text.light,
  },
});

export default { Theme, GlobalStyles };