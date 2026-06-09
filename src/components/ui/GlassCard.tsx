import React from 'react';
import { StyleSheet, ViewStyle, StyleProp, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  /** subtle = lower contrast surface */
  subtle?: boolean;
}

/**
 * A frosted-glass surface: faint top-lit gradient + hairline border.
 * The building block for cards, sheets and panels.
 */
const GlassCard: React.FC<Props> = ({ children, style, radius = theme.borderRadius.lg, subtle }) => {
  return (
    <View style={[styles.shadow, { borderRadius: radius }, style]}>
      <LinearGradient
        colors={subtle ? (['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.015)'] as const) : theme.gradients.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.surface, { borderRadius: radius }]}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  surface: {
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    overflow: 'hidden',
  },
});

export default GlassCard;
