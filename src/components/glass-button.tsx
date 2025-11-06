import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';

import { Glass } from './glass';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  borderRadius?: number;
}

const GlassButton: React.FC<GlassButtonProps> = ({ 
  title, 
  onPress, 
  style, 
  textStyle,
  disabled = false,
  borderRadius = 8
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const glowBoost = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 150 });
    opacity.value = withTiming(0.9, { duration: 120 });
    glowBoost.value = withTiming(1, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 250, overshootClamping: false, mass: 1 });
    opacity.value = withTiming(1, { duration: 120 });
    glowBoost.value = withTiming(0, { duration: 180 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ borderRadius }, animatedStyle, style]}>
      <StyledTouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        borderRadius={borderRadius}
      >
        <Glass borderRadius={borderRadius} glowBoost={glowBoost}>
          <ButtonText style={textStyle}>{title}</ButtonText>
        </Glass>
      </StyledTouchableOpacity>
    </Animated.View>
  );
};

const StyledTouchableOpacity = styled(TouchableOpacity).attrs<{ borderRadius: number }>(props => ({
  style: {
    borderRadius: props.borderRadius,
  },
}))<{ borderRadius: number }>``;

const ButtonText = styled(Text).attrs(() => ({
  style: {
    textShadowColor: 'rgba(255, 255, 255, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}))`
  font-family: 'Orbitron';
  font-size: 18px;
  font-weight: 400;
  color: #FFFFFF;
  text-align: center;
  padding: 16px 24px;
`;

export { GlassButton };
