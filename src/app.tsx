import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Abel_400Regular } from '@expo-google-fonts/abel';
import { LibraryIcon } from '../assets/images/icons/navigation/library-icon';
import { QRCodeAddIcon } from '../assets/images/icons/navigation/qr-code-add-icon';
import { QRCodeScannerIcon } from '../assets/images/icons/navigation/qr-code-scanner-icon';

import LibraryScreen from './screens/LibraryScreen';
import CreateScreen from './screens/CreateScreen';
import ScannerScreen from './screens/ScannerScreen';
import { createTestData } from './utils/testData';
import { theme } from './theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function LibraryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="LibraryMain" 
        component={LibraryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Create" 
        component={CreateScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ScannerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ScannerMain" 
        component={ScannerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateScreen" 
        component={CreateScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const TabNavigatorContent: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.borderLight,
          borderTopWidth: 1,
          height: 70 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 12),
          paddingTop: 12,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fonts.family,
          fontSize: theme.fonts.sizes.sm,
          fontWeight: theme.fonts.weights.regular,
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Library') {
            return <LibraryIcon size={size} color={color} />;
          } else if (route.name === 'Create') {
            return <QRCodeAddIcon size={size} color={color} />;
          } else if (route.name === 'Scanner') {
            return <QRCodeScannerIcon size={size} color={color} />;
          }
          return null;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Library" 
        component={LibraryStack}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateScreen}
      />
      <Tab.Screen 
        name="Scanner" 
        component={ScannerStack}
      />
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
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <TabNavigatorContent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;