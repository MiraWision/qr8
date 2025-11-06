import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import styled from 'styled-components/native';

interface Props {
  children: React.ReactNode;
}

const GradientBackground: React.FC<Props> = ({ children }) => {
  return (
    <GradientContainer
      colors={['#0F2027', '#203A43', '#2C5364']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.2, y: 1 }}
    >
      <NoiseContainer pointerEvents="none">
        <NoiseOverlay
          source={require('../../assets/images/backgrounds/noise.png')}
          resizeMode="repeat"
        />
      </NoiseContainer>
      {children}
    </GradientContainer>
  );
};

const GradientContainer = styled(LinearGradient)`
  flex: 1;
`;

const NoiseContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const NoiseOverlay = styled(Image)`
  width: 100%;
  height: 100%;
`;

export { GradientBackground };
