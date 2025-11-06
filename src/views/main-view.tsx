import React from 'react';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';

interface Props {
  onNavigate: (screen: string) => void;
}

const MainView: React.FC<Props> = ({ onNavigate }) => {
  return (
    <Container>
      <Content>
        <Title>Welcome to Your App</Title>
        <Description>Your app template is ready!</Description>
        <Info>Check src/ directory to start building</Info>
      </Content>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 16px;
`;

const Description = styled.Text`
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-bottom: 24px;
`;

const Info = styled.Text`
  font-size: 14px;
  color: #999;
  text-align: center;
  font-style: italic;
`;

export { MainView };
