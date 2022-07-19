import React from 'react';
import { useColorScheme } from 'react-native';
import * as eva from '@eva-design/eva';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { ApplicationProvider } from '@ui-kitten/components';
import { Home } from './src/screens/Home';

export default function App() {
  const colorScheme = useColorScheme();
  //console.log(colorScheme);

  return (
      <ApplicationProvider {...eva} theme={colorScheme === 'light' ? eva.light : eva.dark}>
        <ExpoStatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Home theme={colorScheme} />
      </ApplicationProvider>    
  );
};
