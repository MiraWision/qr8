import React from 'react';
import { Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** How far down it scales while pressed. Default 0.96 */
  activeScale?: number;
  /** Dim opacity while pressed. Default 1 (no dim) */
  activeOpacity?: number;
  haptic?: boolean;
}

/**
 * A tactile, spring-based press wrapper used across the app.
 * Gives every interactive surface a soft, premium "give" when touched.
 */
const PressableScale: React.FC<Props> = ({
  children,
  style,
  activeScale = 0.96,
  activeOpacity = 1,
  disabled,
  ...rest
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = (e: any) => {
    scale.value = withSpring(activeScale, { damping: 18, stiffness: 320, mass: 0.6 });
    if (activeOpacity !== 1) opacity.value = withTiming(activeOpacity, { duration: 90 });
    rest.onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 14, stiffness: 260, mass: 0.7 });
    if (activeOpacity !== 1) opacity.value = withTiming(1, { duration: 140 });
    rest.onPressOut?.(e);
  };

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle, disabled ? { opacity: 0.5 } : null]}
    >
      {children}
    </AnimatedPressable>
  );
};

export default PressableScale;
