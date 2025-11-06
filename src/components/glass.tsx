import React from 'react';
import styled from 'styled-components/native';
import { ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

interface GlassProps {
  children: React.ReactNode;
  style?: ViewStyle;
  innerShadowColor?: string;
  innerShadowOpacity?: number;
  borderRadius?: number;
  glowBoost?: any; // Reanimated shared value number (0..1)
}

const Glass: React.FC<GlassProps> = ({ 
  children, 
  style, 
  innerShadowColor = '#29B6F6',
  innerShadowOpacity = 0.35,
  borderRadius = 12,
  glowBoost
}) => {
  const outerGlowStyle = useAnimatedStyle(() => {
    const boost = glowBoost?.value ?? 0;
    return {
      shadowOpacity: 0.3 + boost * 0.15,
      shadowRadius: 20 + boost * 3,
    } as any;
  });

  const innerGlowStyle = useAnimatedStyle(() => {
    const boost = glowBoost?.value ?? 0;
    return {
      shadowOpacity: innerShadowOpacity + boost * 0.15,
      shadowRadius: 16 + boost * 3,
    } as any;
  });

  return (
    <OuterShadow style={[style, outerGlowStyle]} borderRadius={borderRadius}>
      <ClipContainer borderRadius={borderRadius}>
        <InnerGlow
          innerShadowColor={innerShadowColor}
          innerShadowOpacity={innerShadowOpacity}
          borderRadius={borderRadius}
          style={[innerGlowStyle, absoluteFill]}
        />
        {children}
      </ClipContainer>
    </OuterShadow>
  );
};

const OuterShadow = styled(Animated.View).attrs<{ borderRadius: number }>(props => ({
  style: {
    borderRadius: props.borderRadius,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
}))<{
  borderRadius: number;
}>``;

const ClipContainer = styled.View.attrs<{
  borderRadius: number;
}>(props => ({
  style: {
    borderRadius: props.borderRadius,
  },
}))<{
  borderRadius: number;
}>`
  background-color: rgba(255, 255, 255, 0.08);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.3);
  overflow: hidden;
`;

const InnerGlow = styled(Animated.View).attrs<{
  innerShadowColor: string;
  innerShadowOpacity: number;
  borderRadius: number;
}>(props => ({
  style: {
    shadowColor: props.innerShadowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: props.innerShadowOpacity,
    shadowRadius: 16,
    borderRadius: props.borderRadius,
  },
}))<{
  innerShadowColor: string;
  innerShadowOpacity: number;
  borderRadius: number;
}>``;

const absoluteFill = {
  position: 'absolute' as const,
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

export { Glass };
