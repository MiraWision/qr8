import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary' }) => {
  return (
    <ButtonContainer onPress={onPress} variant={variant}>
      <ButtonText variant={variant}>{title}</ButtonText>
    </ButtonContainer>
  );
};

const ButtonContainer = styled(TouchableOpacity)<{ variant: 'primary' | 'secondary' }>`
  background-color: ${props => props.variant === 'primary' ? '#007AFF' : '#E5E5EA'};
  padding: 12px 24px;
  border-radius: 8px;
  min-width: 120px;
`;

const ButtonText = styled(Text)<{ variant: 'primary' | 'secondary' }>`
  color: ${props => props.variant === 'primary' ? '#ffffff' : '#333'};
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

export { Button };
