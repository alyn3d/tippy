import React from 'react';
import { useColorScheme } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { Home } from './src/screens/Home';

export default function App() {
  const colorScheme = useColorScheme();
  console.log(colorScheme);

  return (
      <ApplicationProvider {...eva} theme={colorScheme === 'light' ? eva.light : eva.dark}>
        <Home theme={colorScheme} />
      </ApplicationProvider>    
  );
};
