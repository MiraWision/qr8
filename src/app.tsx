import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Abel_400Regular } from '@expo-google-fonts/abel';

import LibraryScreen from './screens/LibraryScreen';
import CreateScreen from './screens/CreateScreen';
import ScannerScreen from './screens/ScannerScreen';
import FloatingTabBar from './components/ui/FloatingTabBar';
import { createTestData } from './utils/testData';
import { theme } from './theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.background,
    text: theme.colors.text,
    border: 'transparent',
    primary: theme.colors.primary,
  },
};

function LibraryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: theme.colors.background } }}>
      <Stack.Screen name="LibraryMain" component={LibraryScreen} />
      <Stack.Screen name="Create" component={CreateScreen} />
    </Stack.Navigator>
  );
}

function ScannerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: theme.colors.background } }}>
      <Stack.Screen name="ScannerMain" component={ScannerScreen} />
      <Stack.Screen name="CreateScreen" component={CreateScreen} />
    </Stack.Navigator>
  );
}

const TabNavigatorContent: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Tab.Screen name="Library" component={LibraryStack} options={{ title: 'Library' }} />
      <Tab.Screen name="Create" component={CreateScreen} options={{ title: 'Create' }} />
      <Tab.Screen name="Scanner" component={ScannerStack} options={{ title: 'Scan' }} />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Abel_400Regular,
  });

  useEffect(() => {
    createTestData().catch(console.error);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer theme={navTheme}>
          <TabNavigatorContent />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
