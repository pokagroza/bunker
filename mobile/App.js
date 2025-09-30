import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Screens
import MainMenuScreen from './src/screens/MainMenuScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import GameScreen from './src/screens/GameScreen';
import AdminScreen from './src/screens/AdminScreen';

// Socket context
import { SocketProvider } from './src/context/SocketContext';

const Stack = createNativeStackNavigator();

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Делаем загрузку шрифтов опциональной
  const [fontsLoaded] = useFonts({});

  useEffect(() => {
    // Скрываем заставку через небольшую задержку
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SocketProvider>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: '#00ff88',
            background: '#1a1a1a',
            card: '#2a2a2a',
            text: '#ffffff',
            border: '#444444',
            notification: '#ff4444',
          },
        }}
      >
        <StatusBar style="light" backgroundColor="#1a1a1a" />
        <Stack.Navigator
          initialRouteName="MainMenu"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1a1a1a',
            },
            headerTintColor: '#00ff88',
            headerTitleStyle: {
              fontFamily: 'Orbitron-Bold',
              fontSize: 18,
            },
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen 
            name="MainMenu" 
            component={MainMenuScreen}
            options={{ 
              title: '🏠 БУНКЕР',
              headerShown: false 
            }}
          />
          <Stack.Screen 
            name="Lobby" 
            component={LobbyScreen}
            options={{ 
              title: 'Лобби игры',
              headerLeft: () => null,
              gestureEnabled: false
            }}
          />
          <Stack.Screen 
            name="Game" 
            component={GameScreen}
            options={{ 
              title: 'Игра',
              headerLeft: () => null,
              gestureEnabled: false
            }}
          />
          <Stack.Screen 
            name="Admin" 
            component={AdminScreen}
            options={{ 
              title: 'Панель администратора',
              headerLeft: () => null,
              gestureEnabled: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketProvider>
  );
}