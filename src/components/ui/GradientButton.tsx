import React from 'react';
import { Text, StyleSheet, ViewStyle, StyleProp, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PressableScale from './PressableScale';
import { theme } from '../../theme';

interface Props {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'glass' | 'danger';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  size?: 'md' | 'lg';
}

/**
 * The app's hero call-to-action. Gradient fill + soft glow for primary,
 * translucent glass for secondary actions.
 */
const GradientButton: React.FC<Props> = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  style,
  disabled,
  size = 'lg',
}) => {
  const padV = size === 'lg' ? 17 : 13;

  if (variant === 'glass') {
    return (
      <PressableScale onPress={onPress} disabled={disabled} style={[styles.shadowWrap, style]}>
        <View style={[styles.glass, { paddingVertical: padV }]}>
          {icon}
          <Text style={[styles.text, styles.glassText, icon ? styles.textWithIcon : null]}>
            {title}
          </Text>
        </View>
      </PressableScale>
    );
  }

  const colors =
    variant === 'danger'
      ? (['#FF7A8A', '#E11D48'] as const)
      : theme.gradients.brand;

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      style={[styles.shadowWrap, variant === 'primary' ? styles.glow : null, style]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { paddingVertical: padV }]}
      >
        {icon}
        <Text style={[styles.text, icon ? styles.textWithIcon : null]}>{title}</Text>
      </LinearGradient>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: theme.borderRadius.md,
  },
  glow: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  glass: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  text: {
    color: theme.colors.onPrimary,
    fontSize: theme.fonts.sizes.md,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.semibold,
    letterSpacing: 0.4,
  },
  glassText: {
    color: theme.colors.text,
  },
  textWithIcon: {
    marginLeft: 2,
  },
});

export default GradientButton;
